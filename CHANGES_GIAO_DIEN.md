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

## 7. Ngân sách
- Ngân sách cá nhân theo danh mục chi và ngân sách chung theo tháng cho gia đình; chủ gia đình/người quản lý có thể đặt thêm hạn mức theo danh mục, riêng từng tháng.
- Tính số đã sử dụng trực tiếp từ các giao dịch chi thuộc đúng người dùng/gia đình, tháng và danh mục; lưu, sửa hoặc xóa giao dịch làm cập nhật hạn mức ngay, không cần nhập lại số đã chi.
- Hiển thị cảnh báo khi đạt 80%, dùng hết đúng 100% hoặc vượt quá hạn mức; các hạn mức gia đình được chia sẻ cho thành viên ACTIVE.
- Hạn mức cá nhân và theo danh mục gia đình lưu trong `localStorage` (`et_budgets`); ngân sách chung theo tháng lưu cùng dữ liệu gia đình (`et_families`). Dữ liệu vẫn nằm trên trình duyệt hiện tại.

## 8. Mục tiêu tiết kiệm
- Tạo mục tiêu với tên, số tiền cần đạt, thời hạn và ghi chú; thanh tiến độ phản ánh số dư tiết kiệm hiện tại.
- Đóng góp và rút tiền ghi thành giao dịch chuyển khoản giữa ví cá nhân và ví nội bộ của mục tiêu; số dư hai ví được cập nhật từ lịch sử giao dịch, còn tổng thu/chi và ngân sách không tính khoản chuyển này là chi phí thực tế.
- Có thể xem các lần đóng góp/rút gần đây. Không cho xóa mục tiêu đã có giao dịch để giữ nguyên lịch sử và số dư ví.
- Mục tiêu, ví nội bộ và giao dịch lưu trong `localStorage` trên trình duyệt hiện tại.

## 9. Thông báo
- Hộp thư thông báo lưu bền trong `localStorage` (`et_notifications`), tách theo tài khoản đăng nhập, kèm thời gian và trạng thái đã đọc/chưa đọc; có thể đánh dấu từng thông báo hoặc đánh dấu tất cả là đã đọc.
- Ghi nhận cảnh báo khi ngân sách đạt 80%, 100% hoặc vượt mức; giao dịch định kỳ được tạo; lời mời gia đình được gửi, nhận, chấp nhận hoặc từ chối; hoạt động đóng góp/sử dụng quỹ chung; và các thay đổi quan trọng của tài khoản.
- Hiển thị số thông báo chưa đọc trên điều hướng và đồng bộ trạng thái giữa các tab trình duyệt. Dữ liệu không đồng bộ sang thiết bị khác khi chưa có backend.

- Trang đăng nhập: "Quên mật khẩu?" và "Điều khoản" hiện thông báo thay vì liên kết chết.
- `database/migration_admin_features.sql`: đồng bộ CSDL (cột username, danh mục mặc định) khi nối Backend. Chưa chạy thử.
- Tài khoản admin mặc định: admin@admin.com / Admin@123 (đổi sau khi đăng nhập).

## Gia đình

| Tính năng | Nội dung cập nhật |
| --- | --- |
| Thành viên & phân quyền | Vai trò Chủ gia đình/Người quản lý/Thành viên; chỉ chủ gia đình phân vai trò, người quản lý có thể mời/duyệt thành viên, quản lý ngân sách và giao dịch dùng chung. |
| Lời mời | Người được mời thấy lời mời theo email tài khoản và có thể chấp nhận/từ chối; chủ gia đình/người quản lý có thể mời, hủy lời mời. |
| Thống kê | Thống kê thu/chi, danh mục và chi tiêu thành viên theo tháng hiện tại. |
| Xu hướng | Biểu đồ so sánh thu và chi trong 6 tháng gần nhất. |
| Bộ lọc | Lọc giao dịch gia đình theo thành viên, tháng, loại giao dịch và từ khóa; có nút xóa lọc. |
| Giao dịch | Chỉ giao dịch `scope: family` của đúng gia đình được hiển thị; có nhãn Dùng chung, thao tác xem/sửa/xóa theo quyền và xuất CSV. Giao dịch cá nhân không được đưa vào màn hình hoặc thống kê gia đình. |
| Quỹ chung | Sổ biến động riêng lưu khoản đóng góp, khoản sử dụng, số dư và lịch sử; thành viên có thể đóng góp, chủ gia đình/người quản lý được ghi nhận sử dụng quỹ. |
| Ngân sách | Theo dõi chi tiêu theo danh mục trong tháng hiện tại; chủ gia đình/người quản lý được điều chỉnh ngân sách. |
| Riêng tư | Chỉ thành viên ACTIVE mới xem được giao dịch dùng chung của gia đình; thành viên chỉ sửa/xóa giao dịch do mình tạo, người quản lý có thể quản lý giao dịch dùng chung. |
| Không gian | Có thể chuyển giữa các gia đình mà tài khoản đang tham gia. Lời mời và sổ quỹ được lưu riêng trong localStorage của trình duyệt; để đồng bộ liên thiết bị cần backend. |
| Biểu mẫu | Kiểm tra thành viên còn hoạt động, loại giao dịch, danh mục và ví; giao dịch gắn với tài khoản của người đang nhập. |

