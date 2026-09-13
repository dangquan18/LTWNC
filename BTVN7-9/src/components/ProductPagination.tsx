import { usePagination } from "../hooks/usePagination";
import { Product } from "../types/Product";

interface ProductPaginationProps {
  products: Product[];
  itemsPerPage?: number;
}

// Phần hiển thị (UI) tách biệt hoàn toàn khỏi logic phân trang,
// toàn bộ logic nằm trong usePagination<Product>.
export function ProductPagination({
  products,
  itemsPerPage = 5,
}: ProductPaginationProps) {
  const { currentPage, totalPages, currentData, next, prev, goToPage } =
    usePagination<Product>(products, itemsPerPage);

  return (
    <div className="product-pagination">
      <ul className="product-list">
        {currentData.map((product) => (
          <li key={product.id} className="product-item">
            <span>{product.name}</span>
            <span>{product.category}</span>
            <span>{product.price.toLocaleString("vi-VN")} đ</span>
          </li>
        ))}
      </ul>

      <div className="pagination-controls">
        <button type="button" onClick={prev} disabled={currentPage === 1}>
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            type="button"
            className={page === currentPage ? "is-active" : ""}
            onClick={() => goToPage(page)}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={next}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      <p className="pagination-info">
        Trang {currentPage}/{totalPages} — {products.length} sản phẩm
      </p>
    </div>
  );
}
