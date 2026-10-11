CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    avatar TEXT,
    role VARCHAR(10) NOT NULL DEFAULT 'USER'
        CHECK (role IN ('USER', 'ADMIN')),
    status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'LOCKED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE families (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE family_members (
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(10) NOT NULL DEFAULT 'MEMBER'
        CHECK (role IN ('OWNER', 'MANAGER', 'MEMBER', 'CHILD')),
    status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'PENDING')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (family_id, user_id)
);

CREATE TABLE family_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    invited_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL DEFAULT 'MEMBER'
        CHECK (role IN ('MANAGER', 'MEMBER', 'CHILD')),
    token_hash TEXT NOT NULL UNIQUE,
    status VARCHAR(10) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED')),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX family_invites_family_status_idx
    ON family_invites (family_id, status);

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(3) NOT NULL CHECK (type IN ('in', 'out')),
    description TEXT NOT NULL DEFAULT '',
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES categories(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (id, user_id)
);

CREATE UNIQUE INDEX categories_user_name_type_idx
    ON categories (user_id, name, type)
    WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX categories_default_name_type_idx
    ON categories (name, type)
    WHERE user_id IS NULL;

CREATE INDEX categories_parent_id_idx ON categories (parent_id);

CREATE FUNCTION enforce_category_parent_rules()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    parent_category categories%ROWTYPE;
BEGIN
    IF NEW.parent_id IS NOT NULL THEN
        IF NEW.parent_id = NEW.id THEN
            RAISE EXCEPTION 'A category cannot be its own parent';
        END IF;

        SELECT * INTO parent_category
        FROM categories
        WHERE id = NEW.parent_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Parent category does not exist';
        END IF;
        IF parent_category.parent_id IS NOT NULL THEN
            RAISE EXCEPTION 'Categories may have at most two levels';
        END IF;
        IF parent_category.type <> NEW.type THEN
            RAISE EXCEPTION 'Parent and child categories must have the same type';
        END IF;
        IF parent_category.user_id IS DISTINCT FROM NEW.user_id THEN
            RAISE EXCEPTION 'Parent and child categories must have the same owner';
        END IF;
        IF EXISTS (SELECT 1 FROM categories WHERE parent_id = NEW.id) THEN
            RAISE EXCEPTION 'A category with children cannot become a child category';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER categories_parent_rules_trigger
    BEFORE INSERT OR UPDATE OF parent_id, type, user_id ON categories
    FOR EACH ROW EXECUTE FUNCTION enforce_category_parent_rules();

CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    family_id UUID REFERENCES families(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('cash', 'bank', 'wallet')),
    opening_balance NUMERIC(14, 2) NOT NULL DEFAULT 0
        CHECK (opening_balance >= 0),
    currency CHAR(3) NOT NULL DEFAULT 'VND',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX accounts_user_id_idx ON accounts (user_id);
CREATE INDEX accounts_family_id_idx ON accounts (family_id) WHERE family_id IS NOT NULL;

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    type VARCHAR(3) NOT NULL CHECK (type IN ('in', 'out')),
    amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method VARCHAR(10) NOT NULL DEFAULT 'cash'
        CHECK (payment_method IN ('cash', 'bank', 'wallet', 'card', 'other')),
    note TEXT NOT NULL DEFAULT '',
    scope VARCHAR(10) NOT NULL DEFAULT 'personal'
        CHECK (scope IN ('personal', 'family')),
    family_id UUID REFERENCES families(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (
        (scope = 'personal' AND user_id IS NOT NULL AND family_id IS NULL)
        OR (scope = 'family' AND family_id IS NOT NULL)
    )
);

CREATE INDEX transactions_user_date_idx
    ON transactions (user_id, transaction_date DESC)
    WHERE user_id IS NOT NULL;
CREATE INDEX transactions_family_date_idx
    ON transactions (family_id, transaction_date DESC)
    WHERE family_id IS NOT NULL;
CREATE INDEX transactions_account_date_idx
    ON transactions (account_id, transaction_date DESC);
CREATE INDEX transactions_category_date_idx
    ON transactions (category_id, transaction_date DESC);

CREATE TABLE transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    family_id UUID REFERENCES families(id) ON DELETE CASCADE,
    from_account UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
    to_account UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
    amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
    transfer_date DATE NOT NULL DEFAULT CURRENT_DATE,
    note TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (from_account <> to_account)
);

CREATE INDEX transfers_user_date_idx ON transfers (user_id, transfer_date DESC);
CREATE INDEX transfers_family_date_idx
    ON transfers (family_id, transfer_date DESC)
    WHERE family_id IS NOT NULL;

CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    family_id UUID REFERENCES families(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    month DATE NOT NULL CHECK (EXTRACT(DAY FROM month) = 1),
    amount NUMERIC(14, 2) NOT NULL CHECK (amount >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK ((user_id IS NOT NULL AND family_id IS NULL)
        OR (user_id IS NULL AND family_id IS NOT NULL))
);

CREATE UNIQUE INDEX budgets_user_category_month_idx
    ON budgets (user_id, category_id, month)
    WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX budgets_family_category_month_idx
    ON budgets (family_id, category_id, month)
    WHERE family_id IS NOT NULL;

CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    family_id UUID REFERENCES families(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    target NUMERIC(14, 2) NOT NULL CHECK (target > 0),
    saved NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (saved >= 0),
    deadline DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK ((user_id IS NOT NULL AND family_id IS NULL)
        OR (user_id IS NULL AND family_id IS NOT NULL))
);

CREATE INDEX goals_user_id_idx ON goals (user_id) WHERE user_id IS NOT NULL;
CREATE INDEX goals_family_id_idx ON goals (family_id) WHERE family_id IS NOT NULL;

CREATE TABLE goal_contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
    contribution_date DATE NOT NULL DEFAULT CURRENT_DATE,
    note TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX goal_contributions_goal_date_idx
    ON goal_contributions (goal_id, contribution_date DESC);

CREATE TABLE recurring_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    family_id UUID REFERENCES families(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    type VARCHAR(3) NOT NULL CHECK (type IN ('in', 'out')),
    amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
    frequency VARCHAR(10) NOT NULL CHECK (frequency IN ('weekly', 'monthly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE,
    next_run DATE NOT NULL,
    payment_method VARCHAR(10) NOT NULL DEFAULT 'cash'
        CHECK (payment_method IN ('cash', 'bank', 'wallet', 'card', 'other')),
    note TEXT NOT NULL DEFAULT '',
    tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK ((user_id IS NOT NULL AND family_id IS NULL)
        OR (user_id IS NULL AND family_id IS NOT NULL)),
    CHECK (end_date IS NULL OR end_date >= start_date),
    CHECK (next_run >= start_date),
    CHECK (end_date IS NULL OR next_run <= end_date)
);

CREATE INDEX recurring_rules_user_next_run_idx
    ON recurring_rules (user_id, next_run) WHERE user_id IS NOT NULL;
CREATE INDEX recurring_rules_family_next_run_idx
    ON recurring_rules (family_id, next_run) WHERE family_id IS NOT NULL;

CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX attachments_transaction_id_idx ON attachments (transaction_id);

INSERT INTO users (username, full_name, email, password_hash, role)
VALUES (
    'admin',
    'Quản trị viên',
    'admin@example.com',
    crypt(encode(gen_random_bytes(32), 'hex'), gen_salt('bf')),
    'ADMIN'
);

INSERT INTO categories (name, type, description)
VALUES
    ('Lương', 'in', 'Thu nhập từ lương'),
    ('Thu nhập khác', 'in', 'Các khoản thu khác'),
    ('Ăn uống', 'out', 'Chi phí ăn uống'),
    ('Nhà cửa', 'out', 'Chi phí nhà cửa'),
    ('Di chuyển', 'out', 'Chi phí đi lại'),
    ('Sức khỏe', 'out', 'Chi phí sức khỏe'),
    ('Giải trí', 'out', 'Chi phí giải trí');

INSERT INTO categories (name, type, description, parent_id)
SELECT child.name, child.type, child.description, parent.id
FROM (VALUES
    ('Đi chợ', 'out', 'Thực phẩm và nhu yếu phẩm', 'Ăn uống'),
    ('Ăn ngoài', 'out', 'Nhà hàng và quán ăn', 'Ăn uống'),
    ('Tiền thuê nhà', 'out', 'Tiền thuê hoặc trả góp nhà', 'Nhà cửa'),
    ('Điện nước', 'out', 'Điện, nước và dịch vụ nhà', 'Nhà cửa'),
    ('Xăng xe', 'out', 'Nhiên liệu và phương tiện', 'Di chuyển'),
    ('Khám chữa bệnh', 'out', 'Khám và điều trị', 'Sức khỏe'),
    ('Mua sắm', 'out', 'Mua sắm cá nhân', 'Giải trí')
) AS child(name, type, description, parent_name)
JOIN categories AS parent
    ON parent.name = child.parent_name
    AND parent.type = child.type
    AND parent.user_id IS NULL;