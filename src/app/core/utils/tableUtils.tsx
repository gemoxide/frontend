import type { TableColumn } from "react-data-table-component";
import React from "react";

export interface ColumnConfig {
  name: string;
  selector?: string;
  cell?: (row: Record<string, unknown>) => React.ReactNode;
  sortable?: boolean;
  sortField?: string;
  width?: string;
  center?: boolean;
  right?: boolean;
  fixed?: boolean;
}

export const createColumn = (config: ColumnConfig): TableColumn<Record<string, unknown>> => {
  return {
    name: config.name,
    selector: config.selector as any,
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
    action: (row: Record<string, unknown>) => void;
    isDanger?: boolean;
  }>,
  width: string = "15%"
): TableColumn<Record<string, unknown>> => {
  return {
    name: "",
    width,
    sortable: false,
    cell: (row) => (
      <div className="w-full flex justify-end">
        <div className="dropdown">
          <button
            className="btn btn-sm btn-outline-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
          >
            Actions
          </button>
          <ul className="dropdown-menu">
            {actions.map((action, index) => (
              <li key={index}>
                <button
                  className={`dropdown-item ${
                    action.isDanger ? "text-danger" : ""
                  }`}
                  onClick={() => action.action(row)}
                >
                  {action.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  };
};
