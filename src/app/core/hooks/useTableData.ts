import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../state/store";

interface UseTableDataProps<T> {
  fetchAction: (params: Record<string, unknown>) => {
    type: string;
    payload: Record<string, unknown>;
  };
  dataSelector: (state: RootState) => T[];
  loadingSelector: (state: RootState) => boolean;
  metaSelector: (state: RootState) => Record<string, unknown>;
  initialParams?: Record<string, unknown>;
}

export const useTableData = <T>({
  fetchAction,
  dataSelector,
  loadingSelector,
  metaSelector,
  initialParams = {},
}: UseTableDataProps<T>) => {
  const dispatch = useDispatch();
  const [params, setParams] = useState(initialParams);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const data = useSelector(dataSelector);
  const loading = useSelector(loadingSelector);
  const meta = useSelector(metaSelector);

  const fetchData = useCallback(() => {
    const requestParams = {
      page,
      per_page: perPage,
      sort_field: sortField,
      sort_direction: sortDirection,
      ...params,
    };
    dispatch(fetchAction(requestParams));
  }, [dispatch, fetchAction, page, perPage, sortField, sortDirection, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePerPageChange = useCallback((newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1); // Reset to first page when changing per page
  }, []);

  const handleSort = useCallback((field: string, direction: "asc" | "desc") => {
    setSortField(field);
    setSortDirection(direction);
    setPage(1); // Reset to first page when sorting
  }, []);

  const handleSearch = useCallback((searchParams: Record<string, unknown>) => {
    setParams((prev) => ({ ...prev, ...searchParams }));
    setPage(1); // Reset to first page when searching
  }, []);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    meta,
    page,
    perPage,
    total: meta?.total || 0,
    handlePageChange,
    handlePerPageChange,
    handleSort,
    handleSearch,
    refresh,
  };
};
