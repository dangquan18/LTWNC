import { products } from "../../data/products";
import type { Product } from "../../types/Product";

/**
 * Giả lập một API endpoint thật: có độ trễ mạng và trả về Promise.
 * Dùng chung cho cả createAsyncThunk (productsSlice) và RTK Query (productsApi).
 */
export function fetchProductsFromServer(): Promise<Product[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(products), 500);
  });
}
