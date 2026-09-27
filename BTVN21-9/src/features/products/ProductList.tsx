import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addToCart } from "../cart/cartSlice";
import { FavoriteButton } from "../favorites/FavoriteButton";
import {
  fetchProducts,
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from "./productsSlice";

export function ProductList() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const status = useAppSelector(selectProductsStatus);
  const error = useAppSelector(selectProductsError);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return <p>Đang tải sản phẩm...</p>;
  }

  if (status === "failed") {
    return <p className="error-text">Lỗi: {error}</p>;
  }

  return (
    <ul className="product-list">
      {products.map((product) => (
        <li key={product.id} className="product-item">
          <span>{product.name}</span>
          <span>{product.price.toLocaleString("vi-VN")} đ</span>
          <button type="button" onClick={() => dispatch(addToCart(product))}>
            Thêm vào giỏ
          </button>
          <FavoriteButton product={product} />
        </li>
      ))}
    </ul>
  );
}
