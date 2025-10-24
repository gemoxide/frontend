import DataTable from "react-data-table-component";
import type {
  TableProps,
  ExpanderComponentProps,
  TableColumn,
} from "react-data-table-component";
import { useMemo } from "react";
import type { FC } from "react";
import Skeleton from "react-loading-skeleton";

type DataRow = Record<string, unknown> & {
  relationships?: Record<string, unknown>;
};

type Props = TableProps<DataRow> & {
  loading?: boolean;
  isExpandable?: boolean;
  subColumns?: TableColumn<DataRow>[];
  defaultSortFieldId?: string;
  defaultSortAsc?: boolean;
};

const CustomDataTable: FC<Props> = ({
  defaultSortFieldId,
  defaultSortAsc,
  ...props
}) => {
  // Create loading skeleton for columns
  const columnsLoading = useMemo(
    () =>
      props.loading
        ? props.columns.map((column) => ({
            ...column,
            sortable: false,
            sortFunction: undefined,
            cell: () => <Skeleton width={100} />,
          }))
        : props.columns,
    [props.loading, props.columns]
  );

  // Create expandable component for nested data
  let ExpandedComponent: React.FC<ExpanderComponentProps<DataRow>> | undefined;

  if (props.isExpandable) {
    ExpandedComponent = ({ data }) => {
      const tasks = data?.relationships?.tasks || [];
      const dataArray = Array.isArray(tasks) ? tasks : [];

      if (props.subColumns && props.subColumns.length > 0) {
        return (
          <div className="px-10 py-5 border border-gray-300">
            <DataTable
              columns={props.subColumns}
              data={dataArray}
              customStyles={{
                headCells: {
                  style: {
                    fontWeight: "bold",
                    backgroundColor: "#99E6FF",
                  },
                },
              }}
              defaultSortFieldId={defaultSortFieldId}
              defaultSortAsc={defaultSortAsc}
            />
          </div>
        );
      } else {
        return <p>No columns available for DataTable</p>;
      }
    };
  }

  return (
    <DataTable
      customStyles={{
        headCells: {
          style: {
            fontWeight: "bold",
            backgroundColor: "#F4F9FF",
          },
        },
      }}
      {...props}
      columns={props.loading ? columnsLoading : props.columns}
      data={props.loading ? Array(8).fill({}) : props?.data || []}
      className="pb-20"
      paginationRowsPerPageOptions={[10, 20, 30]}
      responsive
      expandableRows={props.isExpandable}
      expandableRowsComponent={ExpandedComponent}
      defaultSortFieldId={defaultSortFieldId}
      defaultSortAsc={defaultSortAsc}
      paginationPerPage={
        parseInt(localStorage.getItem("perPage") ?? "10") ?? 10
      }
    />
  );
};

export default CustomDataTable;
