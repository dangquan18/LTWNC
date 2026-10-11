import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import { useFavoritesStore } from "../features/favorites/favoritesStore";

afterEach(() => {
  cleanup();
  // Zustand store là singleton → reset để các test không ảnh hưởng nhau.
  useFavoritesStore.setState({ items: [] });
  localStorage.clear();
});
