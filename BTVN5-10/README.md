# BTVN 5-10 — Kiểm thử ứng dụng React

Viết test cho ứng dụng giỏ hàng (Redux Toolkit) + sản phẩm yêu thích (Zustand)
từ các bài 14-9 / 21-9, dùng **Vitest + React Testing Library**.

## Chạy

```bash
npm install
npm run dev        # chạy app
npm test           # chạy test ở chế độ watch
npm run test:run   # chạy test 1 lần
npm run coverage   # chạy test + báo cáo coverage (HTML ở coverage/index.html)
```

## Công cụ

| Thư viện | Vai trò |
| --- | --- |
| `vitest` | Test runner, dùng chung config với Vite (`vite.config.ts` → `test`) |
| `jsdom` | Giả lập DOM của trình duyệt trong Node |
| `@testing-library/react` | Render component, truy vấn theo role/text như người dùng thấy |
| `@testing-library/user-event` | Giả lập thao tác click, gõ phím thật |
| `@testing-library/jest-dom` | Matcher như `toBeInTheDocument`, `toHaveAttribute` |
| `@vitest/coverage-v8` | Đo độ phủ code |

## Cấu trúc test

| File | Loại | Nội dung kiểm thử |
| --- | --- | --- |
| [cartSlice.test.ts](src/features/cart/cartSlice.test.ts) | Unit | Reducer thêm / xoá / sửa số lượng (cả số lượng ≤ 0, id không tồn tại), immutability, selector tổng số lượng và tổng tiền |
| [productsSlice.test.ts](src/features/products/productsSlice.test.ts) | Unit | Trạng thái `pending/fulfilled/rejected` của `createAsyncThunk`, chạy thunk với store thật và API được mock |
| [productsService.test.ts](src/features/products/productsService.test.ts) | Unit | Độ trễ 500ms của API giả lập (fake timers), tính hợp lệ của dữ liệu |
| [favoritesStore.test.ts](src/features/favorites/favoritesStore.test.ts) | Unit | Action của Zustand store, lưu `localStorage` qua `persist`, hook `useIsFavorite` |
| [Cart.test.tsx](src/features/cart/Cart.test.tsx) | Component | Giỏ trống, hiển thị thành tiền / tổng tiền, đổi số lượng, xoá 1 món, xoá toàn bộ |
| [Favorites.test.tsx](src/features/favorites/Favorites.test.tsx) | Component | Nút ♡/♥ (`aria-pressed`), danh sách yêu thích, bỏ thích, xoá toàn bộ |
| [ProductList.test.tsx](src/features/products/ProductList.test.tsx) | Component | Loading → dữ liệu, hiển thị lỗi, không gọi lại API khi đã có dữ liệu, thêm vào giỏ (cả bản thunk và RTK Query) |
| [App.test.tsx](src/App.test.tsx) | Integration | Luồng đầy đủ: tải sản phẩm → thêm vào giỏ → thả tim → kiểm tra tổng → xoá giỏ |

Hạ tầng test nằm trong [src/test/](src/test/):

- `setup.ts`: nạp matcher của jest-dom, sau mỗi test thì `cleanup`, reset Zustand
  store và `localStorage` để các test độc lập với nhau.
- `test-utils.tsx`: `renderWithProviders` bọc component trong Redux `Provider`
  với **store mới cho từng test**, có thể nạp sẵn state (`preloadedState`).
- `fixtures.ts`: dữ liệu sản phẩm mẫu.

Để làm được việc này, [store.ts](src/app/store.ts) được tách thành hàm
`setupStore(preloadedState)` thay vì chỉ có một store dùng chung.

## Kỹ thuật đã áp dụng

- **Mock API** bằng `vi.mock("./productsService")` → test chạy nhanh, không phụ
  thuộc độ trễ mạng, và chủ động tạo được trường hợp lỗi (`mockRejectedValue`).
- **Fake timers** (`vi.useFakeTimers`) để kiểm tra độ trễ 500ms mà không phải
  chờ thật.
- **Truy vấn theo cách người dùng thấy** (`getByRole`, `getByText`) thay vì class
  hoặc id, nên test không gãy khi đổi cấu trúc HTML.
- **`it.each`** cho các trường hợp biên (số lượng `0` và `-3`).
- **Test bất đồng bộ** với `findBy...` để chờ dữ liệu tải xong.

## Kết quả

```
 Test Files  8 passed (8)
      Tests  48 passed (48)

Statements   : 100% ( 126/126 )
Branches     : 100% ( 30/30 )
Functions    : 100% ( 63/63 )
Lines        : 100% ( 111/111 )
```

Kiểm tra test có thực sự bắt lỗi: cố ý sửa `addToCart` thành
`existing.quantity += 2` thì 2 test fail ngay (unit test của reducer và
component test của `ProductList`). Sau khi trả code về như cũ, toàn bộ test pass.
