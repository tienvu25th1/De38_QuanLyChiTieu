const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const authenticate = require('../middleware/auth.middleware');
const env = require('../config/env');

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const accountTypes = ['cash', 'bank', 'wallet'];
const paymentMethods = ['cash', 'bank', 'wallet', 'card', 'other'];
const fail = (res, message, status = 400) => res.status(status).json({ message });
const data = (res, value, status = 200) => res.status(status).json({ data: value });
const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(error => {
  if (error.code === '23505') return fail(res, 'A resource with these details already exists.', 409);
  if (error.code === '23503' || error.code === '23514') return fail(res, 'The requested change conflicts with existing data.', 409);
  return next(error);
});
const validId = value => uuid.test(value || '');
const validName = (value, max = 100) => typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max;
const validAmount = value => Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= 999999999999;
const validSignedAmount = value => Number.isFinite(Number(value)) && Math.abs(Number(value)) <= 999999999999;
const positiveAmount = value => validAmount(value) && Number(value) > 0;
const validDate = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  return !Number.isNaN(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value;
};
const router = () => {
  const result = express.Router();
  result.use(authenticate);
  return result;
};
const routes = {
  categories: router(),
  accounts: router(),
  transfers: router(),
  budgets: router(),
  goals: router(),
  families: router(),
  notifications: router(),
  profile: router(),
  admin: router(),
  imports: router(),
};

async function familyMembership(userId, familyId) {
  const result = await pool.query(
    `SELECT fm.role, fm.status, f.name FROM family_members fm
     JOIN families f ON f.id = fm.family_id
     WHERE fm.user_id = $1 AND fm.family_id = $2`,
    [userId, familyId],
  );
  return result.rows[0] || null;
}

async function requireFamily(req, res, familyId, managerOnly = false) {
  if (!validId(familyId)) {
    fail(res, 'Invalid family id.');
    return null;
  }
  const member = await familyMembership(req.user.id, familyId);
  if (!member || member.status !== 'ACTIVE') {
    fail(res, 'Family not found or access denied.', 403);
    return null;
  }
  if (managerOnly && !['OWNER', 'MANAGER'].includes(member.role)) {
    fail(res, 'Family manager permissions are required.', 403);
    return null;
  }
  return member;
}

function notify(client, userId, type, title, message, payload = {}) {
  return client.query(
    `INSERT INTO notifications (user_id, type, title, message, payload)
     VALUES ($1, $2, $3, $4, $5::jsonb)`,
    [userId, type, title, message, JSON.stringify(payload)],
  );
}

async function accountBalance(db, accountId) {
  const result = await db.query(
    `SELECT a.opening_balance
       + COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'in'), 0)
       - COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'out'), 0)
       + COALESCE((SELECT SUM(tr.amount) FROM transfers tr WHERE tr.to_account = a.id), 0)
       - COALESCE((SELECT SUM(tr.amount) FROM transfers tr WHERE tr.from_account = a.id), 0)
       + COALESCE((SELECT SUM(adj.amount) FROM account_adjustments adj WHERE adj.account_id = a.id), 0) AS balance
     FROM accounts a
     LEFT JOIN transactions t ON t.account_id = a.id
     WHERE a.id = $1
     GROUP BY a.id`,
    [accountId],
  );
  return result.rows[0] && result.rows[0].balance;
}

function accountAccess(userId) {
  return `((a.family_id IS NULL AND a.user_id = ${userId}) OR
    (a.family_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM family_members fm WHERE fm.family_id = a.family_id
      AND fm.user_id = ${userId} AND fm.status = 'ACTIVE'
    )))`;
}

// Categories are global defaults, personal categories, and categories of accessible families.
routes.categories.get('/', wrap(async (req, res) => {
  const includeHidden = req.query.include_hidden === 'true';
  const includeInactive = req.query.include_inactive === 'true';
  const result = await pool.query(
    `SELECT c.*, p.name AS parent_name
     FROM categories c LEFT JOIN categories p ON p.id = c.parent_id
     WHERE ((c.user_id IS NULL AND c.family_id IS NULL) OR c.user_id = $1
        OR (c.family_id IS NOT NULL AND EXISTS (
          SELECT 1 FROM family_members fm WHERE fm.family_id = c.family_id
          AND fm.user_id = $1 AND fm.status = 'ACTIVE'
        )))
       AND ($2::boolean OR c.is_hidden = FALSE)
       AND ($3::boolean OR c.is_active = TRUE)
     ORDER BY c.type, c.name`,
    [req.user.id, includeHidden, includeInactive],
  );
  return data(res, { categories: result.rows });
}));

routes.categories.post('/', wrap(async (req, res) => {
  const { name, type, description = '', parent_id = null, family_id = null,
    is_hidden = false, is_active = true } = req.body || {};
  if (!validName(name, 100) || !['in', 'out'].includes(type) ||
      typeof description !== 'string' || description.length > 2000 ||
      (parent_id !== null && !validId(parent_id)) ||
      (family_id !== null && !validId(family_id)) ||
      typeof is_hidden !== 'boolean' || typeof is_active !== 'boolean') return fail(res, 'Invalid category.');
  if (family_id && !await requireFamily(req, res, family_id, true)) return;
  if (parent_id) {
    const parent = await pool.query(
      `SELECT id FROM categories WHERE id = $1 AND type = $2
       AND user_id = $3 AND family_id IS NOT DISTINCT FROM $4::uuid`,
      [parent_id, type, req.user.id, family_id],
    );
    if (!parent.rowCount) return fail(res, 'Parent category is unavailable.', 403);
  }
  const result = await pool.query(
    `INSERT INTO categories (name, type, description, user_id, family_id, parent_id, is_hidden, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [name.trim(), type, description, req.user.id, family_id, parent_id, is_hidden, is_active],
  );
  return data(res, { category: result.rows[0] }, 201);
}));

routes.categories.patch('/:id', wrap(async (req, res) => {
  const { name, description, parent_id, is_hidden, is_active } = req.body || {};
  if (!validId(req.params.id) || (name !== undefined && !validName(name, 100)) ||
      (description !== undefined && (typeof description !== 'string' || description.length > 2000)) ||
      (parent_id !== undefined && parent_id !== null && !validId(parent_id)) ||
      (is_hidden !== undefined && typeof is_hidden !== 'boolean') ||
      (is_active !== undefined && typeof is_active !== 'boolean')) return fail(res, 'Invalid category.');
  const existing = await pool.query(
    `SELECT family_id FROM categories WHERE id = $1 AND
      (user_id = $2 OR (family_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM family_members fm WHERE fm.family_id = categories.family_id
        AND fm.user_id = $2 AND fm.status = 'ACTIVE' AND fm.role IN ('OWNER', 'MANAGER'))))`,
    [req.params.id, req.user.id],
  );
  if (!existing.rowCount) return fail(res, 'Category not found.', 404);
  if (existing.rows[0].family_id && !await requireFamily(req, res, existing.rows[0].family_id, true)) return;
  const result = await pool.query(
    `UPDATE categories SET name = COALESCE($1, name), description = COALESCE($2, description),
       parent_id = CASE WHEN $3 THEN $4::uuid ELSE parent_id END,
       is_hidden = COALESCE($5, is_hidden), is_active = COALESCE($6, is_active)
     WHERE id = $7 AND
       (user_id = $8 OR (family_id IS NOT NULL AND EXISTS (
         SELECT 1 FROM family_members fm WHERE fm.family_id = categories.family_id
         AND fm.user_id = $8 AND fm.status = 'ACTIVE' AND fm.role IN ('OWNER', 'MANAGER'))))
     RETURNING *`,
    [name === undefined ? null : name.trim(), description === undefined ? null : description,
      parent_id !== undefined, parent_id === undefined ? null : parent_id,
      is_hidden === undefined ? null : is_hidden, is_active === undefined ? null : is_active,
      req.params.id, req.user.id],
  );
  if (!result.rowCount) return fail(res, 'Category not found.', 404);
  return data(res, { category: result.rows[0] });
}));

routes.categories.patch('/:id/hide', wrap(async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 'Invalid category id.');
  const category = await pool.query('SELECT * FROM categories WHERE id = $1', [req.params.id]);
  if (!category.rowCount) return fail(res, 'Category not found.', 404);
  if (category.rows[0].family_id) {
    if (!await requireFamily(req, res, category.rows[0].family_id, true)) return;
  } else if (category.rows[0].user_id === null || category.rows[0].user_id !== req.user.id) {
    return fail(res, 'Category not found.', 404);
  }
  const result = await pool.query(
    'UPDATE categories SET is_hidden = TRUE WHERE id = $1 RETURNING *',
    [req.params.id],
  );
  return data(res, { category: result.rows[0] });
}));

routes.categories.patch('/:id/restore', wrap(async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 'Invalid category id.');
  const category = await pool.query('SELECT * FROM categories WHERE id = $1', [req.params.id]);
  if (!category.rowCount) return fail(res, 'Category not found.', 404);
  if (category.rows[0].family_id) {
    if (!await requireFamily(req, res, category.rows[0].family_id, true)) return;
  } else if (category.rows[0].user_id === null || category.rows[0].user_id !== req.user.id) {
    return fail(res, 'Category not found.', 404);
  }
  const result = await pool.query(
    'UPDATE categories SET is_hidden = FALSE, is_active = TRUE WHERE id = $1 RETURNING *',
    [req.params.id],
  );
  return data(res, { category: result.rows[0] });
}));

routes.categories.delete('/:id', wrap(async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 'Invalid category id.');
  const current = await pool.query('SELECT family_id FROM categories WHERE id = $1', [req.params.id]);
  if (!current.rowCount) return fail(res, 'Category not found.', 404);
  if (current.rows[0].family_id && !await requireFamily(req, res, current.rows[0].family_id, true)) return;
  const result = await pool.query(
    `DELETE FROM categories WHERE id = $1 AND
      (user_id = $2 OR (family_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM family_members fm WHERE fm.family_id = categories.family_id
        AND fm.user_id = $2 AND fm.status = 'ACTIVE' AND fm.role IN ('OWNER', 'MANAGER'))))
     RETURNING id`,
    [req.params.id, req.user.id],
  );
  if (!result.rowCount) return fail(res, 'Category not found.', 404);
  return data(res, { deleted: true, id: result.rows[0].id });
}));

// Wallet balances are derived from opening balance, transactions, and transfers.
routes.accounts.get('/', wrap(async (req, res) => {
  const includeHidden = req.query.include_hidden === 'true';
  const result = await pool.query(
    `SELECT a.*,
       a.opening_balance + COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'in'), 0)
       - COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'out'), 0)
       + COALESCE((SELECT SUM(tr.amount) FROM transfers tr WHERE tr.to_account = a.id), 0)
       - COALESCE((SELECT SUM(tr.amount) FROM transfers tr WHERE tr.from_account = a.id), 0)
       + COALESCE((SELECT SUM(adj.amount) FROM account_adjustments adj WHERE adj.account_id = a.id), 0) AS balance
     FROM accounts a LEFT JOIN transactions t ON t.account_id = a.id
     WHERE ${accountAccess('$1')} AND ($2::boolean OR a.is_hidden = FALSE)
     GROUP BY a.id ORDER BY a.created_at, a.name`,
    [req.user.id, includeHidden],
  );
  return data(res, { accounts: result.rows });
}));

routes.accounts.post('/', wrap(async (req, res) => {
  const { name, type, opening_balance = 0, currency = 'VND', family_id = null } = req.body || {};
  if (!validName(name) || !accountTypes.includes(type) || !validAmount(opening_balance) ||
      !/^[A-Z]{3}$/.test(currency) || (family_id !== null && !validId(family_id))) return fail(res, 'Invalid account.');
  if (family_id && !await requireFamily(req, res, family_id, true)) return;
  const result = await pool.query(
    `INSERT INTO accounts (user_id, family_id, name, type, opening_balance, currency)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [req.user.id, family_id, name.trim(), type, opening_balance, currency],
  );
  return data(res, { account: { ...result.rows[0], balance: result.rows[0].opening_balance } }, 201);
}));

