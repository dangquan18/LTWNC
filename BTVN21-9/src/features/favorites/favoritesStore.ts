import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../../types/Product";

interface FavoritesState {
  items: Product[];
  toggleFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  clearFavorites: () => void;
}

// Store Zustand riêng cho "Sản phẩm yêu thích" — không cần Provider, không cần
// action/reducer/dispatch; persist giúp danh sách còn nguyên sau khi F5.
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      items: [],
      toggleFavorite: (product) =>
        set((state) =>
          state.items.some((item) => item.id === product.id)
            ? { items: state.items.filter((item) => item.id !== product.id) }
            : { items: [...state.items, product] }
        ),
      removeFavorite: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      clearFavorites: () => set({ items: [] }),
    }),
    { name: "favorites" }
  )
);

// Selector trả về boolean → component chỉ re-render khi trạng thái yêu thích
// của đúng sản phẩm đó thay đổi.
export const useIsFavorite = (productId: string) =>
  useFavoritesStore((state) =>
    state.items.some((item) => item.id === productId)
  );
