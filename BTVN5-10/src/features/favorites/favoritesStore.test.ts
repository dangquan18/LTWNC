import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { kettle, laptop } from "../../test/fixtures";
import { useFavoritesStore, useIsFavorite } from "./favoritesStore";

const getState = () => useFavoritesStore.getState();

describe("favoritesStore (Zustand)", () => {
  it("bắt đầu với danh sách rỗng", () => {
    expect(getState().items).toEqual([]);
  });

  it("toggleFavorite thêm rồi bỏ sản phẩm", () => {
    getState().toggleFavorite(laptop);
    expect(getState().items).toEqual([laptop]);

    getState().toggleFavorite(laptop);
    expect(getState().items).toEqual([]);
  });

  it("removeFavorite chỉ xoá đúng sản phẩm", () => {
    getState().toggleFavorite(laptop);
    getState().toggleFavorite(kettle);

    getState().removeFavorite(laptop.id);

    expect(getState().items).toEqual([kettle]);
  });

  it("clearFavorites xoá toàn bộ", () => {
    getState().toggleFavorite(laptop);
    getState().toggleFavorite(kettle);

    getState().clearFavorites();

    expect(getState().items).toEqual([]);
  });

  it("persist lưu danh sách vào localStorage", () => {
    getState().toggleFavorite(laptop);

    const saved = JSON.parse(localStorage.getItem("favorites") ?? "{}");
    expect(saved.state.items).toEqual([laptop]);
  });
});

describe("useIsFavorite", () => {
  it("phản ánh trạng thái yêu thích của đúng sản phẩm", () => {
    const { result } = renderHook(() => useIsFavorite(laptop.id));
    expect(result.current).toBe(false);

    act(() => getState().toggleFavorite(laptop));
    expect(result.current).toBe(true);

    act(() => getState().toggleFavorite(kettle));
    expect(result.current).toBe(true);
  });
});
