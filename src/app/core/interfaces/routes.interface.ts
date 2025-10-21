export type RouteItem = {
  name?: string;
  id: string;
  path: string;
  component: React.ComponentType<Record<string, unknown>>;
  guard?: React.ComponentType<{
    children: React.ReactNode;
    roles?: (UserRoles | string)[];
    userTypes?: UserTypes[];
    permissions?: PermissionType[];
  }>;
  role?: string;
  index?: boolean;
  userTypes?: UserTypes[];
  roles?: (UserRoles | string)[];
  permissions?: PermissionType[];
  icon?: React.ComponentType;
  iconActive?: React.ComponentType;
  hidden?: boolean;
  current?: boolean;
  isSecondaryItem?: boolean;
  props?: Record<string, unknown>;
};

export const UserTypes = {
  admin: "admin",
  user: "user",
} as const;

export const UserRoles = {
  admin: "Admin",
  user: "User",
  staff: "Staff",
} as const;

export const PermissionType = {
  ORGANIZATION_UPDATE: "organization.update",
  MEMBER_VIEW: "member.view",
  MEMBER_CREATE: "member.create",
  MEMBER_UPDATE: "member.update",
  USER_VIEW: "user.view",
  USER_UPDATE: "user.update",
} as const;

export type UserTypes = (typeof UserTypes)[keyof typeof UserTypes];
export type UserRoles = (typeof UserRoles)[keyof typeof UserRoles];
export type PermissionType =
  (typeof PermissionType)[keyof typeof PermissionType];
