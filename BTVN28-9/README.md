# Bài tập tối ưu React - 28-9

## Nội dung

Trang quản lý 10.000 sản phẩm có tìm kiếm, lọc theo danh mục và giỏ hàng.

## Các kỹ thuật đã áp dụng

1. **Virtualization thủ công**: danh sách có chiều cao tổng 10.000 dòng nhưng chỉ
   render vùng đang nhìn thấy cộng thêm 5 dòng `overscan` (khoảng 14 dòng ở
   viewport mặc định). Vì vậy số DOM node không tăng theo số sản phẩm.
2. **Memoization**: `useMemo` cho dữ liệu danh mục, kết quả lọc, vùng hiển thị
   và tổng tiền; `useCallback` giữ ổn định callback; `React.memo` ngăn các dòng
   không thay đổi render lại.
3. **Tối ưu trải nghiệm**: tìm kiếm theo tên/mã, lọc danh mục, trạng thái rỗng,
   responsive layout và focus-visible cho thao tác bàn phím.

## Chạy project

```bash
npm install
npm run dev
```

Kiểm tra production:

```bash
npm run build
npm run preview
```

## Đo Lighthouse

Mở URL preview bằng Chrome DevTools > Lighthouse, chọn **Performance** và
profile **Mobile**, sau đó ghi lại các chỉ số FCP, LCP, TBT, CLS và Performance
score. Đo cùng một máy, cùng viewport và cùng điều kiện mạng cho hai phiên bản.

Khi so sánh, cần kiểm tra thêm bằng DevTools Elements: phiên bản tối ưu chỉ có
vài dòng sản phẩm trong DOM dù tổng số kết quả là 10.000. Đây là chỉ số trực
tiếp để xác nhận virtualization đang hoạt động.

### Kết quả đo bản tối ưu

Đã chạy Lighthouse trên bản preview production tại `http://127.0.0.1:4173`
(Mobile, cùng môi trường local):

| Metric | Kết quả |
| --- | ---: |
| Performance score | 100 |
| FCP | 1.3 s |
| LCP | 1.4 s |
| TBT | 40 ms |
| CLS | 0 |

`BTVN28-9` ban đầu là folder trống nên không có bản baseline để đo trước khi
tối ưu; bản report JSON sau tối ưu được lưu tại `lighthouse-after.json`.
