import { describe, expect, it } from "vitest";
import { kettle, laptop } from "../../test/fixtures";
import type { RootState } from "../../app/store";
import cartReducer, {
  addToCart,
  clearCart,
  removeFromCart,
  selectCartItems,
  selectCartTotalPrice,
  selectCartTotalQuantity,
  updateQuantity,
} from "./cartSlice";
import type { CartItem } from "./cartSlice";

const stateWith = (items: CartItem[]) => ({ items });

describe("cartSlice reducer", () => {
  it("trả về state khởi tạo là giỏ hàng rỗng", () => {
    expect(cartReducer(undefined, { type: "unknown" })).toEqual({ items: [] });
  });

  it("addToCart thêm sản phẩm mới với số lượng 1", () => {
    const state = cartReducer(stateWith([]), addToCart(laptop));
    expect(state.items).toEqual([{ product: laptop, quantity: 1 }]);
  });

  it("addToCart tăng số lượng khi sản phẩm đã có trong giỏ", () => {
    const state = cartReducer(
      stateWith([{ product: laptop, quantity: 1 }]),
      addToCart(laptop)
    );
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
  });

  it("removeFromCart xoá đúng sản phẩm theo id", () => {
    const state = cartReducer(
      stateWith([
        { product: laptop, quantity: 1 },
        { product: kettle, quantity: 2 },
      ]),
      removeFromCart(laptop.id)
    );
    expect(state.items).toEqual([{ product: kettle, quantity: 2 }]);
  });

  it("updateQuantity cập nhật số lượng mới", () => {
    const state = cartReducer(
      stateWith([{ product: laptop, quantity: 1 }]),
      updateQuantity({ productId: laptop.id, quantity: 5 })
    );
    expect(state.items[0].quantity).toBe(5);
  });

  it.each([0, -3])(
    "updateQuantity với số lượng %i thì xoá sản phẩm khỏi giỏ",
    (quantity) => {
      const state = cartReducer(
        stateWith([{ product: laptop, quantity: 2 }]),
        updateQuantity({ productId: laptop.id, quantity })
      );
      expect(state.items).toEqual([]);
    }
  );

  it("updateQuantity bỏ qua sản phẩm không có trong giỏ", () => {
    const before = stateWith([{ product: laptop, quantity: 1 }]);
    const state = cartReducer(
      before,
      updateQuantity({ productId: "khong-ton-tai", quantity: 9 })
    );
    expect(state).toEqual(before);
  });

  it("clearCart làm rỗng giỏ hàng", () => {
    const state = cartReducer(
      stateWith([{ product: laptop, quantity: 3 }]),
      clearCart()
    );
    expect(state.items).toEqual([]);
  });

  it("không làm thay đổi state cũ (immutability)", () => {
    const before = stateWith([{ product: laptop, quantity: 1 }]);
    cartReducer(before, addToCart(laptop));
    expect(before.items[0].quantity).toBe(1);
  });
});

describe("cartSlice selectors", () => {
  const rootState = {
    cart: stateWith([
      { product: laptop, quantity: 2 },
      { product: kettle, quantity: 3 },
    ]),
  } as RootState;

  it("selectCartItems trả về danh sách sản phẩm", () => {
    expect(selectCartItems(rootState)).toHaveLength(2);
  });

  it("selectCartTotalQuantity tính tổng số lượng", () => {
    expect(selectCartTotalQuantity(rootState)).toBe(5);
  });

  it("selectCartTotalPrice tính tổng tiền", () => {
    // 2 * 15.000.000 + 3 * 300.000
    expect(selectCartTotalPrice(rootState)).toBe(30900000);
  });

  it("tổng bằng 0 khi giỏ rỗng", () => {
    const empty = { cart: stateWith([]) } as unknown as RootState;
    expect(selectCartTotalQuantity(empty)).toBe(0);
    expect(selectCartTotalPrice(empty)).toBe(0);
  });
});
