import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import App from "./App";
import { fetchProductsFromServer } from "./features/products/productsService";
import { kettle, laptop } from "./test/fixtures";
import { renderWithProviders } from "./test/test-utils";

vi.mock("./features/products/productsService", () => ({
  fetchProductsFromServer: vi.fn(),
}));

// Integration test: chạy cả App với store thật, chỉ mock nguồn dữ liệu.
describe("<App /> — luồng mua hàng", () => {
  it("thêm vào giỏ, thả tim, rồi xoá giỏ hàng", async () => {
    vi.mocked(fetchProductsFromServer).mockResolvedValue([laptop, kettle]);
    const user = userEvent.setup();
    renderWithProviders(<App />);

    expect(screen.getByText("Giỏ hàng trống.")).toBeInTheDocument();
    expect(screen.getByText("Chưa có sản phẩm yêu thích.")).toBeInTheDocument();

    // Cả hai danh sách (thunk + RTK Query) cùng tải xong.
    await screen.findAllByText("Laptop");
    const [thunkList] = screen.getAllByRole("list");

    const laptopRow = within(thunkList).getByText("Laptop").closest("li")!;
    await user.click(
      within(laptopRow).getByRole("button", { name: "Thêm vào giỏ" })
    );
    await user.click(
      within(laptopRow).getByRole("button", { name: "♡ Yêu thích" })
    );

    expect(screen.getByText("Tổng: 15.000.000 đ")).toBeInTheDocument();
    expect(screen.getByText("Tổng: 1 sản phẩm yêu thích")).toBeInTheDocument();
    // Trạng thái yêu thích đồng bộ trên cả hai danh sách sản phẩm.
    expect(screen.getAllByRole("button", { name: "♥ Bỏ thích" })).toHaveLength(
      2
    );

    await user.click(
      screen.getByRole("button", { name: "Xoá toàn bộ giỏ hàng" })
    );
    expect(screen.getByText("Giỏ hàng trống.")).toBeInTheDocument();
  });
});
