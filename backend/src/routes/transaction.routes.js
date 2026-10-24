const express = require('express');
const pool = require('../config/db');
const authenticate = require('../middleware/auth.middleware');
const router = express.Router();
router.use(authenticate);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const fail = (res, message, status=400) => res.status(status).json({message});
const wrap = fn => (req,res,next) => Promise.resolve(fn(req,res)).catch(next);
const validDate = value => {
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value||''))return false;
 const date=new Date(`${value}T00:00:00.000Z`);
 return !Number.isNaN(date.getTime())&&date.toISOString().slice(0,10)===value;
};
const accessible = `((t.scope='personal' AND t.user_id=$1) OR (t.scope='family' AND EXISTS (SELECT 1 FROM family_members fm WHERE fm.family_id=t.family_id AND fm.user_id=$1 AND fm.status='ACTIVE')))`;
router.get('/',wrap(async(req,res)=>{
 const {scope='personal',month,year,from,to,type,category_id,account_id,member_id,family_id,q}=req.query;
 if(!['personal','family','all'].includes(scope))return fail(res,'Invalid scope');
 if(month!==undefined && (!/^\d{1,2}$/.test(month)||+month<1||+month>12))return fail(res,'Invalid month');
 if(year!==undefined && (!/^\d{4}$/.test(year)||+year<2000||+year>2100))return fail(res,'Invalid year');
 if(from!==undefined&&!validDate(from))return fail(res,'Invalid start date');
 if(to!==undefined&&!validDate(to))return fail(res,'Invalid end date');
 if(from&&to&&from>to)return fail(res,'Start date must not be after end date');
 if(type!==undefined&&!['in','out'].includes(type))return fail(res,'Invalid transaction type');
 if(category_id!==undefined&&!uuid.test(category_id))return fail(res,'Invalid category id');
 if(account_id!==undefined&&!uuid.test(account_id))return fail(res,'Invalid account id');
 if(member_id!==undefined&&!uuid.test(member_id))return fail(res,'Invalid member id');
 if(family_id!==undefined&&(!uuid.test(family_id)||scope==='personal'))return fail(res,'Invalid family id');
 if(q!==undefined&&(typeof q!=='string'||q.length>200))return fail(res,'Invalid search query');
 const access=req.user.role==='ADMIN'?'TRUE':accessible;
 const params=req.user.role==='ADMIN'?[]:[req.user.id];
 let sql=`SELECT t.*,c.name AS category_name,a.name AS account_name,a.type AS account_type,u.email AS owner_email FROM transactions t JOIN categories c ON c.id=t.category_id JOIN accounts a ON a.id=t.account_id LEFT JOIN users u ON u.id=COALESCE(t.user_id,t.created_by) WHERE ${access}`;
 if(scope!=='all'){params.push(scope);sql+=` AND t.scope=$${params.length}`;}
 if(family_id!==undefined){const member=await pool.query("SELECT 1 FROM family_members WHERE family_id=$1 AND user_id=$2 AND status='ACTIVE'",[family_id,req.user.id]);if(!member.rowCount)return fail(res,'Family access denied',403);params.push(family_id);sql+=` AND t.family_id=$${params.length}`;}
 if(month!==undefined){params.push(+month);sql+=` AND EXTRACT(MONTH FROM t.transaction_date)=$${params.length}`;}
 if(year!==undefined){params.push(+year);sql+=` AND EXTRACT(YEAR FROM t.transaction_date)=$${params.length}`;}
 if(from!==undefined){params.push(from);sql+=` AND t.transaction_date>=$${params.length}::date`;}
 if(to!==undefined){params.push(to);sql+=` AND t.transaction_date<=$${params.length}::date`;}
 if(type!==undefined){params.push(type);sql+=` AND t.type=$${params.length}`;}
 if(category_id!==undefined){params.push(category_id);sql+=` AND t.category_id=$${params.length}`;}
 if(account_id!==undefined){params.push(account_id);sql+=` AND t.account_id=$${params.length}`;}
 if(member_id!==undefined){params.push(member_id);sql+=` AND t.created_by=$${params.length}`;}
 if(q){params.push(`%${q}%`);sql+=` AND (t.note ILIKE $${params.length} OR c.name ILIKE $${params.length})`;}
 sql+=' ORDER BY t.transaction_date DESC,t.created_at DESC LIMIT 500';
 res.json({transactions:(await pool.query(sql,params)).rows});
}));
router.post('/',wrap(async(req,res)=>{
 const {account_id,category_id,type,amount,transaction_date,note='',payment_method='cash',scope='personal',family_id}=req.body;
 if(!uuid.test(account_id||'')||!uuid.test(category_id||'')||!['in','out'].includes(type)||!Number.isFinite(Number(amount))||Number(amount)<=0||Number(amount)>999999999999)return fail(res,'Invalid transaction');
 if(transaction_date && !validDate(transaction_date))return fail(res,'Invalid date');
 if(typeof note!=='string'||note.length>500||!['cash','bank','wallet','card','other'].includes(payment_method)||!['personal','family'].includes(scope))return fail(res,'Invalid details');
 if(scope==='personal'&&family_id)return fail(res,'Personal transactions cannot specify a family');
 if(scope==='family'&&!uuid.test(family_id||''))return fail(res,'Invalid family');
 const accountSql=scope==='personal'
  ? 'SELECT id FROM accounts WHERE id=$1 AND user_id=$2 AND family_id IS NULL AND is_active=TRUE'
  : `SELECT a.id FROM accounts a WHERE a.id=$1 AND a.family_id=$3 AND a.is_active=TRUE
      AND EXISTS (SELECT 1 FROM family_members fm WHERE fm.family_id=a.family_id AND fm.user_id=$2 AND fm.status='ACTIVE' AND fm.role<>'CHILD')`;
 const a=await pool.query(accountSql,scope==='personal'?[account_id,req.user.id]:[account_id,req.user.id,family_id]);
 const c=await pool.query('SELECT id FROM categories WHERE id=$1 AND type=$2 AND (user_id=$3 OR user_id IS NULL)',[category_id,type,req.user.id]);
 if(!a.rowCount||!c.rowCount)return fail(res,'Account or category unavailable',403);
 if(scope==='family'){
  const member=await pool.query("SELECT 1 FROM family_members WHERE family_id=$1 AND user_id=$2 AND status='ACTIVE' AND role<>'CHILD'",[family_id,req.user.id]);
  if(!member.rowCount)return fail(res,'Family transaction permission denied',403);
 }
 const q=scope==='personal'
  ? await pool.query(`INSERT INTO transactions(user_id,account_id,category_id,type,amount,transaction_date,payment_method,note,scope,created_by) VALUES($1,$2,$3,$4,$5,COALESCE($6::date,CURRENT_DATE),$7,$8,'personal',$1) RETURNING *`,[req.user.id,account_id,category_id,type,amount,transaction_date||null,payment_method,note])
  : await pool.query(`INSERT INTO transactions(account_id,category_id,type,amount,transaction_date,payment_method,note,scope,family_id,created_by) VALUES($1,$2,$3,$4,COALESCE($5::date,CURRENT_DATE),$6,$7,'family',$8,$9) RETURNING *`,[account_id,category_id,type,amount,transaction_date||null,payment_method,note,family_id,req.user.id]);
 res.status(201).json({transaction:q.rows[0]});
}));
router.put('/:id',wrap(async(req,res)=>{
 const id=req.params.id;
 if(!uuid.test(id))return fail(res,'Invalid id');
 const {account_id,category_id,type,amount,transaction_date,note='',payment_method='cash'}=req.body||{};
 if(!uuid.test(account_id||'')||!uuid.test(category_id||'')||!['in','out'].includes(type)||!Number.isFinite(Number(amount))||Number(amount)<=0||Number(amount)>999999999999)return fail(res,'Invalid transaction');
 if(transaction_date&&!validDate(transaction_date))return fail(res,'Invalid date');
 if(typeof note!=='string'||note.length>500||!['cash','bank','wallet','card','other'].includes(payment_method))return fail(res,'Invalid details');
 const client=await pool.connect();
 try{
  await client.query('BEGIN');
  const current=(await client.query(`SELECT t.scope,t.family_id FROM transactions t
    WHERE t.id=$1 AND (
      (t.scope='personal' AND t.user_id=$2) OR
      (t.scope='family' AND EXISTS (SELECT 1 FROM family_members fm WHERE fm.family_id=t.family_id AND fm.user_id=$2
        AND fm.status='ACTIVE' AND fm.role<>'CHILD' AND (fm.role IN ('OWNER','MANAGER') OR t.created_by=$2)))
    ) FOR UPDATE`,[id,req.user.id])).rows[0];
  if(!current){await client.query('ROLLBACK');return fail(res,'Transaction not found or unavailable',404);}
  const accountQuery=current.scope==='personal'
   ? 'SELECT id FROM accounts WHERE id=$1 AND user_id=$2 AND family_id IS NULL AND is_active=TRUE'
   : 'SELECT id FROM accounts WHERE id=$1 AND family_id=$2 AND is_active=TRUE';
  const accountParams=current.scope==='personal'?[account_id,req.user.id]:[account_id,current.family_id];
  const account=await client.query(accountQuery,accountParams);
  const category=await client.query('SELECT id FROM categories WHERE id=$1 AND type=$2 AND (user_id=$3 OR user_id IS NULL)',[category_id,type,req.user.id]);
  if(!account.rowCount||!category.rowCount){await client.query('ROLLBACK');return fail(res,'Account or category unavailable',403);}
  const updated=await client.query(`UPDATE transactions SET account_id=$1,category_id=$2,type=$3,amount=$4,
    transaction_date=COALESCE($5::date,transaction_date),payment_method=$6,note=$7
    WHERE id=$8 RETURNING *`,[account_id,category_id,type,amount,transaction_date||null,payment_method,note,id]);
  await client.query('COMMIT');
  res.json({transaction:updated.rows[0]});
 }catch(error){await client.query('ROLLBACK').catch(()=>{});throw error;}finally{client.release();}
}));

