import { useFavoritesStore } from "./favoritesStore";

export function Favorites() {
  const items = useFavoritesStore((state) => state.items);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites);

  if (items.length === 0) {
    return <p>Chưa có sản phẩm yêu thích.</p>;
  }

  return (
    <div className="favorites">
      <ul className="product-list">
        {items.map((product) => (
          <li key={product.id} className="product-item">
            <span>{product.name}</span>
            <span>{product.price.toLocaleString("vi-VN")} đ</span>
            <button type="button" onClick={() => removeFavorite(product.id)}>
              Bỏ khỏi yêu thích
            </button>
          </li>
        ))}
      </ul>

      <p>Tổng: {items.length} sản phẩm yêu thích</p>

      <button type="button" onClick={clearFavorites}>
        Xoá toàn bộ yêu thích
      </button>
    </div>
  );
}