routes.accounts.patch('/:id', wrap(async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 'Invalid account id.');
  const { name, type, opening_balance, currency, is_active, is_hidden } = req.body || {};
  if ((name !== undefined && !validName(name)) ||
      (type !== undefined && !accountTypes.includes(type)) ||
      (opening_balance !== undefined && !validAmount(opening_balance)) ||
      (currency !== undefined && !/^[A-Z]{3}$/.test(currency)) ||
      (is_active !== undefined && typeof is_active !== 'boolean') ||
      (is_hidden !== undefined && typeof is_hidden !== 'boolean')) return fail(res, 'Invalid account.');
  const lookup = await pool.query('SELECT * FROM accounts WHERE id = $1', [req.params.id]);
  const account = lookup.rows[0];
  if (!account) return fail(res, 'Account not found.', 404);
  if (account.family_id) {
    if (!await requireFamily(req, res, account.family_id, true)) return;
  } else if (account.user_id !== req.user.id) return fail(res, 'Account not found.', 404);
  const result = await pool.query(
    `UPDATE accounts SET name = COALESCE($1, name), type = COALESCE($2, type),
       opening_balance = COALESCE($3, opening_balance), currency = COALESCE($4, currency),
       is_active = COALESCE($5, is_active), is_hidden = COALESCE($6, is_hidden)
     WHERE id = $7 RETURNING *`,
    [name === undefined ? null : name.trim(), type || null, opening_balance === undefined ? null : opening_balance,
      currency || null, is_active === undefined ? null : is_active,
      is_hidden === undefined ? null : is_hidden, req.params.id],
  );
  const balance = await accountBalance(pool, req.params.id);
  return data(res, { account: { ...result.rows[0], balance } });
}));

