import { useMemo, useState } from "react";

interface UsePaginationResult<T> {
  currentPage: number;
  totalPages: number;
  currentData: T[];
  next: () => void;
  prev: () => void;
  goToPage: (page: number) => void;
}

/**
 * Custom hook phân trang generic, dùng chung cho mọi danh sách dữ liệu T[].
 * @param data toàn bộ dữ liệu cần phân trang
 * @param itemsPerPage số item hiển thị trên mỗi trang
 */
export function usePagination<T>(
  data: T[],
  itemsPerPage: number
): UsePaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  function goToPage(page: number) {
    const safePage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(safePage);
  }

  function next() {
    goToPage(currentPage + 1);
  }

  function prev() {
    goToPage(currentPage - 1);
  }

  return { currentPage, totalPages, currentData, next, prev, goToPage };
}
