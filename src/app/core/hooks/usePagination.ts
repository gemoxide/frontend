import { useState, useCallback } from "react";

interface UsePaginationProps {
  initialPage?: number;
  initialPerPage?: number;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
}

export const usePagination = ({
  initialPage = 1,
  initialPerPage = 10,
  onPageChange,
  onPerPageChange,
}: UsePaginationProps = {}) => {
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      onPageChange?.(newPage);
    },
    [onPageChange]
  );

  const handlePerRowsChange = useCallback(
    (newPerPage: number, newPage: number) => {
      setPerPage(newPerPage);
      setPage(newPage);
      onPerPageChange?.(newPerPage);
      // Store perPage in localStorage for persistence
      localStorage.setItem("perPage", newPerPage.toString());
    },
    [onPerPageChange]
  );

  const resetPagination = useCallback(() => {
    setPage(1);
    setPerPage(initialPerPage);
  }, [initialPerPage]);

  return {
    page,
    perPage,
    handlePageChange,
    handlePerRowsChange,
    resetPagination,
  };
};
