import { useAppDispatch } from "../../app/hooks";
import { addToCart } from "../cart/cartSlice";
import { useGetProductsQuery } from "./productsApi";

// Bonus: cùng dữ liệu với ProductList, nhưng lấy qua RTK Query thay vì
// createAsyncThunk thủ công — loading/error/cache được RTK Query tự quản lý.
export function ProductListRTKQuery() {
  const dispatch = useAppDispatch();
  const { data: products, isLoading, isError, error } = useGetProductsQuery();

  if (isLoading) {
    return <p>Đang tải sản phẩm (RTK Query)...</p>;
  }

  if (isError) {
    return <p className="error-text">Lỗi: {String(error)}</p>;
  }

  return (
    <ul className="product-list">
      {products?.map((product) => (
        <li key={product.id} className="product-item">
          <span>{product.name}</span>
          <span>{product.price.toLocaleString("vi-VN")} đ</span>
          <button type="button" onClick={() => dispatch(addToCart(product))}>
            Thêm vào giỏ
          </button>
        </li>
      ))}
    </ul>
  );
}