// Demo bridge: translates local UI category/account names to DB records, always scoped to JWT user.
// DB schema required: database/init.sql (14-column transactions), never the legacy 8-column schema.
async function quick(req, res, editingId) {
 const { account_name, account_type='cash', category_name, type, amount,
   transaction_date, note='', payment_method='cash' }=req.body || {};
 const validName = value => typeof value==='string' && value.trim().length>0 && value.trim().length<=100;
 if(!validName(account_name)||!validName(category_name)||!['cash','bank','wallet'].includes(account_type)
    ||!['in','out'].includes(type)||!Number.isFinite(Number(amount))||Number(amount)<=0||Number(amount)>999999999999
    ||!validDate(transaction_date)
    ||typeof note!=='string'||note.length>500||!['cash','bank','wallet','card','other'].includes(payment_method))
   return fail(res,'Thông tin giao dịch không hợp lệ');
 if (editingId && !uuid.test(editingId)) return fail(res,'Invalid id');
 const client=await pool.connect();
 try {
  await client.query('BEGIN');
  // Lock user row to serialize account/category creation for this user.
  await client.query('SELECT id FROM users WHERE id=$1 FOR UPDATE',[req.user.id]);
  const categoryName=category_name.trim(),accountName=account_name.trim();
  let category=(await client.query('SELECT id FROM categories WHERE name=$1 AND type=$2 AND (user_id=$3 OR user_id IS NULL) ORDER BY (user_id IS NOT NULL) DESC LIMIT 1',[categoryName,type,req.user.id])).rows[0];
  if(!category) category=(await client.query('INSERT INTO categories(name,type,user_id) VALUES($1,$2,$3) RETURNING id',[categoryName,type,req.user.id])).rows[0];
  let account=(await client.query('SELECT id FROM accounts WHERE name=$1 AND type=$2 AND user_id=$3 AND family_id IS NULL AND is_active=TRUE LIMIT 1',[accountName,account_type,req.user.id])).rows[0];
  if(!account) account=(await client.query('INSERT INTO accounts(name,type,user_id) VALUES($1,$2,$3) RETURNING id',[accountName,account_type,req.user.id])).rows[0];
  let result;
  if(editingId) {
   result=await client.query(`UPDATE transactions SET category_id=$1,account_id=$2,type=$3,amount=$4,
      transaction_date=$5,note=$6,payment_method=$7 WHERE id=$8 AND user_id=$9 AND scope='personal' RETURNING *`,
      [category.id,account.id,type,amount,transaction_date,note,payment_method,editingId,req.user.id]);
   if(!result.rowCount) {await client.query('ROLLBACK');return fail(res,'Giao dịch không tồn tại hoặc không thuộc tài khoản',404);}
  } else {
   result=await client.query(`INSERT INTO transactions(user_id,account_id,category_id,type,amount,transaction_date,payment_method,note,scope,created_by)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,'personal',$1) RETURNING *`,
      [req.user.id,account.id,category.id,type,amount,transaction_date,payment_method,note]);
  }
  await client.query('COMMIT');
  res.status(editingId?200:201).json({transaction:{...result.rows[0], category_name:categoryName,account_name:accountName,account_type}});
 }catch(error){await client.query('ROLLBACK').catch(()=>{});throw error;}finally{client.release();}
}
router.post('/quick',wrap(async(req,res)=>quick(req,res,null)));
router.put('/:id/quick',wrap(async(req,res)=>quick(req,res,req.params.id)));
router.delete('/:id',wrap(async(req,res)=>{
 if(!uuid.test(req.params.id))return fail(res,'Invalid id');
 const result=await pool.query(`DELETE FROM transactions t WHERE t.id=$1 AND (
   $3::boolean OR
   (t.scope='personal' AND t.user_id=$2) OR
   (t.scope='family' AND EXISTS (SELECT 1 FROM family_members fm WHERE fm.family_id=t.family_id AND fm.user_id=$2
     AND fm.status='ACTIVE' AND fm.role<>'CHILD' AND (fm.role IN ('OWNER','MANAGER') OR t.created_by=$2)))
 ) RETURNING t.id`,[req.params.id,req.user.id,req.user.role==='ADMIN']);
 if(!result.rowCount)return fail(res,'Transaction not found',404);
 res.json({deleted:true,id:result.rows[0].id});
}));
module.exports=router;
