import type { Product } from "../../types/Product";
import { useFavoritesStore, useIsFavorite } from "./favoritesStore";

export function FavoriteButton({ product }: { product: Product }) {
  const isFavorite = useIsFavorite(product.id);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  return (
    <button
      type="button"
      className={isFavorite ? "favorite-btn active" : "favorite-btn"}
      aria-pressed={isFavorite}
      onClick={() => toggleFavorite(product)}
    >
      {isFavorite ? "♥ Bỏ thích" : "♡ Yêu thích"}
    </button>
  );
}