routes.accounts.post('/:id/reconcile', wrap(async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 'Invalid account id.');
  const { balance: actualBalance, note = '' } = req.body || {};
  if (!validSignedAmount(actualBalance) || typeof note !== 'string' || note.length > 1000) {
    return fail(res, 'Invalid reconciliation.');
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query('SELECT * FROM accounts WHERE id = $1 FOR UPDATE', [req.params.id]);
    const account = result.rows[0];
    if (!account) {
      await client.query('ROLLBACK');
      return fail(res, 'Account not found.', 404);
    }
    if (account.family_id) {
      if (!await requireFamily(req, res, account.family_id, true)) {
        await client.query('ROLLBACK');
        return;
      }
    } else if (account.user_id !== req.user.id) {
      await client.query('ROLLBACK');
      return fail(res, 'Account not found.', 404);
    }
    const before = Number(await accountBalance(client, account.id));
    const delta = Number(actualBalance) - before;
    let adjustment = null;
    if (Math.abs(delta) >= 0.005) {
      adjustment = (await client.query(
        `INSERT INTO account_adjustments (account_id, user_id, amount, balance_before, balance_after, note)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [account.id, req.user.id, delta.toFixed(2), before.toFixed(2), Number(actualBalance).toFixed(2), note],
      )).rows[0];
    }
    await client.query('COMMIT');
    return data(res, { adjustment, account_id: account.id, balance_before: before.toFixed(2),
      balance_after: Number(actualBalance).toFixed(2) }, adjustment ? 201 : 200);
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}));

routes.accounts.get('/:id/adjustments', wrap(async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 'Invalid account id.');
  const account = await pool.query('SELECT * FROM accounts WHERE id = $1', [req.params.id]);
  if (!account.rowCount) return fail(res, 'Account not found.', 404);
  const row = account.rows[0];
  if (row.family_id) {
    if (!await requireFamily(req, res, row.family_id)) return;
  } else if (row.user_id !== req.user.id) return fail(res, 'Account not found.', 404);
  const result = await pool.query(
    `SELECT adj.*, u.full_name AS adjusted_by FROM account_adjustments adj
     JOIN users u ON u.id = adj.user_id WHERE adj.account_id = $1
     ORDER BY adj.created_at DESC`,
    [req.params.id],
  );
  return data(res, { adjustments: result.rows });
}));

routes.accounts.patch('/:id/hide', wrap(async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 'Invalid account id.');
  const current = await pool.query('SELECT * FROM accounts WHERE id = $1', [req.params.id]);
  const account = current.rows[0];
  if (!account) return fail(res, 'Account not found.', 404);
  if (account.family_id) {
    if (!await requireFamily(req, res, account.family_id, true)) return;
  } else if (account.user_id !== req.user.id) return fail(res, 'Account not found.', 404);
  const result = await pool.query('UPDATE accounts SET is_hidden = TRUE WHERE id = $1 RETURNING *', [req.params.id]);
  return data(res, { account: { ...result.rows[0], balance: await accountBalance(pool, req.params.id) } });
}));

routes.accounts.patch('/:id/restore', wrap(async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 'Invalid account id.');
  const current = await pool.query('SELECT * FROM accounts WHERE id = $1', [req.params.id]);
  const account = current.rows[0];
  if (!account) return fail(res, 'Account not found.', 404);
  if (account.family_id) {
    if (!await requireFamily(req, res, account.family_id, true)) return;
  } else if (account.user_id !== req.user.id) return fail(res, 'Account not found.', 404);
  const result = await pool.query('UPDATE accounts SET is_hidden = FALSE, is_active = TRUE WHERE id = $1 RETURNING *', [req.params.id]);
  return data(res, { account: { ...result.rows[0], balance: await accountBalance(pool, req.params.id) } });
}));

routes.accounts.delete('/:id', wrap(async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 'Invalid account id.');
  const lookup = await pool.query('SELECT * FROM accounts WHERE id = $1', [req.params.id]);
  const account = lookup.rows[0];
  if (!account) return fail(res, 'Account not found.', 404);
  if (account.family_id) {
    if (!await requireFamily(req, res, account.family_id, true)) return;
  } else if (account.user_id !== req.user.id) return fail(res, 'Account not found.', 404);
  const result = await pool.query('DELETE FROM accounts WHERE id = $1 RETURNING id', [req.params.id]);
  return data(res, { deleted: true, id: result.rows[0].id });
}));

routes.transfers.get('/', wrap(async (req, res) => {
  const result = await pool.query(
    `SELECT tr.*, fa.name AS from_account_name, ta.name AS to_account_name,
       owner.email AS owner_email
     FROM transfers tr JOIN accounts fa ON fa.id = tr.from_account
     JOIN accounts ta ON ta.id = tr.to_account
     JOIN users owner ON owner.id = tr.user_id
     WHERE (tr.user_id = $1 AND tr.family_id IS NULL)
       OR (tr.family_id IS NOT NULL AND EXISTS (
         SELECT 1 FROM family_members fm WHERE fm.family_id = tr.family_id
         AND fm.user_id = $1 AND fm.status = 'ACTIVE'))
     ORDER BY tr.transfer_date DESC, tr.created_at DESC LIMIT 500`,
    [req.user.id],
  );
  return data(res, { transfers: result.rows });
}));

routes.transfers.post('/', wrap(async (req, res) => {
  const { from_account, to_account, amount, transfer_date, note = '' } = req.body || {};
  if (!validId(from_account) || !validId(to_account) || from_account === to_account ||
      !positiveAmount(amount) || (transfer_date !== undefined && !validDate(transfer_date)) ||
      typeof note !== 'string' || note.length > 1000) return fail(res, 'Invalid transfer.');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const fromId = from_account.toLowerCase();
    const toId = to_account.toLowerCase();
    const accountResult = await client.query(
      `SELECT * FROM accounts WHERE id = ANY($1::uuid[]) ORDER BY id FOR UPDATE`,
      [[fromId, toId]],
    );
    const accounts = accountResult.rows;
    if (accounts.length !== 2 || accounts.some(a => !a.is_active)) {
      await client.query('ROLLBACK');
      return fail(res, 'Both accounts must exist and be active.', 404);
    }
    const [source, destination] = [accounts.find(a => a.id === fromId), accounts.find(a => a.id === toId)];
    const samePersonal = !source.family_id && !destination.family_id &&
      source.user_id === req.user.id && destination.user_id === req.user.id;
    const sameFamily = source.family_id && source.family_id === destination.family_id;
    if (!samePersonal && !sameFamily) {
      await client.query('ROLLBACK');
      return fail(res, 'Transfers must use accounts in the same authorized scope.', 403);
    }
    if (sameFamily && !await requireFamily(req, res, source.family_id)) {
      await client.query('ROLLBACK');
      return;
    }
    const currentBalance = await accountBalance(client, source.id);
    if (Number(currentBalance) < Number(amount)) {
      await client.query('ROLLBACK');
      return fail(res, 'Insufficient account balance.', 409);
    }
    const result = await client.query(
      `INSERT INTO transfers (user_id, family_id, from_account, to_account, amount, transfer_date, note)
       VALUES ($1, $2, $3, $4, $5, COALESCE($6::date, CURRENT_DATE), $7) RETURNING *`,
      [req.user.id, sameFamily ? source.family_id : null, fromId, toId, amount, transfer_date || null, note],
    );
    await client.query('COMMIT');
    return data(res, { transfer: result.rows[0] }, 201);
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}));

routes.transfers.patch('/:id', wrap(async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 'Invalid transfer id.');
  const body = req.body || {};
  const { from_account, to_account, amount, transfer_date, note } = body;
  if ((from_account !== undefined && !validId(from_account)) ||
      (to_account !== undefined && !validId(to_account)) ||
      (amount !== undefined && !positiveAmount(amount)) ||
      (transfer_date !== undefined && !validDate(transfer_date)) ||
      (note !== undefined && (typeof note !== 'string' || note.length > 1000)) ||
      !['from_account', 'to_account', 'amount', 'transfer_date', 'note'].some(key => body[key] !== undefined)) {
    return fail(res, 'Invalid transfer update.');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const locked = await client.query(
      'SELECT * FROM transfers WHERE id = $1 FOR UPDATE',
      [req.params.id],
    );
    const transfer = locked.rows[0];
    if (!transfer) {
      await client.query('ROLLBACK');
      return fail(res, 'Transfer not found.', 404);
    }
    if (transfer.family_id) {
      const member = await requireFamily(req, res, transfer.family_id);
      if (!member) {
        await client.query('ROLLBACK');
        return;
      }
      if (transfer.user_id !== req.user.id && !['OWNER', 'MANAGER'].includes(member.role)) {
        await client.query('ROLLBACK');
        return fail(res, 'Only the transfer creator or a family manager can edit this transfer.', 403);
      }
    } else if (transfer.user_id !== req.user.id) {
      await client.query('ROLLBACK');
      return fail(res, 'Transfer not found.', 404);
    }

    const fromId = (from_account || transfer.from_account).toLowerCase();
    const toId = (to_account || transfer.to_account).toLowerCase();
    const nextAmount = amount === undefined ? Number(transfer.amount) : Number(amount);
    if (fromId === toId) {
      await client.query('ROLLBACK');
      return fail(res, 'Transfer accounts must be different.');
    }

    const accountResult = await client.query(
      `SELECT * FROM accounts WHERE id = ANY($1::uuid[]) ORDER BY id FOR UPDATE`,
      [[...new Set([fromId, toId, transfer.from_account, transfer.to_account])]],
    );
    const accounts = new Map(accountResult.rows.map(account => [account.id, account]));
    const source = accounts.get(fromId);
    const destination = accounts.get(toId);
    if (!source || !destination || !source.is_active || !destination.is_active) {
      await client.query('ROLLBACK');
      return fail(res, 'Both accounts must exist and be active.', 404);
    }
    if (transfer.family_id) {
      if (source.family_id !== transfer.family_id || destination.family_id !== transfer.family_id) {
        await client.query('ROLLBACK');
        return fail(res, 'A family transfer must use accounts belonging to the same family.', 403);
      }
    } else if (source.family_id || destination.family_id ||
        source.user_id !== req.user.id || destination.user_id !== req.user.id) {
      await client.query('ROLLBACK');
      return fail(res, 'A personal transfer must use the caller’s personal accounts.', 403);
    }

    const balance = Number(await accountBalance(client, source.id));
    const restoredBalance = balance
      - (transfer.to_account === source.id ? Number(transfer.amount) : 0)
      + (transfer.from_account === source.id ? Number(transfer.amount) : 0);
    if (restoredBalance + 0.000001 < nextAmount) {
      await client.query('ROLLBACK');
      return fail(res, 'Insufficient account balance.', 409);
    }

    const result = await client.query(
      `UPDATE transfers SET from_account = $1, to_account = $2, amount = $3,
         transfer_date = COALESCE($4::date, transfer_date), note = COALESCE($5, note)
       WHERE id = $6 RETURNING *`,
      [fromId, toId, nextAmount, transfer_date === undefined ? null : transfer_date,
        note === undefined ? null : note, transfer.id],
    );
    await client.query('COMMIT');
    return data(res, { transfer: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}));

routes.transfers.delete('/:id', wrap(async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 'Invalid transfer id.');
  const lookup = await pool.query('SELECT * FROM transfers WHERE id = $1', [req.params.id]);
  const transfer = lookup.rows[0];
  if (!transfer) return fail(res, 'Transfer not found.', 404);
  if (transfer.family_id) {
    if (!await requireFamily(req, res, transfer.family_id)) return;
  } else if (transfer.user_id !== req.user.id) return fail(res, 'Transfer not found.', 404);
  await pool.query('DELETE FROM transfers WHERE id = $1', [req.params.id]);
  return data(res, { deleted: true, id: req.params.id });
}));

routes.budgets.get('/', wrap(async (req, res) => {
  const familyId = req.query.family_id;
  let scopeSql = 'b.user_id = $1';
  const params = [req.user.id];
  if (familyId) {
    if (!await requireFamily(req, res, familyId)) return;
    params.push(familyId);
    scopeSql = 'b.family_id = $2';
  }
  if (req.query.month !== undefined) {
    if (!validDate(req.query.month) || new Date(`${req.query.month}T00:00:00Z`).getUTCDate() !== 1) {
      return fail(res, 'month must be the first day of a month (YYYY-MM-01).');
    }
    params.push(req.query.month);
    scopeSql += ` AND b.month = $${params.length}::date`;
  }
  const result = await pool.query(
    `SELECT b.*, c.name AS category_name,
       COALESCE(SUM(t.amount), 0) AS spent
     FROM budgets b JOIN categories c ON c.id = b.category_id
     LEFT JOIN transactions t ON t.category_id = b.category_id AND t.type = 'out'
       AND t.transaction_date >= b.month AND t.transaction_date < (b.month + INTERVAL '1 month')
       AND ((b.user_id IS NOT NULL AND t.user_id = b.user_id AND t.scope = 'personal')
         OR (b.family_id IS NOT NULL AND t.family_id = b.family_id AND t.scope = 'family'))
     WHERE ${scopeSql}
     GROUP BY b.id, c.name ORDER BY b.month DESC, c.name`,
    params,
  );
  return data(res, { budgets: result.rows });
}));

routes.budgets.post('/', wrap(async (req, res) => {
  const { category_id, month, amount, family_id = null } = req.body || {};
  if (!validId(category_id) || !validDate(month) || new Date(`${month}T00:00:00Z`).getUTCDate() !== 1 ||
      !validAmount(amount) || (family_id !== null && !validId(family_id))) return fail(res, 'Invalid budget.');
  if (family_id && !await requireFamily(req, res, family_id, true)) return;
  const category = family_id
    ? await pool.query(
      `SELECT id FROM categories WHERE id = $1 AND type = 'out'
       AND (family_id = $2 OR (family_id IS NULL AND user_id IS NULL))`,
      [category_id, family_id],
    )
    : await pool.query(
      `SELECT id FROM categories WHERE id = $1 AND type = 'out'
       AND family_id IS NULL AND (user_id IS NULL OR user_id = $2)`,
      [category_id, req.user.id],
    );
  if (!category.rowCount) return fail(res, 'Expense category is unavailable.', 403);
  const result = await pool.query(
    `INSERT INTO budgets (user_id, family_id, category_id, month, amount)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [family_id ? null : req.user.id, family_id, category_id, month, amount],
  );
  return data(res, { budget: result.rows[0] }, 201);
}));

routes.budgets.patch('/:id', wrap(async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 'Invalid budget id.');
  const { amount } = req.body || {};
  if (!validAmount(amount)) return fail(res, 'Invalid budget amount.');
  const result = await pool.query(
    `UPDATE budgets b SET amount = $1
     WHERE b.id = $2 AND (b.user_id = $3 OR (b.family_id IS NOT NULL AND EXISTS (
       SELECT 1 FROM family_members fm WHERE fm.family_id = b.family_id AND fm.user_id = $3
       AND fm.status = 'ACTIVE' AND fm.role IN ('OWNER', 'MANAGER'))))
     RETURNING b.*`,
    [amount, req.params.id, req.user.id],
  );
  if (!result.rowCount) return fail(res, 'Budget not found or access denied.', 404);
  return data(res, { budget: result.rows[0] });
}));

