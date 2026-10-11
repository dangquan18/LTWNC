import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { products } from "../../data/products";
import { fetchProductsFromServer } from "./productsService";

describe("fetchProductsFromServer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("chỉ trả dữ liệu sau độ trễ 500ms", async () => {
    const onResolve = vi.fn();
    fetchProductsFromServer().then(onResolve);

    await vi.advanceTimersByTimeAsync(499);
    expect(onResolve).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    expect(onResolve).toHaveBeenCalledWith(products);
  });
});

describe("dữ liệu sản phẩm", () => {
  it("có 23 sản phẩm với id không trùng nhau", () => {
    expect(products).toHaveLength(23);
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
  });

  it("mọi sản phẩm có giá dương", () => {
    expect(products.every((p) => p.price > 0)).toBe(true);
  });
});
