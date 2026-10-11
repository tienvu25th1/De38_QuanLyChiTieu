# Thay đổi giao diện (giữ nguyên bố cục / màu sắc)

Sửa chính ở `frontend/js/common.js`, bổ sung CSS cuối `frontend/css/common.css`, vá nhẹ `frontend/index.html`.

## User
- Dashboard: lọc theo tháng (‹ ›, Tháng này, Tất cả), biểu đồ thu vs chi, giao dịch gần đây, nút nổi THÊM GIAO DỊCH.
- Giao dịch: ĐẶT LẠI LỌC, lọc khoảng ngày, phân trang, sắp xếp (Số tiền/Ngày), chọn nhiều + Xóa đã chọn, XUẤT CSV.
- Form giao dịch chỉ hiện danh mục đúng loại Thu/Chi; danh mục lưu theo id.
- Danh mục: chặn xóa danh mục đang có giao dịch; thấy danh mục mặc định của admin (không sửa/xóa được).
- Báo cáo: THÁNG NÀY / NĂM NAY / ĐẶT LẠI, biểu đồ Cột/Tròn, bảng theo tháng, XUẤT CSV, IN / LƯU PDF.
- Tài khoản: hỏi mật khẩu hiện tại khi đổi mật khẩu, kiểm tra trùng email/tên đăng nhập, XÓA TÀI KHOẢN.

## Admin
- Dashboard: người dùng bị khóa / mới 30 ngày, top danh mục chi, người dùng hoạt động nhiều nhất, lọc theo tháng.
- Người dùng: THÊM NGƯỜI DÙNG, Đặt lại MK (mật khẩu tạm), Xóa, lọc quyền/trạng thái, phân trang;
  hộp thoại Xem có giao dịch gần đây + Khóa/Phân quyền; không thể khóa/đổi quyền/xóa chính mình.
- Danh mục: cột Chủ sở hữu; admin tạo danh mục mặc định, chỉ sửa danh mục mặc định, xóa được mọi danh mục (nếu chưa có giao dịch).
- Giao dịch: bỏ nút Sửa (admin chỉ xem/xóa), ĐẶT LẠI, "Tất cả người dùng", phân trang, XUẤT CSV.
- Báo cáo: thêm bảng theo tháng và theo người dùng, xuất CSV, in.

## Khác
- Dữ liệu giờ lưu bền trong localStorage (`et_users`, `et_tx`, `et_cats`) thay vì mất khi tải lại trang; mỗi user chỉ thấy dữ liệu của mình.
- `REQUIRE_LOGIN = true`; tài khoản bị khóa/xóa/đổi quyền sẽ bị đăng xuất ở lần tải trang kế tiếp.
- Sửa lỗi `today()` lệch 1 ngày (UTC) khi nhập trước 7h sáng ở Việt Nam.
- Trang đăng nhập: "Quên mật khẩu?" và "Điều khoản" hiện thông báo thay vì liên kết chết.
- `database/migration_admin_features.sql`: đồng bộ CSDL (cột username, danh mục mặc định) khi nối Backend. Chưa chạy thử.
- Tài khoản admin mặc định: admin@admin.com / Admin@123 (đổi sau khi đăng nhập).
