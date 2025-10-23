import type { PayloadAction } from "@reduxjs/toolkit";
import type { LoadingResult } from "./common";

// Auth State Interface
export interface AuthState {
  login: LoginRequest;
  user: User;
  logout: Logout;
}

// Login Types
export type LoginRequest = LoadingResult & {
  data?: IOauth;
};

export type LoginRequestActionPayload = PayloadAction<LoginPayload>;

export type LoginPayload = {
  email: string;
  password: string;
};

// User Types
export type User = LoadingResult & {
  data?: IUser;
};

// Logout Types
export type Logout = LoadingResult & {
  data?: boolean;
};

/** Transfer this to interfaces folder instead */

// Interface Definitions
export interface IOauth {
  access_token: string;
  expires_in: number;
  token_type: string;
  user?: IUser;
}

export interface IUser {
  type: string;
  id: number;
  attributes: {
    name: string;
    email: string;
  };
  relationships: {
    addresses: unknown[];
    roles: Array<{
      type: string;
      id: number;
      attributes: {
        name: string;
      };
      relationships: {
        permissions: unknown[];
      };
    }>;
    permissions: Array<{
      type: string;
      id: number;
      attributes: {
        name: string;
      };
    }>;
  };
}
