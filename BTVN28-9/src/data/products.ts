import type { Product } from "../types/Product";

const categories = ["Điện tử", "Gia dụng", "Thời trang", "Sách"];

export const products: Product[] = Array.from({ length: 10_000 }, (_, index) => {
  const number = index + 1;
  return {
    id: `SP-${String(number).padStart(5, "0")}`,
    name: `Sản phẩm ${number}`,
    price: ((number % 100) + 1) * 25_000,
    category: categories[index % categories.length],
  };
});
