import { useState, useCallback } from "react";

interface UseSortingProps {
  initialSortField?: string;
  initialSortDirection?: "asc" | "desc";
  onSortChange?: (field: string, direction: "asc" | "desc") => void;
}

export const useSorting = ({
  initialSortField,
  initialSortDirection = "asc",
  onSortChange,
}: UseSortingProps = {}) => {
  const [sortField, setSortField] = useState(initialSortField);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    initialSortDirection
  );

  const handleSort = useCallback(
    (
      column: { sortField?: string; selector?: string },
      sortDirection: string
    ) => {
      const field = column.sortField || column.selector;
      if (field) {
        setSortField(field);
        setSortDirection(sortDirection as "asc" | "desc");
        onSortChange?.(field, sortDirection as "asc" | "desc");
      }
    },
    [onSortChange]
  );

  const resetSorting = useCallback(() => {
    setSortField(initialSortField);
    setSortDirection(initialSortDirection);
  }, [initialSortField, initialSortDirection]);

  return {
    sortField,
    sortDirection,
    handleSort,
    resetSorting,
  };
};
