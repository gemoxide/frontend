import type { TableColumn } from "react-data-table-component";
import CustomDataTable from "../DataTable";
import { usePagination } from "../../hooks/usePagination";
import { useSorting } from "../../hooks/useSorting";

type DataRow = Record<string, unknown> & {
  relationships?: Record<string, unknown>;
};

interface GenericTableProps<T extends DataRow> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  onSort?: (field: string, direction: "asc" | "desc") => void;
  isExpandable?: boolean;
  subColumns?: TableColumn<T>[];
  defaultSortFieldId?: string;
  defaultSortAsc?: boolean;
  className?: string;
}

const GenericTable = <T extends DataRow>({
  columns,
  data,
  loading = false,
  totalRows = 0,
  onPageChange,
  onPerPageChange,
  onSort,
  isExpandable = false,
  subColumns,
  defaultSortFieldId,
  defaultSortAsc = true,
  className = "",
}: GenericTableProps<T>) => {
  const { handlePageChange, handlePerRowsChange } = usePagination({
    onPageChange,
    onPerPageChange,
  });

  const { handleSort } = useSorting({
    onSortChange: onSort,
  });

  const handleSortWrapper = (
    selectedColumn: TableColumn<T>,
    sortDirection: string
  ) => {
    const columnForSort = {
      sortField: selectedColumn.sortField,
      selector:
        typeof selectedColumn.selector === "string"
          ? selectedColumn.selector
          : undefined,
    };
    handleSort(columnForSort, sortDirection);
  };

  return (
    <div className={className}>
      <CustomDataTable
        columns={columns as TableColumn<DataRow>[]}
        data={data as DataRow[]}
        loading={loading}
        pagination
        paginationServer
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
        paginationTotalRows={totalRows}
        onSort={
          handleSortWrapper as (
            selectedColumn: TableColumn<DataRow>,
            sortDirection: string
          ) => void
        }
        sortServer
        isExpandable={isExpandable}
        subColumns={subColumns as TableColumn<DataRow>[]}
        defaultSortFieldId={defaultSortFieldId}
        defaultSortAsc={defaultSortAsc}
      />
    </div>
  );
};

export default GenericTable;
