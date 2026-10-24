-- API features migration for existing databases.
ALTER TABLE families ADD COLUMN IF NOT EXISTS monthly_budget NUMERIC(14, 2)
    CHECK (monthly_budget IS NULL OR monthly_budget >= 0);
ALTER TABLE family_invites DROP CONSTRAINT IF EXISTS family_invites_status_check;
ALTER TABLE family_invites ADD CONSTRAINT family_invites_status_check
    CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'REVOKED'));
ALTER TABLE families ADD COLUMN IF NOT EXISTS settings JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS family_id UUID REFERENCES families(id) ON DELETE CASCADE;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN NOT NULL DEFAULT FALSE;

DROP INDEX IF EXISTS categories_user_name_type_idx;
CREATE UNIQUE INDEX categories_user_name_type_idx
    ON categories (user_id, name, type)
    WHERE user_id IS NOT NULL AND family_id IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS categories_family_name_type_idx
    ON categories (family_id, name, type) WHERE family_id IS NOT NULL;

CREATE OR REPLACE FUNCTION enforce_category_parent_rules()
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
        SELECT * INTO parent_category FROM categories WHERE id = NEW.parent_id;
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Parent category does not exist';
        END IF;
        IF parent_category.parent_id IS NOT NULL THEN
            RAISE EXCEPTION 'Categories may have at most two levels';
        END IF;
        IF parent_category.type <> NEW.type OR
           parent_category.user_id IS DISTINCT FROM NEW.user_id OR
           parent_category.family_id IS DISTINCT FROM NEW.family_id THEN
            RAISE EXCEPTION 'Parent and child categories must have the same scope';
        END IF;
        IF EXISTS (SELECT 1 FROM categories WHERE parent_id = NEW.id) THEN
            RAISE EXCEPTION 'A category with children cannot become a child category';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS categories_parent_rules_trigger ON categories;
CREATE TRIGGER categories_parent_rules_trigger
    BEFORE INSERT OR UPDATE OF parent_id, type, user_id, family_id ON categories
    FOR EACH ROW EXECUTE FUNCTION enforce_category_parent_rules();

CREATE TABLE IF NOT EXISTS account_adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    amount NUMERIC(14, 2) NOT NULL CHECK (amount <> 0),
    balance_before NUMERIC(14, 2) NOT NULL,
    balance_after NUMERIC(14, 2) NOT NULL,
    note TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (balance_after = balance_before + amount)
);

CREATE INDEX IF NOT EXISTS account_adjustments_account_created_idx
    ON account_adjustments (account_id, created_at DESC);

CREATE TABLE IF NOT EXISTS goal_withdrawals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
    withdrawal_date DATE NOT NULL DEFAULT CURRENT_DATE,
    note TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS goal_withdrawals_goal_date_idx
    ON goal_withdrawals (goal_id, withdrawal_date DESC);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL DEFAULT '',
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS notifications_user_created_idx
    ON notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_user_unread_idx
    ON notifications (user_id, created_at DESC) WHERE is_read = FALSE;

CREATE TABLE IF NOT EXISTS legacy_imports (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source_key VARCHAR(200) NOT NULL,
    imported JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, source_key)
);
