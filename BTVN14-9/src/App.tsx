import { Cart } from "./features/cart/Cart";
import { ProductList } from "./features/products/ProductList";
import { ProductListRTKQuery } from "./features/products/ProductListRTKQuery";
import "./App.css";

export default function App() {
  return (
    <main className="app">
      <h1>Bài tập về nhà — Buổi 14-9</h1>

      <section>
        <h2>Redux Toolkit: Module giỏ hàng</h2>

        <h3>Sản phẩm (productsSlice + createAsyncThunk)</h3>
        <ProductList />

        <h3>Sản phẩm (bonus: RTK Query)</h3>
        <ProductListRTKQuery />

        <h3>Giỏ hàng (cartSlice)</h3>
        <Cart />
      </section>
    </main>
  );
}
