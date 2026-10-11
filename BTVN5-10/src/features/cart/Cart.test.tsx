import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { kettle, laptop } from "../../test/fixtures";
import { renderWithProviders } from "../../test/test-utils";
import { Cart } from "./Cart";

const cartWithTwoItems = {
  cart: {
    items: [
      { product: laptop, quantity: 1 },
      { product: kettle, quantity: 2 },
    ],
  },
};

describe("<Cart />", () => {
  it("hiển thị thông báo khi giỏ hàng trống", () => {
    renderWithProviders(<Cart />);
    expect(screen.getByText("Giỏ hàng trống.")).toBeInTheDocument();
  });

  it("hiển thị từng sản phẩm, thành tiền và tổng tiền", () => {
    renderWithProviders(<Cart />, { preloadedState: cartWithTwoItems });

    const rows = screen.getAllByRole("listitem");
    expect(rows).toHaveLength(2);
    expect(within(rows[0]).getByText("Laptop")).toBeInTheDocument();
    expect(within(rows[1]).getByText("600.000 đ")).toBeInTheDocument();
    expect(screen.getByText("Tổng: 15.600.000 đ")).toBeInTheDocument();
  });

  it("đổi số lượng thì cập nhật store và tổng tiền", () => {
    const { store } = renderWithProviders(<Cart />, {
      preloadedState: cartWithTwoItems,
    });

    const [laptopQty] = screen.getAllByRole("spinbutton");
    fireEvent.change(laptopQty, { target: { value: "3" } });

    expect(store.getState().cart.items[0].quantity).toBe(3);
    expect(screen.getByText("Tổng: 45.600.000 đ")).toBeInTheDocument();
  });

  it("nhấn Xoá thì bỏ đúng sản phẩm đó", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Cart />, { preloadedState: cartWithTwoItems });

    const laptopRow = screen.getByText("Laptop").closest("li")!;
    await user.click(within(laptopRow).getByRole("button", { name: "Xoá" }));

    expect(screen.queryByText("Laptop")).not.toBeInTheDocument();
    expect(screen.getByText("Ấm siêu tốc")).toBeInTheDocument();
  });

  it("nhấn Xoá toàn bộ thì giỏ hàng trống", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Cart />, { preloadedState: cartWithTwoItems });

    await user.click(
      screen.getByRole("button", { name: "Xoá toàn bộ giỏ hàng" })
    );

    expect(screen.getByText("Giỏ hàng trống.")).toBeInTheDocument();
  });
});
