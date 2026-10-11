-- Chạy THỦ CÔNG sau init.sql khi nối Backend (giao diện hiện lưu bằng localStorage nên chưa bắt buộc).
-- Mục đích: đồng bộ CSDL với các chức năng mới của giao diện.
-- LƯU Ý: file này chưa được chạy thử trên PostgreSQL; hãy thử trên DB trống trước.

-- 1) Giao diện có "Tên đăng nhập" nhưng bảng users chưa có cột này
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(30) UNIQUE;

-- 2) Danh mục MẶC ĐỊNH do admin tạo: user_id = NULL
ALTER TABLE categories ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_user_id_name_type_key;
CREATE UNIQUE INDEX IF NOT EXISTS categories_user_name_type_uq
    ON categories (user_id, lower(name), type) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS categories_default_name_type_uq
    ON categories (lower(name), type) WHERE user_id IS NULL;

-- 3) Khóa ngoại ghép (category_id, user_id) không dùng được với danh mục mặc định
--    → đổi sang khóa ngoại thường + trigger kiểm tra danh mục thuộc đúng người dùng (hoặc là mặc định)
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_category_id_user_id_fkey;
ALTER TABLE transactions
    ADD CONSTRAINT transactions_category_id_fkey
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT;

CREATE OR REPLACE FUNCTION check_tx_category_owner() RETURNS trigger AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM categories c
        WHERE c.id = NEW.category_id AND (c.user_id IS NULL OR c.user_id = NEW.user_id)
    ) THEN
        RAISE EXCEPTION 'Danh mục không thuộc người dùng này';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tx_category_owner_chk ON transactions;
CREATE TRIGGER tx_category_owner_chk
    BEFORE INSERT OR UPDATE OF category_id, user_id ON transactions
    FOR EACH ROW EXECUTE FUNCTION check_tx_category_owner();
