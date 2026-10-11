import { beforeEach, describe, expect, it, vi } from "vitest";
import { setupStore } from "../../app/store";
import { kettle, laptop } from "../../test/fixtures";
import productsReducer, {
  fetchProducts,
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from "./productsSlice";
import { fetchProductsFromServer } from "./productsService";

// Mock "API" để test không phụ thuộc độ trễ mạng.
vi.mock("./productsService", () => ({
  fetchProductsFromServer: vi.fn(),
}));

const mockedFetch = vi.mocked(fetchProductsFromServer);

describe("productsSlice reducer", () => {
  const initial = productsReducer(undefined, { type: "unknown" });

  it("state khởi tạo là idle", () => {
    expect(initial).toEqual({ items: [], status: "idle", error: null });
  });

  it("pending → loading và xoá lỗi cũ", () => {
    const state = productsReducer(
      { ...initial, status: "failed", error: "lỗi cũ" },
      { type: fetchProducts.pending.type }
    );
    expect(state.status).toBe("loading");
    expect(state.error).toBeNull();
  });

  it("fulfilled → succeeded và lưu danh sách", () => {
    const state = productsReducer(initial, {
      type: fetchProducts.fulfilled.type,
      payload: [laptop],
    });
    expect(state.status).toBe("succeeded");
    expect(state.items).toEqual([laptop]);
  });

  it("rejected → failed kèm thông báo lỗi", () => {
    const state = productsReducer(initial, {
      type: fetchProducts.rejected.type,
      error: { message: "Mất kết nối" },
    });
    expect(state.status).toBe("failed");
    expect(state.error).toBe("Mất kết nối");
  });

  it("rejected không có message → dùng thông báo mặc định", () => {
    const state = productsReducer(initial, {
      type: fetchProducts.rejected.type,
      error: {},
    });
    expect(state.error).toBe("Không thể tải sản phẩm");
  });
});

describe("fetchProducts thunk (chạy với store thật)", () => {
  beforeEach(() => {
    mockedFetch.mockReset();
  });

  it("lưu sản phẩm vào store khi API thành công", async () => {
    mockedFetch.mockResolvedValue([laptop, kettle]);
    const store = setupStore();

    await store.dispatch(fetchProducts());

    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(selectProductsStatus(store.getState())).toBe("succeeded");
    expect(selectProducts(store.getState())).toEqual([laptop, kettle]);
  });

  it("ghi nhận lỗi khi API thất bại", async () => {
    mockedFetch.mockRejectedValue(new Error("Server lỗi 500"));
    const store = setupStore();

    await store.dispatch(fetchProducts());

    expect(selectProductsStatus(store.getState())).toBe("failed");
    expect(selectProductsError(store.getState())).toBe("Server lỗi 500");
  });
});
