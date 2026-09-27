# BTVN 21-9 — Zustand: Sản phẩm yêu thích

Chạy: `npm install` rồi `npm run dev`.

- Store: [src/features/favorites/favoritesStore.ts](src/features/favorites/favoritesStore.ts) — Zustand store riêng (`useFavoritesStore`) với `toggleFavorite`, `removeFavorite`, `clearFavorites`, dùng middleware `persist` để lưu vào `localStorage`.
- Nút ♡/♥ trên mỗi sản phẩm: [src/features/favorites/FavoriteButton.tsx](src/features/favorites/FavoriteButton.tsx)
- Danh sách yêu thích: [src/features/favorites/Favorites.tsx](src/features/favorites/Favorites.tsx)

Giỏ hàng vẫn dùng Redux Toolkit (từ bài 14-9), nên hai cách chạy song song trong cùng một app.

## Nhận xét: Zustand so với Redux Toolkit

Em chọn Zustand vì tính năng yêu thích nhỏ và độc lập: cả store chỉ khoảng 30 dòng, không cần `Provider`, `createSlice`, `configureStore` hay `dispatch`, component gọi thẳng `toggleFavorite(product)`.
Selector của Zustand (`useIsFavorite`) chỉ làm component re-render khi giá trị được chọn thay đổi, nên hiệu năng tốt mà không cần `useMemo`/`React.memo`.
Lưu vào `localStorage` chỉ cần bọc `persist`, còn với RTK thì phải cài thêm redux-persist hoặc tự viết middleware.
Nhược điểm là Zustand thiếu các quy ước có sẵn của RTK: không có Immer mặc định (phải tự viết cập nhật bất biến), Redux DevTools chỉ dùng được khi tự thêm middleware `devtools`, và không có giải pháp gọi API/cache như RTK Query.
Vì Zustand rất tự do, khi dự án lớn và nhiều người cùng làm thì code dễ thiếu thống nhất, trong khi RTK bắt buộc một cấu trúc rõ ràng (slice, action, selector) nên dễ bảo trì và debug hơn.
Kết luận: Zustand hợp với state nhỏ, cục bộ như danh sách yêu thích; RTK hợp với state lớn, dùng chung và có nhiều logic nghiệp vụ như giỏ hàng.
