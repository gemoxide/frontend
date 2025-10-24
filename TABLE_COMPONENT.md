# Table Component with Pagination Setup Guide

This document provides comprehensive step-by-step instructions for setting up
and using the table component with pagination in the Coached Success App.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Install Dependencies](#step-1-install-dependencies)
4. [Step 2: Create the Custom DataTable Component](#step-2-create-the-custom-datatable-component)
5. [Step 3: Define Table Columns](#step-3-define-table-columns)
6. [Step 4: Implement Pagination Logic](#step-4-implement-pagination-logic)
7. [Step 5: Create Table Wrapper Component](#step-5-create-table-wrapper-component)
8. [Step 6: Implement Server-Side Operations](#step-6-implement-server-side-operations)
9. [Step 7: Add Loading States](#step-7-add-loading-states)
10. [Step 8: Implement Sorting](#step-8-implement-sorting)
11. [Step 9: Add Expandable Rows](#step-9-add-expandable-rows)
12. [Step 10: Styling and Customization](#step-10-styling-and-customization)
13. [Step 11: Testing](#step-11-testing)
14. [Troubleshooting](#troubleshooting)

## Overview

The table component system uses:

- **react-data-table-component**: For the base table functionality
- **Server-side pagination**: For handling large datasets
- **Custom styling**: For consistent design
- **Loading states**: For better user experience
- **Expandable rows**: For nested data display
- **Sorting**: For data organization

## Prerequisites

Before starting, ensure you have:

- React application set up
- TypeScript configured
- Redux state management in place
- API endpoints available
- Basic understanding of React hooks

## Step 1: Install Dependencies

```bash
# Install react-data-table-component
npm install react-data-table-component

# Install react-loading-skeleton for loading states
npm install react-loading-skeleton

# Install additional dependencies if not already present
npm install @types/react-data-table-component
```

## Step 2: Create the Custom DataTable Component

### 2.1 Create the Base DataTable Component

Create `/src/app/core/components/DataTable/index.tsx`:

```typescript
import DataTable, {
  TableProps,
  ExpanderComponentProps,
  TableColumn,
} from "react-data-table-component";
import { FC, useMemo } from "react";
import Skeleton from "react-loading-skeleton";

type Props = TableProps<any> & {
  loading?: boolean;
  isHideRowPerPage?: boolean;
  isExpandable?: boolean;
  subColumns?: TableColumn<any>[];
  defaultSortFieldId?: string;
  defaultSortAsc?: boolean;
};

type DataRow = {
  relationships: any;
};

const CustomDataTable: FC<Props> = ({
  isHideRowPerPage = false,
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
```

## Step 3: Define Table Columns

### 3.1 Create Column Definition Helper

Create `/src/app/core/utils/tableUtils.ts`:

```typescript
import { TableColumn } from "react-data-table-component";

export interface ColumnConfig {
  name: string;
  selector?: string;
  cell?: (row: any) => React.ReactNode;
  sortable?: boolean;
  sortField?: string;
  width?: string;
  center?: boolean;
  right?: boolean;
  fixed?: boolean;
}

export const createColumn = (config: ColumnConfig): TableColumn<any> => {
  return {
    name: config.name,
    selector: config.selector,
    cell: config.cell,
    sortable: config.sortable || false,
    sortField: config.sortField,
    width: config.width,
    center: config.center,
    right: config.right,
    fixed: config.fixed,
  };
};

export const createActionColumn = (
  actions: Array<{
    label: string;
    action: (row: any) => void;
    isDanger?: boolean;
  }>,
  width: string = "15%"
): TableColumn<any> => {
  return {
    name: "",
    width,
    sortable: false,
    cell: (row) => (
      <div className="w-full flex justify-end">
        <KebabDropdown
          placement="top"
          lists={actions.map((action) => ({
            label: action.label,
            action: () => action.action(row),
            isDanger: action.isDanger,
          }))}
        />
      </div>
    ),
  };
};
```

### 3.2 Create Sample Column Definitions

Create `/src/app/core/components/TableColumns/index.ts`:

```typescript
import { TableColumn } from "react-data-table-component";
import { createColumn, createActionColumn } from "../../utils/tableUtils";
import KebabDropdown from "../KebabDropdown";

// Sample interface for demonstration
interface IMember {
  id: string;
  attributes: {
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
    member_since: string;
    total_tasks: number;
    total_overdue_tasks: number;
    language: string;
  };
}

// Contact column with avatar and name
export const createContactColumn = (): TableColumn<IMember> => {
  return createColumn({
    name: "Contact",
    width: "25%",
    sortable: true,
    sortField: "name",
    cell: (member) => (
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
          {member?.attributes?.avatar ? (
            <img
              src={member.attributes.avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <span className="text-gray-600 font-medium">
              {member?.attributes?.first_name?.charAt(0)}
              {member?.attributes?.last_name?.charAt(0)}
            </span>
          )}
        </div>
        <div>
          <div className="font-medium">
            {`${member?.attributes?.first_name} ${member?.attributes?.last_name}`}
          </div>
          <div className="text-sm text-gray-500">
            {member?.attributes?.member_since}
          </div>
        </div>
      </div>
    ),
  });
};

// Tasks column with progress indicators
export const createTasksColumn = (): TableColumn<IMember> => {
  return createColumn({
    name: "Tasks",
    sortable: true,
    center: true,
    cell: (member) => (
      <div className="flex flex-col items-center">
        <div className="text-lg font-bold">
          {member?.attributes?.total_tasks || 0}
        </div>
        {member?.attributes?.total_overdue_tasks > 0 && (
          <div className="text-sm text-red-600">
            {member?.attributes?.total_overdue_tasks} overdue
          </div>
        )}
      </div>
    ),
  });
};

// Language column
export const createLanguageColumn = (): TableColumn<IMember> => {
  return createColumn({
    name: "Language",
    sortable: true,
    cell: (member) => member?.attributes?.language,
  });
};

// Action column with dropdown menu
export const createMemberActionColumn = (
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
  onManage: (id: string) => void,
  hasUpdatePermission: boolean = true,
  hasDeletePermission: boolean = true
): TableColumn<IMember> => {
  return createActionColumn(
    [
      {
        label: "Manage Member",
        action: (member) => onManage(member.id),
      },
      ...(hasUpdatePermission
        ? [
            {
              label: "Edit Member",
              action: (member) => onEdit(member.id),
            },
          ]
        : []),
      ...(hasDeletePermission
        ? [
            {
              label: "Delete",
              action: (member) => onDelete(member.id),
              isDanger: true,
            },
          ]
        : []),
    ],
    "15%"
  );
};
```

## Step 4: Implement Pagination Logic

### 4.1 Create Pagination Hook

Create `/src/app/core/hooks/usePagination.ts`:

```typescript
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
```

### 4.2 Create Sorting Hook

Create `/src/app/core/hooks/useSorting.ts`:

```typescript
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
    (column: any, sortDirection: string) => {
      const field = column.sortField || column.selector;
      setSortField(field);
      setSortDirection(sortDirection as "asc" | "desc");
      onSortChange?.(field, sortDirection as "asc" | "desc");
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
```

## Step 5: Create Table Wrapper Component

### 5.1 Create Generic Table Component

Create `/src/app/core/components/GenericTable/index.tsx`:

```typescript
import React from "react";
import { TableColumn } from "react-data-table-component";
import CustomDataTable from "../DataTable";
import { usePagination } from "../../hooks/usePagination";
import { useSorting } from "../../hooks/useSorting";

interface GenericTableProps<T> {
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
    isHideRowPerPage?: boolean;
    className?: string;
}

const GenericTable = <T>({
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
    isHideRowPerPage = false,
    className = "",
}: GenericTableProps<T>) => {
    const { page, perPage, handlePageChange, handlePerRowsChange } =
        usePagination({
            onPageChange,
            onPerPageChange,
        });

    const { handleSort } = useSorting({
        onSortChange: onSort,
    });

    return (
        <div className={className}>
            <CustomDataTable
                columns={columns}
                data={data}
                loading={loading}
                pagination
                paginationServer
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handlePerRowsChange}
                paginationTotalRows={totalRows}
                onSort={handleSort}
                isHideRowPerPage={isHideRowPerPage}
                sortServer
                isExpandable={isExpandable}
                subColumns={subColumns}
                defaultSortFieldId={defaultSortFieldId}
                defaultSortAsc={defaultSortAsc}
            />
        </div>
    );
};

export default GenericTable;
```

### 5.2 Create Members Table Component

Create
`/src/app/modules/organization/members/components/MembersTable/index.tsx`:

```typescript
import React, { useMemo } from "react";
import { TableColumn } from "react-data-table-component";
import GenericTable from "../../../../../core/components/GenericTable";
import {
  createContactColumn,
  createTasksColumn,
  createLanguageColumn,
  createMemberActionColumn,
} from "../../../../../core/components/TableColumns";
import { IMember } from "../../../../../core/interfaces/members.interface";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../core/state/reducer";
import { PermissionType } from "../../../../../core/interfaces/routes.interface";

interface MembersTableProps {
  members: IMember[];
  loading: boolean;
  total: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onManage: (id: string) => void;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  onSort?: (field: string, direction: "asc" | "desc") => void;
  isLead?: boolean;
}

const MembersTable: React.FC<MembersTableProps> = ({
  members,
  loading,
  total,
  onEdit,
  onDelete,
  onManage,
  onPageChange,
  onPerPageChange,
  onSort,
  isLead = false,
}) => {
  const { data: currentUser } = useSelector(
    (state: RootState) => state.auth.user
  );

  // Check permissions
  const hasUpdateMember = useMemo(() => {
    if (currentUser?.relationships?.roles?.length) {
      return currentUser?.relationships?.roles[0]?.relationships.permissions?.some(
        (permission) =>
          permission.attributes.name === PermissionType.MEMBER_UPDATE
      );
    }
    return false;
  }, [currentUser]);

  const hasDeleteMember = useMemo(() => {
    if (currentUser?.relationships?.roles?.length) {
      return currentUser?.relationships?.roles[0]?.relationships.permissions?.some(
        (permission) =>
          permission.attributes.name === PermissionType.MEMBER_DELETE
      );
    }
    return false;
  }, [currentUser]);

  // Define columns
  const columns: TableColumn<IMember>[] = useMemo(
    () => [
      createContactColumn(),
      createTasksColumn(),
      createLanguageColumn(),
      createMemberActionColumn(
        onEdit,
        onDelete,
        onManage,
        hasUpdateMember,
        hasDeleteMember
      ),
    ],
    [onEdit, onDelete, onManage, hasUpdateMember, hasDeleteMember]
  );

  return (
    <div className="mt-8">
      <GenericTable
        columns={columns}
        data={members}
        loading={loading}
        totalRows={total}
        onPageChange={onPageChange}
        onPerPageChange={onPerPageChange}
        onSort={onSort}
        isHideRowPerPage
      />
    </div>
  );
};

export default MembersTable;
```

## Step 6: Implement Server-Side Operations

### 6.1 Create Data Fetching Hook

Create `/src/app/core/hooks/useTableData.ts`:

```typescript
import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../state/reducer";

interface UseTableDataProps<T> {
  fetchAction: (params: any) => void;
  dataSelector: (state: RootState) => T[];
  loadingSelector: (state: RootState) => boolean;
  metaSelector: (state: RootState) => any;
  initialParams?: Record<string, any>;
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

  const handleSearch = useCallback((searchParams: Record<string, any>) => {
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
```

### 6.2 Create Members Page with Table

Create `/src/app/modules/organization/members/index.tsx`:

```typescript
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../core/constants/routes";
import { mapDispatchToProps } from "../../../core/state/reducer/members";
import { useTableData } from "../../../core/hooks/useTableData";
import { RootState } from "../../../core/state/reducer";
import MembersTable from "./components/MembersTable";
import Section from "../../../core/components/Section";
import Button from "../../../core/components/Button";
import { confirmDelete } from "../../../core/helpers/prompt";

const Members: React.FC = () => {
  const navigate = useNavigate();
  const { getMembers, deleteMember } = mapDispatchToProps();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: members,
    loading,
    total,
    handlePageChange,
    handlePerPageChange,
    handleSort,
    handleSearch,
    refresh,
  } = useTableData({
    fetchAction: getMembers,
    dataSelector: (state: RootState) => state.members.members.data || [],
    loadingSelector: (state: RootState) => state.members.members.loading,
    metaSelector: (state: RootState) => state.members.members.meta,
    initialParams: {
      search: searchTerm,
    },
  });

  const handleEdit = (id: string) => {
    // Navigate to edit page or open edit modal
    console.log("Edit member:", id);
  };

  const handleDelete = async (id: string) => {
    const { isConfirmed } = await confirmDelete("Member");
    if (isConfirmed) {
      deleteMember(id);
      refresh();
    }
  };

  const handleManage = (id: string) => {
    navigate(ROUTES.USER.member.parse(id));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch({ search: searchTerm });
  };

  return (
    <Section>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Members</h1>
        <Button
          label="Add Member"
          onClick={() => navigate(ROUTES.USER.members.key)}
        />
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" label="Search" />
        </div>
      </form>

      {/* Members Table */}
      <MembersTable
        members={members}
        loading={loading}
        total={total}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onManage={handleManage}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
        onSort={handleSort}
      />
    </Section>
  );
};

export default Members;
```

## Step 7: Add Loading States

### 7.1 Create Loading Skeleton Component

Create `/src/app/core/components/LoadingSkeleton/index.tsx`:

```typescript
import React from "react";
import Skeleton from "react-loading-skeleton";

interface LoadingSkeletonProps {
  count?: number;
  height?: number;
  width?: number;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 1,
  height = 20,
  width,
  className = "",
}) => {
  return (
    <Skeleton
      count={count}
      height={height}
      width={width}
      className={className}
    />
  );
};

export default LoadingSkeleton;
```

### 7.2 Create Table Loading Component

Create `/src/app/core/components/TableLoading/index.tsx`:

```typescript
import React from "react";
import LoadingSkeleton from "../LoadingSkeleton";

interface TableLoadingProps {
  columns: number;
  rows?: number;
}

const TableLoading: React.FC<TableLoadingProps> = ({ columns, rows = 8 }) => {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, index) => (
          <LoadingSkeleton
            key={index}
            height={40}
            width={Math.random() * 100 + 100}
          />
        ))}
      </div>

      {/* Rows skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <LoadingSkeleton
              key={colIndex}
              height={20}
              width={Math.random() * 100 + 100}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableLoading;
```

## Step 8: Implement Sorting

### 8.1 Create Sort Utilities

Create `/src/app/core/utils/sortUtils.ts`:

```typescript
export const sortData = <T>(
  data: T[],
  field: string,
  direction: "asc" | "desc"
): T[] => {
  return [...data].sort((a, b) => {
    const aValue = getNestedValue(a, field);
    const bValue = getNestedValue(b, field);

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });
};

const getNestedValue = (obj: any, path: string): any => {
  return path.split(".").reduce((current, key) => current?.[key], obj);
};

export const createSortFunction = <T>(
  field: string,
  direction: "asc" | "desc"
) => {
  return (a: T, b: T) => {
    const aValue = getNestedValue(a, field);
    const bValue = getNestedValue(b, field);

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  };
};
```

### 8.2 Update DataTable Component with Sorting

Update `/src/app/core/components/DataTable/index.tsx`:

```typescript
// Add to the existing component
const CustomDataTable: FC<Props> = ({
  isHideRowPerPage = false,
  defaultSortFieldId,
  defaultSortAsc,
  ...props
}) => {
  // ... existing code ...

  const handleSort = (column: any, sortDirection: string) => {
    if (props.onSort) {
      const field = column.sortField || column.selector;
      props.onSort(field, sortDirection);
    }
  };

  return (
    <DataTable
      // ... existing props ...
      onSort={handleSort}
      sortServer={props.sortServer}
      defaultSortFieldId={defaultSortFieldId}
      defaultSortAsc={defaultSortAsc}
    />
  );
};
```

## Step 9: Add Expandable Rows

### 9.1 Create Expandable Row Component

Create `/src/app/core/components/ExpandableRow/index.tsx`:

```typescript
import React from "react";
import { TableColumn } from "react-data-table-component";
import CustomDataTable from "../DataTable";

interface ExpandableRowProps<T> {
    data: T;
    subColumns: TableColumn<T>[];
    loading?: boolean;
}

const ExpandableRow = <T>({
    data,
    subColumns,
    loading = false,
}: ExpandableRowProps<T>) => {
    const subData = (data as any)?.relationships?.tasks || [];

    return (
        <div className="px-10 py-5 border border-gray-300 bg-gray-50">
            <h4 className="text-lg font-semibold mb-4">Related Tasks</h4>
            <CustomDataTable
                columns={subColumns}
                data={subData}
                loading={loading}
                customStyles={{
                    headCells: {
                        style: {
                            fontWeight: "bold",
                            backgroundColor: "#99E6FF",
                        },
                    },
                }}
            />
        </div>
    );
};

export default ExpandableRow;
```

### 9.2 Update Generic Table for Expandable Rows

Update `/src/app/core/components/GenericTable/index.tsx`:

```typescript
// Add expandable row support
const GenericTable = <T>({
    // ... existing props ...
    isExpandable = false,
    subColumns,
}: // ... rest of props
GenericTableProps<T>) => {
    // ... existing code ...

    return (
        <div className={className}>
            <CustomDataTable
                // ... existing props ...
                expandableRows={isExpandable}
                expandableRowsComponent={
                    isExpandable && subColumns
                        ? (props) => (
                              <ExpandableRow
                                  data={props.data}
                                  subColumns={subColumns}
                                  loading={loading}
                              />
                          )
                        : undefined
                }
            />
        </div>
    );
};
```

## Step 10: Styling and Customization

### 10.1 Create Custom Table Styles

Create `/src/app/core/components/DataTable/styles.ts`:

```typescript
export const customTableStyles = {
  headCells: {
    style: {
      fontWeight: "bold",
      backgroundColor: "#F4F9FF",
      fontSize: "14px",
      color: "#374151",
    },
  },
  cells: {
    style: {
      fontSize: "14px",
      color: "#374151",
    },
  },
  rows: {
    style: {
      "&:nth-of-type(odd)": {
        backgroundColor: "#F9FAFB",
      },
      "&:hover": {
        backgroundColor: "#F3F4F6",
      },
    },
  },
  pagination: {
    style: {
      backgroundColor: "#FFFFFF",
      borderTop: "1px solid #E5E7EB",
    },
  },
};

export const expandableTableStyles = {
  headCells: {
    style: {
      fontWeight: "bold",
      backgroundColor: "#99E6FF",
      fontSize: "12px",
    },
  },
  cells: {
    style: {
      fontSize: "12px",
    },
  },
};
```

### 10.2 Update DataTable with Custom Styles

Update `/src/app/core/components/DataTable/index.tsx`:

```typescript
import { customTableStyles, expandableTableStyles } from "./styles";

const CustomDataTable: FC<Props> = (
  {
    // ... existing props
  }
) => {
  // ... existing code ...

  return (
    <DataTable
      customStyles={customTableStyles}
      // ... other props
    />
  );
};
```

## Step 11: Testing

### 11.1 Create Table Test Utilities

Create `/src/app/core/components/DataTable/__tests__/testUtils.ts`:

```typescript
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "../../../state/store";

export const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

export const mockTableData = [
  {
    id: "1",
    attributes: {
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
    },
  },
  {
    id: "2",
    attributes: {
      first_name: "Jane",
      last_name: "Smith",
      email: "jane@example.com",
    },
  },
];

export const mockColumns = [
  {
    name: "Name",
    selector: (row: any) =>
      `${row.attributes.first_name} ${row.attributes.last_name}`,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row: any) => row.attributes.email,
    sortable: true,
  },
];
```

### 11.2 Create Table Component Tests

Create `/src/app/core/components/DataTable/__tests__/DataTable.test.tsx`:

```typescript
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CustomDataTable from "../index";
import { mockTableData, mockColumns } from "./testUtils";

describe("CustomDataTable", () => {
  it("renders table with data", () => {
    render(
      <CustomDataTable
        columns={mockColumns}
        data={mockTableData}
        loading={false}
      />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("shows loading skeleton when loading", () => {
    render(<CustomDataTable columns={mockColumns} data={[]} loading={true} />);

    // Check for loading skeleton elements
    expect(screen.getAllByRole("cell")).toHaveLength(16); // 2 columns * 8 skeleton rows
  });

  it("handles pagination", async () => {
    const handlePageChange = jest.fn();

    render(
      <CustomDataTable
        columns={mockColumns}
        data={mockTableData}
        pagination
        paginationServer
        paginationTotalRows={100}
        onChangePage={handlePageChange}
      />
    );

    // Find and click next page button
    const nextButton = screen.getByLabelText("Next page");
    fireEvent.click(nextButton);

    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it("handles sorting", async () => {
    const handleSort = jest.fn();

    render(
      <CustomDataTable
        columns={mockColumns}
        data={mockTableData}
        onSort={handleSort}
        sortServer
      />
    );

    // Click on sortable column header
    const nameHeader = screen.getByText("Name");
    fireEvent.click(nameHeader);

    expect(handleSort).toHaveBeenCalled();
  });
});
```

## Troubleshooting

### Common Issues

1. **Table not rendering**: Check if data and columns are properly passed
2. **Pagination not working**: Ensure `paginationServer` is set to true
3. **Sorting not working**: Verify `sortServer` is enabled and `onSort` handler
   is provided
4. **Loading state not showing**: Check if `loading` prop is correctly passed
5. **Expandable rows not working**: Ensure `isExpandable` and `subColumns` are
   properly configured

### Debug Tips

1. **Console logs**: Add console.log statements to track data flow
2. **React DevTools**: Use React DevTools to inspect component props
3. **Network tab**: Check API calls for server-side operations
4. **Redux DevTools**: Inspect state changes for data fetching

### Performance Considerations

1. **Virtual scrolling**: For very large datasets, consider implementing virtual
   scrolling
2. **Memoization**: Use React.memo for table components to prevent unnecessary
   re-renders
3. **Lazy loading**: Implement lazy loading for expandable row content
4. **Debounced search**: Use debounced search to avoid excessive API calls

## Additional Notes

- The table component supports both client-side and server-side operations
- Pagination is optimized for large datasets with server-side processing
- Sorting and filtering are handled efficiently with Redux state management
- The component is fully customizable with custom styles and themes
- Expandable rows provide a way to display nested data
- Loading states improve user experience during data fetching

This setup provides a robust, scalable table component that can handle complex
data display requirements while maintaining excellent performance and user
experience.
