import { TableColumn } from "react-data-table-component";
import { createColumn, createActionColumn } from "../../utils/tableUtils";

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