routes.budgets.delete('/:id', wrap(async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 'Invalid budget id.');
  const result = await pool.query(
    `DELETE FROM budgets b WHERE b.id = $1 AND (b.user_id = $2 OR (b.family_id IS NOT NULL AND EXISTS (
       SELECT 1 FROM family_members fm WHERE fm.family_id = b.family_id AND fm.user_id = $2
       AND fm.status = 'ACTIVE' AND fm.role IN ('OWNER', 'MANAGER')))) RETURNING b.id`,
    [req.params.id, req.user.id],
  );
  if (!result.rowCount) return fail(res, 'Budget not found or access denied.', 404);
  return data(res, { deleted: true, id: result.rows[0].id });
}));

routes.goals.get('/', wrap(async (req, res) => {
  const familyId = req.query.family_id;
  const params = [req.user.id];
  let where = 'g.user_id = $1';
  if (familyId) {
    if (!await requireFamily(req, res, familyId)) return;
    params.push(familyId);
    where = 'g.family_id = $2';
  }
  const result = await pool.query(
    `SELECT g.*, GREATEST(g.target - g.saved, 0) AS remaining,
       CASE WHEN g.target = 0 THEN 0 ELSE ROUND(g.saved * 100 / g.target, 2) END AS progress
     FROM goals g WHERE ${where} ORDER BY g.created_at DESC`,
    params,
  );
  return data(res, { goals: result.rows });
}));

