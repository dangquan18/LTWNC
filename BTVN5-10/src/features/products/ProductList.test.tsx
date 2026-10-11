import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { kettle, laptop } from "../../test/fixtures";
import { renderWithProviders } from "../../test/test-utils";
import { ProductList } from "./ProductList";
import { ProductListRTKQuery } from "./ProductListRTKQuery";
import { fetchProductsFromServer } from "./productsService";

vi.mock("./productsService", () => ({
  fetchProductsFromServer: vi.fn(),
}));

const mockedFetch = vi.mocked(fetchProductsFromServer);

beforeEach(() => {
  mockedFetch.mockReset();
});

describe("<ProductList /> (createAsyncThunk)", () => {
  it("hiển thị loading rồi danh sách sản phẩm", async () => {
    mockedFetch.mockResolvedValue([laptop, kettle]);
    renderWithProviders(<ProductList />);

    expect(screen.getByText("Đang tải sản phẩm...")).toBeInTheDocument();
    expect(await screen.findByText("Laptop")).toBeInTheDocument();
    expect(screen.getByText("Ấm siêu tốc")).toBeInTheDocument();
    expect(mockedFetch).toHaveBeenCalledTimes(1);
  });

  it("hiển thị thông báo lỗi khi API thất bại", async () => {
    mockedFetch.mockRejectedValue(new Error("Mất kết nối"));
    renderWithProviders(<ProductList />);

    expect(await screen.findByText("Lỗi: Mất kết nối")).toBeInTheDocument();
  });

  it("không gọi lại API khi sản phẩm đã có trong store", () => {
    renderWithProviders(<ProductList />, {
      preloadedState: {
        products: { items: [laptop], status: "succeeded", error: null },
      },
    });

    expect(screen.getByText("Laptop")).toBeInTheDocument();
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it("nhấn Thêm vào giỏ thì sản phẩm vào cartSlice", async () => {
    const user = userEvent.setup();
    mockedFetch.mockResolvedValue([laptop, kettle]);
    const { store } = renderWithProviders(<ProductList />);

    const [addLaptop] = await screen.findAllByRole("button", {
      name: "Thêm vào giỏ",
    });
    await user.click(addLaptop);
    await user.click(addLaptop);

    expect(store.getState().cart.items).toEqual([
      { product: laptop, quantity: 2 },
    ]);
  });
});

describe("<ProductListRTKQuery /> (RTK Query)", () => {
  it("hiển thị loading rồi danh sách sản phẩm", async () => {
    mockedFetch.mockResolvedValue([laptop]);
    renderWithProviders(<ProductListRTKQuery />);

    expect(
      screen.getByText("Đang tải sản phẩm (RTK Query)...")
    ).toBeInTheDocument();
    expect(await screen.findByText("Laptop")).toBeInTheDocument();
  });

  it("hiển thị thông báo lỗi khi API thất bại", async () => {
    mockedFetch.mockRejectedValue(new Error("Timeout"));
    renderWithProviders(<ProductListRTKQuery />);

    expect(await screen.findByText("Lỗi: Timeout")).toBeInTheDocument();
  });

  it("nhấn Thêm vào giỏ thì sản phẩm vào cartSlice", async () => {
    const user = userEvent.setup();
    mockedFetch.mockResolvedValue([kettle]);
    const { store } = renderWithProviders(<ProductListRTKQuery />);

    await user.click(
      await screen.findByRole("button", { name: "Thêm vào giỏ" })
    );

    expect(store.getState().cart.items).toEqual([
      { product: kettle, quantity: 1 },
    ]);
  });
});