## Giao dịch – Thu nhập và chi tiêu
- Bổ sung lọc tức thì theo từ khóa, ngày, loại giao dịch, danh mục, ví/tài khoản, khoảng tiền và thành viên gia đình; CSV giữ được tiếng Việt và mở được bằng Excel.
- Thêm chuyển tiền giữa hai ví cá nhân. Khoản chuyển chỉ cập nhật số dư ví nguồn/đích, không cộng vào tổng thu hoặc chi.
- Hỗ trợ giao dịch lặp hàng tháng; các kỳ đến hạn được tự tạo một lần khi mở ứng dụng.
- Hỗ trợ đính kèm ảnh/PDF (tối đa 1 MB mỗi tệp) và xem lại chứng từ trong chi tiết giao dịch.
- Xóa một hoặc nhiều giao dịch có thể hoàn tác trong 8 giây; biểu mẫu kiểm tra số tiền và báo kết quả bằng toast.

## Ví / Tài khoản tiền
- Hiển thị số dư đầu kỳ và số dư hiện tại theo công thức thống nhất: số dư đầu kỳ + giao dịch thu/chi + chuyển khoản + các bút toán đối soát.
- Cho phép tạo ví cá nhân và ví quỹ chung theo gia đình; giao dịch chung chỉ được gắn vào ví thuộc đúng gia đình và chỉ thành viên đang hoạt động mới sử dụng được.
- Chuyển khoản nội bộ được hỗ trợ giữa các ví trong cùng phạm vi (cá nhân hoặc một gia đình), không tính thành thu nhập/chi tiêu; số dư được tính lại từ lịch sử giao dịch nên sửa/xóa giao dịch không làm lệch số dư.
- Có lịch sử số dư theo giao dịch, ẩn/hiện lại ví mà không xóa dữ liệu, tổng số dư ví đang sử dụng và đối soát bằng bút toán chênh lệch có ghi chú.
- Đối soát ví gia đình chỉ dành cho chủ gia đình/người quản lý. Dữ liệu ví và điều chỉnh vẫn dùng localStorage trên trình duyệt hiện tại.

## Danh mục
- Tạo, chỉnh sửa và ẩn/hiện danh mục cá nhân hoặc danh mục gia đình; danh mục ẩn vẫn giữ nguyên giao dịch và lịch sử.
- Phân loại rõ Thu/Chi, tùy chọn biểu tượng và màu sắc, hỗ trợ cấu trúc danh mục cha/con một cấp.
- Chỉ chủ gia đình/người quản lý được tạo hoặc chỉnh sửa danh mục gia đình; thành viên đang hoạt động được xem và sử dụng danh mục thuộc gia đình mình.
- Giao dịch mới chỉ chọn được danh mục đang hiển thị, đúng phạm vi và loại; giao dịch cũ vẫn giữ được danh mục đã ẩn để bảo toàn lịch sử.
- Mỗi giao dịch tham chiếu một `catId`; báo cáo thống kê theo danh mục thực tế của giao dịch, không cộng trùng thêm vào danh mục cha.
- Không xóa danh mục đang được giao dịch hoặc danh mục con sử dụng; có thể ẩn thay thế để bảo toàn dữ liệu. Không cho đổi loại khi danh mục đã có giao dịch hoặc danh mục con.
- Dữ liệu danh mục và cấu trúc cha/con được lưu trong `localStorage` (`et_cats`) trên trình duyệt hiện tại.

## Báo cáo – Thống kê tài chính
- Chọn kỳ ngày, tuần, tháng, quý, năm, toàn bộ thời gian hoặc khoảng tùy chọn; có nút chọn nhanh các kỳ phổ biến.
- Báo cáo cá nhân và gia đình được tách phạm vi; lọc thêm thành viên, ví/tài khoản, danh mục và loại giao dịch. Người dùng chỉ truy vấn gia đình mà mình đang là thành viên ACTIVE.
- Tổng hợp thu, chi, dòng tiền ròng, biến động số dư (gồm bút toán đối soát và chuyển ví khi lọc một ví), so sánh với kỳ liền trước và xu hướng theo ngày hoặc tháng phù hợp với khoảng báo cáo.
- Hiển thị top 5 danh mục chi tiêu và bảng so sánh ngân sách với thực tế; ngân sách gia đình dùng hạn mức tháng của gia đình, ngân sách cá nhân dùng hạn mức theo danh mục.
- Xuất CSV UTF-8 cho Excel hoặc Excel Spreadsheet XML (`.xls`); in báo cáo hoặc lưu thành PDF bằng chức năng in của trình duyệt.
- Báo cáo ghi thời điểm tạo/cập nhật, được làm mới khi dữ liệu thay đổi ở tab khác; nguồn lưu trữ vẫn là localStorage trên trình duyệt.