routes.goals.post('/', wrap(async (req, res) => {
  const { name, target, saved = 0, deadline = null, family_id = null } = req.body || {};
  if (!validName(name, 150) || !positiveAmount(target) ||
      !validAmount(saved) || Number(saved) > Number(target) ||
      (deadline !== null && !validDate(deadline)) ||
      (family_id !== null && !validId(family_id))) return fail(res, 'Invalid savings goal.');
  if (family_id && !await requireFamily(req, res, family_id, true)) return;
  const result = await pool.query(
    `INSERT INTO goals (user_id, family_id, name, target, saved, deadline)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [family_id ? null : req.user.id, family_id, name.trim(), target, saved, deadline],
  );
  return data(res, { goal: result.rows[0] }, 201);
}));

routes.goals.patch('/:id', wrap(async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 'Invalid goal id.');
  const { name, target, deadline } = req.body || {};
  if ((name !== undefined && !validName(name, 150)) ||
      (target !== undefined && !positiveAmount(target)) ||
      (deadline !== undefined && deadline !== null && !validDate(deadline))) return fail(res, 'Invalid goal.');
  const result = await pool.query(
    `UPDATE goals g SET name = COALESCE($1, g.name), target = COALESCE($2, g.target),
       deadline = CASE WHEN $3 THEN $4::date ELSE g.deadline END
     WHERE g.id = $5 AND (g.user_id = $6 OR (g.family_id IS NOT NULL AND EXISTS (
       SELECT 1 FROM family_members fm WHERE fm.family_id = g.family_id AND fm.user_id = $6
       AND fm.status = 'ACTIVE' AND fm.role IN ('OWNER', 'MANAGER'))))
     RETURNING g.*`,
    [name === undefined ? null : name.trim(), target === undefined ? null : target,
      deadline !== undefined, deadline === undefined ? null : deadline, req.params.id, req.user.id],
  );
  if (!result.rowCount) return fail(res, 'Goal not found or access denied.', 404);
  return data(res, { goal: result.rows[0] });
}));

routes.goals.get('/:id/contributions', wrap(async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 'Invalid goal id.');
  const result = await pool.query(
    `SELECT history.* FROM (
       SELECT gc.id, gc.goal_id, gc.user_id, gc.amount, gc.contribution_date AS event_date,
         gc.note, gc.created_at, 'DEPOSIT'::text AS event_type
       FROM goal_contributions gc
       UNION ALL
       SELECT gw.id, gw.goal_id, gw.user_id, gw.amount, gw.withdrawal_date AS event_date,
         gw.note, gw.created_at, 'WITHDRAWAL'::text AS event_type
       FROM goal_withdrawals gw
     ) history JOIN goals g ON g.id = history.goal_id
     WHERE g.id = $1 AND (g.user_id = $2 OR (g.family_id IS NOT NULL AND EXISTS (
       SELECT 1 FROM family_members fm WHERE fm.family_id = g.family_id AND fm.user_id = $2 AND fm.status = 'ACTIVE')))
     ORDER BY history.event_date DESC, history.created_at DESC`,
    [req.params.id, req.user.id],
  );
  if (!result.rowCount) {
    const exists = await pool.query('SELECT id FROM goals WHERE id = $1', [req.params.id]);
    if (!exists.rowCount) return fail(res, 'Goal not found.', 404);
    const access = await pool.query(
      `SELECT 1 FROM goals g WHERE g.id = $1 AND (g.user_id = $2 OR EXISTS (
        SELECT 1 FROM family_members fm WHERE fm.family_id = g.family_id AND fm.user_id = $2 AND fm.status = 'ACTIVE'))`,
      [req.params.id, req.user.id],
    );
    if (!access.rowCount) return fail(res, 'Goal not found or access denied.', 404);
  }
  return data(res, { contributions: result.rows });
}));

routes.goals.post('/:id/withdrawals', wrap(async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 'Invalid goal id.');
  const { amount, note = '', contribution_date } = req.body || {};
  if (!positiveAmount(amount) ||
      (contribution_date !== undefined && !validDate(contribution_date)) ||
      typeof note !== 'string' || note.length > 1000) return fail(res, 'Invalid withdrawal.');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const goalResult = await client.query(
      `SELECT g.* FROM goals g WHERE g.id = $1 AND (g.user_id = $2 OR (g.family_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM family_members fm WHERE fm.family_id = g.family_id AND fm.user_id = $2 AND fm.status = 'ACTIVE')))
       FOR UPDATE`,
      [req.params.id, req.user.id],
    );
    const goal = goalResult.rows[0];
    if (!goal) {
      await client.query('ROLLBACK');
      return fail(res, 'Goal not found or access denied.', 404);
    }
    if (Number(goal.saved) < Number(amount)) {
      await client.query('ROLLBACK');
      return fail(res, 'Withdrawal exceeds the amount saved.', 409);
    }
    const withdrawal = await client.query(
      `INSERT INTO goal_withdrawals (goal_id, user_id, amount, withdrawal_date, note)
       VALUES ($1, $2, $3, COALESCE($4::date, CURRENT_DATE), $5) RETURNING *`,
      [goal.id, req.user.id, amount, contribution_date || null, note],
    );
    const updated = await client.query(
      'UPDATE goals SET saved = saved - $1 WHERE id = $2 AND saved >= $1 RETURNING *',
      [amount, goal.id],
    );
    if (!updated.rowCount) {
      await client.query('ROLLBACK');
      return fail(res, 'Withdrawal exceeds the amount saved.', 409);
    }
    await client.query('COMMIT');
    return data(res, { withdrawal: withdrawal.rows[0], goal: updated.rows[0] }, 201);
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}));

routes.goals.post('/:id/contributions', wrap(async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 'Invalid goal id.');
  const { amount, contribution_date, note = '' } = req.body || {};
  if (!positiveAmount(amount) || (contribution_date !== undefined && !validDate(contribution_date)) ||
      typeof note !== 'string' || note.length > 1000) return fail(res, 'Invalid contribution.');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const goalResult = await client.query(
      `SELECT g.* FROM goals g WHERE g.id = $1 AND (g.user_id = $2 OR (g.family_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM family_members fm WHERE fm.family_id = g.family_id AND fm.user_id = $2 AND fm.status = 'ACTIVE')))
       FOR UPDATE`,
      [req.params.id, req.user.id],
    );
    const goal = goalResult.rows[0];
    if (!goal) {
      await client.query('ROLLBACK');
      return fail(res, 'Goal not found or access denied.', 404);
    }
    const contribution = await client.query(
      `INSERT INTO goal_contributions (goal_id, user_id, amount, contribution_date, note)
       VALUES ($1, $2, $3, COALESCE($4::date, CURRENT_DATE), $5) RETURNING *`,
      [goal.id, req.user.id, amount, contribution_date || null, note],
    );
    const updated = await client.query('UPDATE goals SET saved = saved + $1 WHERE id = $2 RETURNING *', [amount, goal.id]);
    await client.query('COMMIT');
    return data(res, { contribution: contribution.rows[0], goal: updated.rows[0] }, 201);
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}));

routes.goals.delete('/:id', wrap(async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 'Invalid goal id.');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const goalResult = await client.query(
      `SELECT g.* FROM goals g WHERE g.id = $1 AND (g.user_id = $2 OR (g.family_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM family_members fm WHERE fm.family_id = g.family_id AND fm.user_id = $2
        AND fm.status = 'ACTIVE' AND fm.role IN ('OWNER', 'MANAGER')))) FOR UPDATE`,
      [req.params.id, req.user.id],
    );
    if (!goalResult.rowCount) {
      await client.query('ROLLBACK');
      return fail(res, 'Goal not found or access denied.', 404);
    }
    await client.query('DELETE FROM goals WHERE id = $1', [req.params.id]);
    await client.query('COMMIT');
    return data(res, { deleted: true, id: req.params.id });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}));

routes.families.get('/', wrap(async (req, res) => {
  const result = await pool.query(
    `SELECT f.*, fm.role AS my_role,
       (SELECT owner.email FROM family_members owner_member
        JOIN users owner ON owner.id = owner_member.user_id
        WHERE owner_member.family_id = f.id AND owner_member.role = 'OWNER'
          AND owner_member.status = 'ACTIVE' LIMIT 1) AS owner_email,
       (SELECT COUNT(*)::int FROM family_members m WHERE m.family_id = f.id AND m.status = 'ACTIVE') AS member_count
     FROM families f JOIN family_members fm ON fm.family_id = f.id
     WHERE fm.user_id = $1 AND fm.status = 'ACTIVE' ORDER BY f.created_at DESC`,
    [req.user.id],
  );
  return data(res, { families: result.rows });
}));

routes.families.get('/invites', wrap(async (req, res) => {
  const result = await pool.query(
    `SELECT fi.id, fi.family_id, f.name AS family_name, fi.email, fi.role,
       fi.status, fi.expires_at, fi.created_at,
       inviter.id AS inviter_id, inviter.full_name AS inviter_name
     FROM family_invites fi JOIN families f ON f.id = fi.family_id
     JOIN users inviter ON inviter.id = fi.invited_by
     WHERE lower(fi.email) = lower($1) AND fi.status = 'PENDING' AND fi.expires_at > NOW()
     ORDER BY fi.created_at DESC`,
    [req.user.email],
  );
  return data(res, { invites: result.rows });
}));

routes.families.post('/invites/:inviteId/decline', wrap(async (req, res) => {
  if (!validId(req.params.inviteId)) return fail(res, 'Invalid invite id.');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      `SELECT fi.*, f.name FROM family_invites fi
       JOIN families f ON f.id = fi.family_id
       WHERE fi.id = $1 AND lower(fi.email) = lower($2)
         AND fi.status = 'PENDING' AND fi.expires_at > NOW()
       FOR UPDATE`,
      [req.params.inviteId, req.user.email],
    );
    const invite = result.rows[0];
    if (!invite) {
      await client.query('ROLLBACK');
      return fail(res, 'Invite not found, expired, or not addressed to this account.', 404);
    }
    await client.query(
      `UPDATE family_invites SET status = 'DECLINED' WHERE id = $1`,
      [invite.id],
    );
    await notify(client, invite.invited_by, 'FAMILY_INVITE_DECLINED', 'Invitation declined',
      `${req.user.full_name} declined the invitation to ${invite.name}.`,
      { family_id: invite.family_id, invite_id: invite.id, user_id: req.user.id });
    await client.query('COMMIT');
    return data(res, { declined: true, invite: {
      id: invite.id, family_id: invite.family_id, status: 'DECLINED',
    } });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}));

routes.families.post('/', wrap(async (req, res) => {
  const { name } = req.body || {};
  if (!validName(name, 150)) return fail(res, 'Invalid family name.');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const family = await client.query('INSERT INTO families (name, created_by) VALUES ($1, $2) RETURNING *', [name.trim(), req.user.id]);
    await client.query(
      `INSERT INTO family_members (family_id, user_id, role, status) VALUES ($1, $2, 'OWNER', 'ACTIVE')`,
      [family.rows[0].id, req.user.id],
    );
    await client.query('COMMIT');
    return data(res, { family: { ...family.rows[0], my_role: 'OWNER', member_count: 1 } }, 201);
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}));

routes.families.get('/:familyId', wrap(async (req, res) => {
  if (!await requireFamily(req, res, req.params.familyId)) return;
  const result = await pool.query(
    `SELECT f.*, fm.role AS my_role FROM families f JOIN family_members fm ON fm.family_id = f.id
     WHERE f.id = $1 AND fm.user_id = $2 AND fm.status = 'ACTIVE'`,
    [req.params.familyId, req.user.id],
  );
  return data(res, { family: result.rows[0] });
}));

routes.families.patch('/:familyId', wrap(async (req, res) => {
  if (!await requireFamily(req, res, req.params.familyId, true)) return;
  const { name, settings, monthly_budget } = req.body || {};
  if ((name !== undefined && !validName(name, 150)) ||
      (settings !== undefined && (!settings || typeof settings !== 'object' || Array.isArray(settings))) ||
      (monthly_budget !== undefined && monthly_budget !== null && !validAmount(monthly_budget))) {
    return fail(res, 'Invalid family settings.');
  }
  const current = await pool.query('SELECT settings FROM families WHERE id = $1', [req.params.familyId]);
  const mergedSettings = settings === undefined ? current.rows[0].settings :
    { ...current.rows[0].settings, ...settings };
  const result = await pool.query(
    `UPDATE families SET name = COALESCE($1, name), settings = $2::jsonb,
       monthly_budget = CASE WHEN $3 THEN $4::numeric ELSE monthly_budget END
     WHERE id = $5 RETURNING *`,
    [name === undefined ? null : name.trim(), JSON.stringify(mergedSettings),
      monthly_budget !== undefined, monthly_budget === undefined ? null : monthly_budget, req.params.familyId],
  );
  return data(res, { family: result.rows[0] });
}));

routes.families.get('/:familyId/members', wrap(async (req, res) => {
  if (!await requireFamily(req, res, req.params.familyId)) return;
  const result = await pool.query(
    `SELECT u.id, u.username, u.full_name, u.email, u.avatar, fm.role, fm.status, fm.joined_at
     FROM family_members fm JOIN users u ON u.id = fm.user_id
     WHERE fm.family_id = $1 ORDER BY fm.joined_at`,
    [req.params.familyId],
  );
  return data(res, { members: result.rows });
}));

routes.families.get('/:familyId/stats', wrap(async (req, res) => {
  if (!await requireFamily(req, res, req.params.familyId)) return;
  const now = new Date();
  const month = req.query.month === undefined ? now.getMonth() + 1 : Number(req.query.month);
  const year = req.query.year === undefined ? now.getFullYear() : Number(req.query.year);
  if (!Number.isInteger(month) || month < 1 || month > 12 ||
      !Number.isInteger(year) || year < 2000 || year > 2100) return fail(res, 'Invalid stats period.');
  const params = [req.params.familyId, year, month];
  let filter = '';
  if (req.query.type !== undefined) {
    if (!['in', 'out'].includes(req.query.type)) return fail(res, 'Invalid transaction type filter.');
    params.push(req.query.type);
    filter += ` AND t.type = $${params.length}`;
  }
  if (req.query.category_id !== undefined) {
    if (!validId(req.query.category_id)) return fail(res, 'Invalid category id.');
    params.push(req.query.category_id);
    filter += ` AND t.category_id = $${params.length}`;
  }
  if (req.query.account_id !== undefined) {
    if (!validId(req.query.account_id)) return fail(res, 'Invalid account id.');
    params.push(req.query.account_id);
    filter += ` AND t.account_id = $${params.length}`;
  }
  const result = await pool.query(
    `SELECT COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'in'), 0) AS income,
       COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'out'), 0) AS expense,
       COUNT(t.id)::int AS total_transactions
     FROM transactions t
     WHERE t.scope = 'family' AND t.family_id = $1
       AND t.transaction_date >= make_date($2, $3, 1)
       AND t.transaction_date < (make_date($2, $3, 1) + INTERVAL '1 month') ${filter}`,
    params,
  );
  const row = result.rows[0];
  return data(res, { family_id: req.params.familyId, month, year,
    income: row.income, expense: row.expense,
    balance: (Number(row.income) - Number(row.expense)).toFixed(2),
    total_transactions: row.total_transactions,
    filters: { type: req.query.type || null, category_id: req.query.category_id || null, account_id: req.query.account_id || null } });
}));

routes.families.post('/:familyId/invites', wrap(async (req, res) => {
  if (!await requireFamily(req, res, req.params.familyId, true)) return;
  const { email, role = 'MEMBER' } = req.body || {};
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255 ||
      !['MANAGER', 'MEMBER', 'CHILD'].includes(role)) return fail(res, 'Invalid family invite.');
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const result = await pool.query(
    `INSERT INTO family_invites (family_id, invited_by, email, role, token_hash, expires_at)
     VALUES ($1, $2, lower($3), $4, $5, NOW() + INTERVAL '7 days')
     RETURNING id, family_id, email, role, status, expires_at, created_at`,
    [req.params.familyId, req.user.id, email, role, tokenHash],
  );
  const invite = result.rows[0];
  const recipient = await pool.query('SELECT id FROM users WHERE email = lower($1)', [email]);
  if (recipient.rowCount) {
    await notify(pool, recipient.rows[0].id, 'FAMILY_INVITE', 'Family invitation',
      `You were invited to join ${req.params.familyId}.`, { family_id: req.params.familyId, invite_id: invite.id });
  }
  return data(res, { invite: { ...invite, token } }, 201);
}));

routes.families.get('/:familyId/invites', wrap(async (req, res) => {
  if (!await requireFamily(req, res, req.params.familyId, true)) return;
  const result = await pool.query(
    `SELECT id, family_id, email, role, status, expires_at, created_at
     FROM family_invites WHERE family_id = $1 ORDER BY created_at DESC`,
    [req.params.familyId],
  );
  return data(res, { invites: result.rows });
}));

routes.families.delete('/:familyId/invites/:inviteId', wrap(async (req, res) => {
  if (!await requireFamily(req, res, req.params.familyId, true)) return;
  if (!validId(req.params.inviteId)) return fail(res, 'Invalid invite id.');
  const result = await pool.query(
    `UPDATE family_invites SET status = 'REVOKED'
     WHERE id = $1 AND family_id = $2 AND status = 'PENDING' RETURNING id`,
    [req.params.inviteId, req.params.familyId],
  );
  if (!result.rowCount) return fail(res, 'Pending invite not found.', 404);
  return data(res, { revoked: true, id: result.rows[0].id });
}));

routes.families.post('/invites/accept', wrap(async (req, res) => {
  const { token } = req.body || {};
  if (typeof token !== 'string' || token.length !== 64) return fail(res, 'Invalid invite token.');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const inviteResult = await client.query(
      `SELECT fi.*, u.email, f.name FROM family_invites fi
       JOIN users u ON u.id = $2 JOIN families f ON f.id = fi.family_id
       WHERE fi.token_hash = $1 AND fi.status = 'PENDING' AND fi.expires_at > NOW() FOR UPDATE`,
      [hash, req.user.id],
    );
    const invite = inviteResult.rows[0];
    if (!invite || invite.email.toLowerCase() !== req.user.email.toLowerCase()) {
      await client.query('ROLLBACK');
      return fail(res, 'Invite is invalid, expired, or addressed to another user.', 404);
    }
    const existingMember = await client.query(
      'SELECT status FROM family_members WHERE family_id = $1 AND user_id = $2',
      [invite.family_id, req.user.id],
    );
    if (existingMember.rowCount && existingMember.rows[0].status === 'ACTIVE') {
      await client.query('ROLLBACK');
      return fail(res, 'You are already an active family member.', 409);
    }
    await client.query(
      `INSERT INTO family_members (family_id, user_id, role, status)
       VALUES ($1, $2, $3, 'ACTIVE')
       ON CONFLICT (family_id, user_id) DO UPDATE SET role = EXCLUDED.role, status = 'ACTIVE', joined_at = NOW()`,
      [invite.family_id, req.user.id, invite.role],
    );
    await client.query(`UPDATE family_invites SET status = 'ACCEPTED' WHERE id = $1`, [invite.id]);
    await notify(client, invite.invited_by, 'FAMILY_INVITE_ACCEPTED', 'Invitation accepted',
      `${req.user.full_name} accepted your family invitation.`, { family_id: invite.family_id, user_id: req.user.id });
    await notify(client, req.user.id, 'FAMILY_JOINED', 'You joined a family',
      `You joined ${invite.name}.`, { family_id: invite.family_id, role: invite.role });
    const family = await client.query('SELECT * FROM families WHERE id = $1', [invite.family_id]);
    await client.query('COMMIT');
    return data(res, { family: { ...family.rows[0], my_role: invite.role } });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}));

routes.families.post('/invites/:inviteId/accept', wrap(async (req, res) => {
  if (!validId(req.params.inviteId)) return fail(res, 'Invalid invite id.');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      `SELECT fi.*, f.name FROM family_invites fi JOIN families f ON f.id = fi.family_id
       WHERE fi.id = $1 AND lower(fi.email) = lower($2) AND fi.status = 'PENDING'
       AND fi.expires_at > NOW() FOR UPDATE`,
      [req.params.inviteId, req.user.email],
    );
    const invite = result.rows[0];
    if (!invite) {
      await client.query('ROLLBACK');
      return fail(res, 'Invite is invalid, expired, or addressed to another user.', 404);
    }
    const existingMember = await client.query(
      'SELECT status FROM family_members WHERE family_id = $1 AND user_id = $2',
      [invite.family_id, req.user.id],
    );
    if (existingMember.rowCount && existingMember.rows[0].status === 'ACTIVE') {
      await client.query('ROLLBACK');
      return fail(res, 'You are already an active family member.', 409);
    }
    await client.query(
      `INSERT INTO family_members (family_id, user_id, role, status)
       VALUES ($1, $2, $3, 'ACTIVE')
       ON CONFLICT (family_id, user_id) DO UPDATE SET role = EXCLUDED.role, status = 'ACTIVE', joined_at = NOW()`,
      [invite.family_id, req.user.id, invite.role],
    );
    await client.query(`UPDATE family_invites SET status = 'ACCEPTED' WHERE id = $1`, [invite.id]);
    await notify(client, invite.invited_by, 'FAMILY_INVITE_ACCEPTED', 'Invitation accepted',
      `${req.user.full_name} accepted your family invitation.`, { family_id: invite.family_id, user_id: req.user.id });
    await notify(client, req.user.id, 'FAMILY_JOINED', 'You joined a family',
      `You joined ${invite.name}.`, { family_id: invite.family_id, role: invite.role });
    const family = await client.query('SELECT * FROM families WHERE id = $1', [invite.family_id]);
    await client.query('COMMIT');
    return data(res, { family: { ...family.rows[0], my_role: invite.role } });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}));

routes.families.patch('/:familyId/members/:userId', wrap(async (req, res) => {
  const member = await requireFamily(req, res, req.params.familyId);
  if (!member) return;
  if (member.role !== 'OWNER') return fail(res, 'Only the family owner can change member roles.', 403);
  const { role } = req.body || {};
  if (!validId(req.params.userId) || !['MANAGER', 'MEMBER', 'CHILD'].includes(role)) return fail(res, 'Invalid member role.');
  const result = await pool.query(
    `UPDATE family_members SET role = $1 WHERE family_id = $2 AND user_id = $3 AND status = 'ACTIVE'
     AND role <> 'OWNER' RETURNING family_id, user_id, role, status`,
    [role, req.params.familyId, req.params.userId],
  );
  if (!result.rowCount) return fail(res, 'Member not found or owner role cannot be changed.', 404);
  await notify(pool, req.params.userId, 'FAMILY_ROLE_CHANGED', 'Family role updated',
    `Your role in the family was changed to ${role}.`,
    { family_id: req.params.familyId, role, changed_by: req.user.id });
  return data(res, { member: result.rows[0] });
}));

routes.families.delete('/:familyId/members/:userId', wrap(async (req, res) => {
  const member = await requireFamily(req, res, req.params.familyId);
  if (!member) return;
  if (req.params.userId !== req.user.id && member.role !== 'OWNER') return fail(res, 'Only the owner can remove other members.', 403);
  if (!validId(req.params.userId)) return fail(res, 'Invalid member id.');
  const family = await pool.query('SELECT name FROM families WHERE id = $1', [req.params.familyId]);
  const result = await pool.query(
    `DELETE FROM family_members WHERE family_id = $1 AND user_id = $2 AND role <> 'OWNER' RETURNING user_id`,
    [req.params.familyId, req.params.userId],
  );
  if (!result.rowCount) return fail(res, 'Member not found or the owner cannot be removed.', 404);
  if (req.params.userId !== req.user.id) {
    await notify(pool, req.params.userId, 'FAMILY_MEMBERSHIP_REMOVED', 'Family membership ended',
      `You were removed from ${family.rows[0].name}.`,
      { family_id: req.params.familyId, removed_by: req.user.id });
  }
  return data(res, { removed: true, user_id: result.rows[0].user_id });
}));

routes.families.delete('/:familyId', wrap(async (req, res) => {
  const member = await requireFamily(req, res, req.params.familyId);
  if (!member) return;
  if (member.role !== 'OWNER') return fail(res, 'Only the family owner can delete a family.', 403);
  const members = await pool.query(
    `SELECT user_id FROM family_members WHERE family_id = $1 AND status = 'ACTIVE' AND user_id <> $2`,
    [req.params.familyId, req.user.id],
  );
  const family = await pool.query('SELECT name FROM families WHERE id = $1', [req.params.familyId]);
  for (const row of members.rows) {
    await notify(pool, row.user_id, 'FAMILY_DELETED', 'Family deleted',
      `${family.rows[0].name} was deleted by its owner.`, { family_id: req.params.familyId });
  }
  const result = await pool.query('DELETE FROM families WHERE id = $1 RETURNING id', [req.params.familyId]);
  return data(res, { deleted: true, id: result.rows[0].id });
}));

routes.notifications.get('/', wrap(async (req, res) => {
  const limit = req.query.limit === undefined ? 50 : Number(req.query.limit);
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) return fail(res, 'Invalid notification limit.');
  const result = await pool.query(
    `SELECT id, type, title, message, payload, is_read, created_at
     FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
    [req.user.id, limit],
  );
  return data(res, { notifications: result.rows });
}));

