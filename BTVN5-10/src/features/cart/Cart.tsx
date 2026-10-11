import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  clearCart,
  removeFromCart,
  selectCartItems,
  selectCartTotalPrice,
  updateQuantity,
} from "./cartSlice";

export function Cart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const totalPrice = useAppSelector(selectCartTotalPrice);

  if (items.length === 0) {
    return <p>Giỏ hàng trống.</p>;
  }

  return (
    <div className="cart">
      <ul className="cart-list">
        {items.map(({ product, quantity }) => (
          <li key={product.id} className="cart-item">
            <span>{product.name}</span>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) =>
                dispatch(
                  updateQuantity({
                    productId: product.id,
                    quantity: Number(e.target.value),
                  })
                )
              }
            />
            <span>
              {(product.price * quantity).toLocaleString("vi-VN")} đ
            </span>
            <button
              type="button"
              onClick={() => dispatch(removeFromCart(product.id))}
            >
              Xoá
            </button>
          </li>
        ))}
      </ul>

      <p className="cart-total">Tổng: {totalPrice.toLocaleString("vi-VN")} đ</p>

      <button type="button" onClick={() => dispatch(clearCart())}>
        Xoá toàn bộ giỏ hàng
      </button>
    </div>
  );
}
