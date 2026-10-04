import { memo, useCallback, useMemo, useState } from "react";
import { products } from "./data/products";
import type { Product } from "./types/Product";
import "./App.css";

const ROW_HEIGHT = 64;
const VIEWPORT_HEIGHT = 520;
const OVERSCAN = 5;

function ProductRow({
  product,
  selected,
  onToggle,
}: {
  product: Product;
  selected: boolean;
  onToggle: (product: Product) => void;
}) {
  return (
    <li className="product-row" style={{ height: ROW_HEIGHT }}>
      <div>
        <strong>{product.name}</strong>
        <span className="product-meta">
          {product.category} · Mã {product.id}
        </span>
      </div>
      <span className="price">{product.price.toLocaleString("vi-VN")} đ</span>
      <button
        className={selected ? "button button--selected" : "button"}
        type="button"
        onClick={() => onToggle(product)}
      >
        {selected ? "Đã chọn" : "Thêm vào giỏ"}
      </button>
    </li>
  );
}

const MemoProductRow = memo(ProductRow);

function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [scrollTop, setScrollTop] = useState(0);
  const [cart, setCart] = useState<Record<string, Product>>({});

  const categories = useMemo(
    () => ["Tất cả", ...new Set(products.map((product) => product.category))],
    [],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        category === "Tất cả" || product.category === category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.id.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const visibleRange = useMemo(() => {
    const first = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
    const last = Math.min(
      filteredProducts.length,
      Math.ceil((scrollTop + VIEWPORT_HEIGHT) / ROW_HEIGHT) + OVERSCAN,
    );
    return { first, last };
  }, [filteredProducts.length, scrollTop]);

  const visibleProducts = filteredProducts.slice(
    visibleRange.first,
    visibleRange.last,
  );
  const selectedIds = useMemo(() => new Set(Object.keys(cart)), [cart]);
  const totalPrice = useMemo(
    () =>
      Object.values(cart).reduce((total, product) => total + product.price, 0),
    [cart],
  );

  const toggleCart = useCallback((product: Product) => {
    setCart((currentCart) => {
      const nextCart = { ...currentCart };
      if (nextCart[product.id]) {
        delete nextCart[product.id];
      } else {
        nextCart[product.id] = product;
      }
      return nextCart;
    });
  }, []);

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) =>
      setScrollTop(event.currentTarget.scrollTop),
    [],
  );

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Bài tập về nhà · Buổi 6</p>
          <h1>Kho sản phẩm hiệu năng cao</h1>
          <p className="subtitle">
            Quản lý danh sách 10.000 sản phẩm mượt mà với React.
          </p>
        </div>
        <div className="cart-summary" aria-label="Tóm tắt giỏ hàng">
          <span className="cart-icon">🛒</span>
          <div>
            <strong>{Object.keys(cart).length} sản phẩm</strong>
            <span>{totalPrice.toLocaleString("vi-VN")} đ</span>
          </div>
        </div>
      </header>

      <section className="panel" aria-labelledby="catalog-title">
        <div className="panel-heading">
          <div>
            <h2 id="catalog-title">Danh sách sản phẩm</h2>
            <p className="muted">
              Hiển thị {filteredProducts.length.toLocaleString("vi-VN")} kết quả
              · chỉ render {visibleProducts.length} dòng đang nhìn thấy
            </p>
          </div>
          <label className="search">
            <span className="sr-only">Tìm sản phẩm</span>
            <input
              type="search"
              placeholder="Tìm theo tên hoặc mã..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>

        <div className="filters" role="group" aria-label="Lọc danh mục">
          {categories.map((item) => (
            <button
              className={item === category ? "filter active" : "filter"}
              key={item}
              type="button"
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div
          className="virtual-list"
          onScroll={handleScroll}
          role="region"
          aria-label="Danh sách sản phẩm"
        >
          {filteredProducts.length === 0 ? (
            <p className="empty">Không tìm thấy sản phẩm phù hợp.</p>
          ) : (
            <div
              className="product-list"
              style={{ height: filteredProducts.length * ROW_HEIGHT }}
            >
              <div
                className="product-window"
                style={{
                  transform: `translateY(${visibleRange.first * ROW_HEIGHT}px)`,
                }}
              >
                {visibleProducts.map((product) => (
                  <MemoProductRow
                    key={product.id}
                    product={product}
                    selected={selectedIds.has(product.id)}
                    onToggle={toggleCart}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="techniques">
        <span>✓ useMemo / useCallback</span>
        <span>✓ React.memo cho từng dòng</span>
        <span>✓ Virtualization + overscan</span>
      </footer>
    </main>
  );
}

export default App;
