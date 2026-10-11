import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { kettle, laptop } from "../../test/fixtures";
import { FavoriteButton } from "./FavoriteButton";
import { Favorites } from "./Favorites";
import { useFavoritesStore } from "./favoritesStore";

describe("<FavoriteButton />", () => {
  it("bấm lần 1 thì thích, bấm lần 2 thì bỏ thích", async () => {
    const user = userEvent.setup();
    render(<FavoriteButton product={laptop} />);

    const button = screen.getByRole("button", { name: "♡ Yêu thích" });
    expect(button).toHaveAttribute("aria-pressed", "false");

    await user.click(button);
    expect(button).toHaveTextContent("♥ Bỏ thích");
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveClass("active");
    expect(useFavoritesStore.getState().items).toEqual([laptop]);

    await user.click(button);
    expect(button).toHaveTextContent("♡ Yêu thích");
    expect(useFavoritesStore.getState().items).toEqual([]);
  });
});

describe("<Favorites />", () => {
  it("hiển thị thông báo khi chưa có yêu thích", () => {
    render(<Favorites />);
    expect(screen.getByText("Chưa có sản phẩm yêu thích.")).toBeInTheDocument();
  });

  it("hiển thị danh sách và tổng số yêu thích", () => {
    useFavoritesStore.setState({ items: [laptop, kettle] });
    render(<Favorites />);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("15.000.000 đ")).toBeInTheDocument();
    expect(screen.getByText("Tổng: 2 sản phẩm yêu thích")).toBeInTheDocument();
  });

  it("bỏ một sản phẩm khỏi yêu thích", async () => {
    const user = userEvent.setup();
    useFavoritesStore.setState({ items: [laptop, kettle] });
    render(<Favorites />);

    const [removeLaptop] = screen.getAllByRole("button", {
      name: "Bỏ khỏi yêu thích",
    });
    await user.click(removeLaptop);

    expect(screen.queryByText("Laptop")).not.toBeInTheDocument();
    expect(screen.getByText("Tổng: 1 sản phẩm yêu thích")).toBeInTheDocument();
  });

  it("xoá toàn bộ yêu thích", async () => {
    const user = userEvent.setup();
    useFavoritesStore.setState({ items: [laptop, kettle] });
    render(<Favorites />);

    await user.click(
      screen.getByRole("button", { name: "Xoá toàn bộ yêu thích" })
    );

    expect(screen.getByText("Chưa có sản phẩm yêu thích.")).toBeInTheDocument();
  });
});
