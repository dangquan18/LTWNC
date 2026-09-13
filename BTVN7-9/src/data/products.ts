import { Product } from "../types/Product";

export const products: Product[] = Array.from({ length: 23 }, (_, i) => ({
  id: `p${i + 1}`,
  name: `Sản phẩm ${i + 1}`,
  price: (i + 1) * 10000,
  category: i % 2 === 0 ? "Điện tử" : "Gia dụng",
}));
