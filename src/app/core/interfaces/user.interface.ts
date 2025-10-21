// User interfaces based on the actual API response structure

export interface UserAttributes {
  name: string;
  email: string;
}

export interface RoleAttributes {
  name: string;
}

export interface PermissionAttributes {
  name: string;
}

export interface Role {
  type: string;
  id: number;
  attributes: RoleAttributes;
  relationships: {
    permissions: Permission[];
  };
}

export interface Permission {
  type: string;
  id: number;
  attributes: PermissionAttributes;
}

export interface UserRelationships {
  addresses: unknown[];
  roles: Role[];
  permissions: Permission[];
}

export interface User {
  type: string;
  id: number;
  attributes: UserAttributes;
  relationships: UserRelationships;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

// Type for the user object that comes from Redux state
export type UserFromState = User;