routes.notifications.patch('/:id/read', wrap(async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 'Invalid notification id.');
  const result = await pool.query(
    `UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2
     RETURNING id, type, title, message, payload, is_read, created_at`,
    [req.params.id, req.user.id],
  );
  if (!result.rowCount) return fail(res, 'Notification not found.', 404);
  return data(res, { notification: result.rows[0] });
}));

routes.notifications.post('/read-all', wrap(async (req, res) => {
  const result = await pool.query(
    'UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE',
    [req.user.id],
  );
  return data(res, { updated: result.rowCount });
}));

routes.notifications.delete('/:id', wrap(async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 'Invalid notification id.');
  const result = await pool.query('DELETE FROM notifications WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.user.id]);
  if (!result.rowCount) return fail(res, 'Notification not found.', 404);
  return data(res, { deleted: true, id: result.rows[0].id });
}));

routes.profile.get('/', wrap(async (req, res) => {
  const result = await pool.query(
    `SELECT id, username, full_name, email, avatar, role, status, created_at
     FROM users WHERE id = $1`,
    [req.user.id],
  );
  return data(res, { user: result.rows[0] });
}));

routes.profile.patch('/', wrap(async (req, res) => {
  const { full_name, avatar, email, current_password, password } = req.body || {};
  if ((full_name !== undefined && !validName(full_name, 150)) ||
      (avatar !== undefined && avatar !== null && (typeof avatar !== 'string' || avatar.length > 2000)) ||
      (email !== undefined && (typeof email !== 'string' || email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) ||
      (password !== undefined && (typeof password !== 'string' || password.length < 8 || password.length > 128)) ||
      ((email !== undefined || password !== undefined) && typeof current_password !== 'string')) return fail(res, 'Invalid profile update.');
  if (email !== undefined || password !== undefined) {
    const auth = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
    if (!await bcrypt.compare(current_password, auth.rows[0].password_hash)) return fail(res, 'Current password is incorrect.', 403);
  }
  const passwordHash = password === undefined ? null : await bcrypt.hash(password, env.bcryptRounds);
  const result = await pool.query(
    `UPDATE users SET full_name = COALESCE($1, full_name),
       avatar = CASE WHEN $2 THEN $3 ELSE avatar END,
       email = COALESCE($4, email), password_hash = COALESCE($5, password_hash)
     WHERE id = $6
     RETURNING id, username, full_name, email, avatar, role, status, created_at`,
    [full_name === undefined ? null : full_name.trim(), avatar !== undefined, avatar === undefined ? null : avatar,
      email === undefined ? null : email.trim().toLowerCase(), passwordHash, req.user.id],
  );
  return data(res, { user: result.rows[0] });
}));

routes.admin.use((req, res, next) => {
  if (req.user.role !== 'ADMIN') return fail(res, 'Insufficient permissions.', 403);
  return next();
});

routes.admin.get('/users', wrap(async (req, res) => {
  const limit = req.query.limit === undefined ? 100 : Number(req.query.limit);
  const offset = req.query.offset === undefined ? 0 : Number(req.query.offset);
  if (!Number.isInteger(limit) || limit < 1 || limit > 500 || !Number.isInteger(offset) || offset < 0) return fail(res, 'Invalid pagination.');
  const result = await pool.query(
    `SELECT id, username, full_name, email, avatar, role, status, created_at
     FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset],
  );
  return data(res, { users: result.rows, limit, offset });
}));

routes.admin.post('/users', wrap(async (req, res) => {
  const { username, full_name, email, password, role = 'USER' } = req.body || {};
  if (!validName(username, 50) || !/^[a-zA-Z0-9_.-]+$/.test(username) ||
      !validName(full_name, 150) || typeof email !== 'string' || email.length > 255 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof password !== 'string' || password.length < 8 || password.length > 128 ||
      !['USER', 'ADMIN'].includes(role)) return fail(res, 'Invalid user details.');
  const passwordHash = await bcrypt.hash(password, env.bcryptRounds);
  const result = await pool.query(
    `INSERT INTO users (username, full_name, email, password_hash, role)
     VALUES ($1, $2, lower($3), $4, $5)
     RETURNING id, username, full_name, email, avatar, role, status, created_at`,
    [username.toLowerCase(), full_name.trim(), email.trim(), passwordHash, role],
  );
  return data(res, { user: result.rows[0] }, 201);
}));

routes.admin.patch('/users/:id', wrap(async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 'Invalid user id.');
  const { role, status } = req.body || {};
  if ((role !== undefined && !['USER', 'ADMIN'].includes(role)) ||
      (status !== undefined && !['ACTIVE', 'LOCKED'].includes(status)) ||
      (role === undefined && status === undefined)) return fail(res, 'Invalid user update.');
  if (req.params.id === req.user.id && (status === 'LOCKED' || role === 'USER')) return fail(res, 'You cannot lock or demote your own account.', 409);
  const result = await pool.query(
    `UPDATE users SET role = COALESCE($1, role), status = COALESCE($2, status) WHERE id = $3
     RETURNING id, username, full_name, email, avatar, role, status, created_at`,
    [role || null, status || null, req.params.id],
  );
  if (!result.rowCount) return fail(res, 'User not found.', 404);
  if (req.params.id !== req.user.id) {
    const changes = [];
    if (role !== undefined) changes.push(`role: ${result.rows[0].role}`);
    if (status !== undefined) changes.push(`status: ${result.rows[0].status}`);
    await notify(pool, req.params.id, 'ADMIN_ACCOUNT_UPDATED', 'Account updated by an administrator',
      `An administrator updated your account (${changes.join(', ')}).`,
      { role: result.rows[0].role, status: result.rows[0].status });
  }
  return data(res, { user: result.rows[0] });
}));

routes.admin.post('/users/:id/reset-password', wrap(async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 'Invalid user id.');
  const { password } = req.body || {};
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
    return fail(res, 'Password must be between 8 and 128 characters.');
  }
  const passwordHash = await bcrypt.hash(password, env.bcryptRounds);
  const result = await pool.query(
    'UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id',
    [passwordHash, req.params.id],
  );
  if (!result.rowCount) return fail(res, 'User not found.', 404);
  return data(res, { password_reset: true, user_id: result.rows[0].id });
}));

routes.admin.delete('/users/:id', wrap(async (req, res) => {
  if (!validId(req.params.id)) return fail(res, 'Invalid user id.');
  if (req.params.id === req.user.id) return fail(res, 'You cannot delete your own account.', 409);
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [req.params.id]);
  if (!result.rowCount) return fail(res, 'User not found.', 404);
  return data(res, { deleted: true, id: result.rows[0].id });
}));

// Imports local data into the authenticated user's records; foreign identity fields are ignored.
routes.imports.post('/local', wrap(async (req, res) => {
  const body = req.body || {};
  const sourceKey = body.source_key;
  if (!validName(sourceKey, 200)) return fail(res, 'source_key is required and must be at most 200 characters.');
  const fields = ['categories', 'accounts', 'transactions', 'budgets', 'goals', 'families', 'family_members', 'family_invites', 'notifications'];
  for (const field of fields) {
    if (body[field] !== undefined && !Array.isArray(body[field])) return fail(res, `${field} must be an array.`);
    if ((body[field] || []).length > 1000) return fail(res, `${field} may contain at most 1000 records.`);
  }
  const categories = body.categories || [];
  const accounts = body.accounts || [];
  const transactions = body.transactions || [];
  const budgets = body.budgets || [];
  const goals = body.goals || [];
  const families = body.families || [];
  const familyMembers = body.family_members || [];
  const familyInvites = body.family_invites || [];
  const notifications = body.notifications || [];
  const totalRecords = fields.reduce((sum, field) => sum + (body[field] || []).length, 0);
  if (totalRecords > 2000) return fail(res, 'Import may contain at most 2000 records in total.');
  if (categories.some(item => !item || !validName(item.name || item.category_name) ||
      !['in', 'out'].includes(item.type) ||
      (item.description !== undefined && (typeof item.description !== 'string' || item.description.length > 2000)))) {
    return fail(res, 'One or more categories are invalid.');
  }
  if (accounts.some(item => !item || !validName(item.name || item.account_name) ||
      !accountTypes.includes(item.type || item.account_type) ||
      (item.opening_balance !== undefined && !validAmount(item.opening_balance)) ||
      (item.currency !== undefined && !/^[A-Z]{3}$/.test(item.currency)))) {
    return fail(res, 'One or more accounts are invalid.');
  }
  if (transactions.some(item => !item || !['in', 'out'].includes(item.type) || !positiveAmount(item.amount) ||
      !validDate(item.transaction_date || item.date) ||
      (item.account_id !== undefined && !validName(String(item.account_id), 200) && !validId(item.account_id)) ||
      (!item.account_id && !validName(item.account_name || item.account || 'Cash')) ||
      (item.category_id !== undefined && !validName(String(item.category_id), 200) && !validId(item.category_id)) ||
      (!item.category_id && !validName(item.category_name || item.category)) ||
      (item.note !== undefined && (typeof item.note !== 'string' || item.note.length > 500)) ||
      (item.payment_method !== undefined && !paymentMethods.includes(item.payment_method)))) {
    return fail(res, 'One or more transactions are invalid.');
  }
  if (budgets.some(item => !item || !validDate(item.month) ||
      new Date(`${item.month}T00:00:00Z`).getUTCDate() !== 1 ||
      !validAmount(item.amount) ||
      (item.category_id !== undefined && !validName(String(item.category_id), 200) && !validId(item.category_id)) ||
      (!item.category_id && !validName(item.category_name || item.category)))) {
    return fail(res, 'One or more budgets are invalid.');
  }
  if (goals.some(item => !item || !validName(item.name, 150) || !positiveAmount(item.target) ||
      (item.saved !== undefined && !validAmount(item.saved)) ||
      (item.deadline !== undefined && item.deadline !== null && !validDate(item.deadline)))) {
    return fail(res, 'One or more goals are invalid.');
  }
  if (families.some(item => !item || !validName(item.name || item.family_name, 150))) {
    return fail(res, 'One or more families are invalid.');
  }
  if (familyMembers.some(item => !item || typeof item !== 'object')) {
    return fail(res, 'One or more family member records are invalid.');
  }
  if (familyInvites.some(item => !item ||
      typeof item.email !== 'string' || item.email.length > 255 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email) ||
      (item.role !== undefined && !['MANAGER', 'MEMBER', 'CHILD'].includes(item.role)) ||
      (item.status !== undefined && !['PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED'].includes(item.status)))) {
    return fail(res, 'One or more family invites are invalid.');
  }
  if (notifications.some(item => !item ||
      !validName(item.title, 200) ||
      (item.type !== undefined && !validName(item.type, 50)) ||
      (item.message !== undefined && typeof item.message !== 'string'))) {
    return fail(res, 'One or more notifications are invalid.');
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT id FROM users WHERE id = $1 FOR UPDATE', [req.user.id]);
    const previous = await client.query(
      'SELECT imported FROM legacy_imports WHERE user_id = $1 AND source_key = $2',
      [req.user.id, sourceKey],
    );
    if (previous.rowCount) {
      await client.query('COMMIT');
      return res.json({ imported: previous.rows[0].imported, already_imported: true });
    }

    const counts = {
      categories: 0, accounts: 0, transactions: 0, budgets: 0, goals: 0,
      families: 0, family_members: 0, family_members_verified: 0, family_members_ignored: 0,
      family_invites: 0, family_invites_ignored: 0, notifications: 0,
    };
    const categoryIds = new Map();
    const accountIds = new Map();
    const familyIds = new Map();
    const getSourceId = item => item.source_id || item.external_id || item.legacy_id || item.id;
    const remember = (map, item, id) => {
      const sourceId = getSourceId(item);
      if (sourceId !== undefined && sourceId !== null && String(sourceId).length <= 200) map.set(String(sourceId), id);
    };
    const resolveCategory = async (entry, type) => {
      const sourceId = entry.category_id !== undefined ? String(entry.category_id) : null;
      if (sourceId && categoryIds.has(sourceId)) return categoryIds.get(sourceId);
      if (sourceId && validId(sourceId)) {
        const own = await client.query('SELECT id FROM categories WHERE id = $1 AND (user_id = $2 OR user_id IS NULL)', [sourceId, req.user.id]);
        if (own.rowCount) return own.rows[0].id;
      }
      const name = entry.category_name || (typeof entry.category === 'string' ? entry.category : null);
      if (!name) return null;
      const result = await client.query(
        `SELECT id FROM categories WHERE name = $1 AND type = $2 AND (user_id = $3 OR user_id IS NULL)
         ORDER BY (user_id IS NOT NULL) DESC LIMIT 1`,
        [name.trim(), type, req.user.id],
      );
      return result.rows[0] && result.rows[0].id;
    };
    const resolveAccount = async entry => {
      const sourceId = entry.account_id !== undefined ? String(entry.account_id) : null;
      if (sourceId && accountIds.has(sourceId)) return accountIds.get(sourceId);
      if (sourceId && validId(sourceId)) {
        const own = await client.query(
          'SELECT id FROM accounts WHERE id = $1 AND user_id = $2 AND family_id IS NULL',
          [sourceId, req.user.id],
        );
        if (own.rowCount) return own.rows[0].id;
      }
      const name = entry.account_name || (typeof entry.account === 'string' ? entry.account : null);
      if (!name) return null;
      const accountType = entry.account_type || 'cash';
      const result = await client.query(
        `SELECT id FROM accounts WHERE user_id = $1 AND family_id IS NULL AND name = $2
         AND type = $3 AND is_active = TRUE LIMIT 1`,
        [req.user.id, name.trim(), accountType],
      );
      if (result.rowCount) return result.rows[0].id;
      return (await client.query(
        'INSERT INTO accounts (user_id, name, type) VALUES ($1, $2, $3) RETURNING id',
        [req.user.id, name.trim(), accountType],
      )).rows[0].id;
    };

    // Create categories first, then resolve their optional parent links.
    const pendingParents = [];
    for (const entry of categories) {
      const name = (entry.name || entry.category_name).trim();
      const found = await client.query(
        `SELECT id FROM categories WHERE name = $1 AND type = $2 AND user_id = $3 LIMIT 1`,
        [name, entry.type, req.user.id],
      );
      const category = found.rows[0] || (await client.query(
        `INSERT INTO categories (name, type, description, user_id)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [name, entry.type, entry.description || '', req.user.id],
      )).rows[0];
      remember(categoryIds, entry, category.id);
      counts.categories += 1;
      if (entry.parent_id !== undefined && entry.parent_id !== null) pendingParents.push({ entry, categoryId: category.id });
    }
    for (const { entry, categoryId } of pendingParents) {
      const parentId = categoryIds.get(String(entry.parent_id));
      if (!parentId) throw Object.assign(new Error('Imported category parent must reference another category in this import.'), { statusCode: 400 });
      const parent = await client.query(
        'SELECT id FROM categories WHERE id = $1 AND user_id = $2 AND type = $3',
        [parentId, req.user.id, entry.type],
      );
      if (!parent.rowCount) throw Object.assign(new Error('Imported category parent is invalid.'), { statusCode: 400 });
      await client.query('UPDATE categories SET parent_id = $1 WHERE id = $2', [parentId, categoryId]);
    }

    for (const entry of accounts) {
      const name = (entry.name || entry.account_name).trim();
      const type = entry.type || entry.account_type;
      const result = await client.query(
        `INSERT INTO accounts (user_id, name, type, opening_balance, currency)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [req.user.id, name, type, entry.opening_balance === undefined ? 0 : entry.opening_balance, entry.currency || 'VND'],
      );
      remember(accountIds, entry, result.rows[0].id);
      counts.accounts += 1;
    }

    for (const entry of transactions) {
      const categoryId = await resolveCategory(entry, entry.type);
      const accountId = await resolveAccount(entry);
      if (!categoryId || !accountId) throw Object.assign(new Error('Imported transaction references an unavailable account or category.'), { statusCode: 400 });
      await client.query(
        `INSERT INTO transactions (user_id, account_id, category_id, type, amount, transaction_date,
          payment_method, note, scope, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'personal', $1)`,
        [req.user.id, accountId, categoryId, entry.type, entry.amount, entry.transaction_date || entry.date,
          entry.payment_method || entry.account_type || 'cash', entry.note || ''],
      );
      counts.transactions += 1;
    }

    for (const entry of budgets) {
      const categoryId = await resolveCategory(entry, 'out');
      if (!categoryId) throw Object.assign(new Error('Imported budget references an unavailable expense category.'), { statusCode: 400 });
      await client.query(
        `INSERT INTO budgets (user_id, category_id, month, amount) VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, category_id, month) WHERE user_id IS NOT NULL
         DO UPDATE SET amount = EXCLUDED.amount`,
        [req.user.id, categoryId, entry.month, entry.amount],
      );
      counts.budgets += 1;
    }

    for (const entry of goals) {
      await client.query(
        `INSERT INTO goals (user_id, name, target, saved, deadline)
         VALUES ($1, $2, $3, $4, $5)`,
        [req.user.id, entry.name.trim(), entry.target, validAmount(entry.saved) ? entry.saved : 0, entry.deadline || null],
      );
      counts.goals += 1;
    }

    for (const entry of families) {
      const family = await client.query(
        'INSERT INTO families (name, created_by) VALUES ($1, $2) RETURNING id',
        [(entry.name || entry.family_name).trim(), req.user.id],
      );
      await client.query(
        `INSERT INTO family_members (family_id, user_id, role, status) VALUES ($1, $2, 'OWNER', 'ACTIVE')`,
        [family.rows[0].id, req.user.id],
      );
      const sourceId = getSourceId(entry);
      if (sourceId !== undefined && sourceId !== null && String(sourceId).length <= 200) {
        familyIds.set(String(sourceId), family.rows[0].id);
      }
      counts.families += 1;
      counts.family_members += 1;
    }

    const resolveImportedFamily = async sourceId => {
      if (sourceId === undefined || sourceId === null) return null;
      const mapped = familyIds.get(String(sourceId));
      if (mapped) return mapped;
      if (!validId(String(sourceId))) return null;
      const accessible = await client.query(
        `SELECT f.id FROM families f JOIN family_members fm ON fm.family_id = f.id
         WHERE f.id = $1 AND fm.user_id = $2 AND fm.status = 'ACTIVE'`,
        [String(sourceId), req.user.id],
      );
      return accessible.rows[0] && accessible.rows[0].id;
    };

    // Local role/status values never grant membership. A new imported family
    // has the caller as OWNER; existing family membership is retained from DB.
    for (const member of familyMembers) {
      const selfReference = member.is_self === true || member.user === 'self';
      const familyId = await resolveImportedFamily(member.family_source_id || member.family_id);
      if (!selfReference || !familyId) {
        counts.family_members_ignored += 1;
        continue;
      }
      const existing = await client.query(
        `SELECT role, status FROM family_members WHERE family_id = $1 AND user_id = $2`,
        [familyId, req.user.id],
      );
      if (!existing.rowCount || existing.rows[0].status !== 'ACTIVE') {
        counts.family_members_ignored += 1;
        continue;
      }
      if (!familyIds.has(String(member.family_source_id || member.family_id))) {
        counts.family_members_verified += 1;
      }
    }

    // Preserve invite history only for families the importer can access. Never
    // trust imported inviter IDs; pending invites are revoked on restore so a
    // local export cannot silently grant access to another user.
    for (const invite of familyInvites) {
      const familyId = await resolveImportedFamily(invite.family_source_id || invite.family_id);
      if (!familyId) {
        counts.family_invites_ignored += 1;
        continue;
      }
      const membership = await client.query(
        `SELECT role FROM family_members
         WHERE family_id = $1 AND user_id = $2 AND status = 'ACTIVE'`,
        [familyId, req.user.id],
      );
      if (!membership.rowCount || !['OWNER', 'MANAGER'].includes(membership.rows[0].role)) {
        counts.family_invites_ignored += 1;
        continue;
      }
      const recipient = await client.query(
        'SELECT email FROM users WHERE lower(email) = lower($1)',
        [invite.email],
      );
      if (!recipient.rowCount) {
        counts.family_invites_ignored += 1;
        continue;
      }
      const requestedStatus = invite.status || 'PENDING';
      const restoredStatus = requestedStatus === 'PENDING' ? 'REVOKED' : requestedStatus;
      const expiration = invite.expires_at && !Number.isNaN(Date.parse(invite.expires_at))
        ? new Date(invite.expires_at).toISOString()
        : new Date().toISOString();
      await client.query(
        `INSERT INTO family_invites
          (family_id, invited_by, email, role, token_hash, status, expires_at)
         VALUES ($1, $2, lower($3), $4, $5, $6, $7)`,
        [familyId, req.user.id, recipient.rows[0].email, invite.role || 'MEMBER',
          crypto.createHash('sha256').update(crypto.randomBytes(32)).digest('hex'),
          restoredStatus, expiration],
      );
      counts.family_invites += 1;
    }

    for (const entry of notifications) {
      await client.query(
        `INSERT INTO notifications (user_id, type, title, message, payload)
         VALUES ($1, $2, $3, $4, $5::jsonb)`,
        [req.user.id, entry.type || 'IMPORTED', entry.title, entry.message || '',
          JSON.stringify(entry.payload && typeof entry.payload === 'object' && !Array.isArray(entry.payload) ? entry.payload : {})],
      );
      counts.notifications += 1;
    }

    await client.query(
      'INSERT INTO legacy_imports (user_id, source_key, imported) VALUES ($1, $2, $3::jsonb)',
      [req.user.id, sourceKey, JSON.stringify(counts)],
    );
    await client.query('COMMIT');
    return res.json({ imported: counts, already_imported: false });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}));

module.exports = routes;
