# State Management Setup Guide

This document provides comprehensive step-by-step instructions for setting up
the Redux state management system with Redux Toolkit, Redux Saga, and TypeScript
in the Coached Success App.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Install Dependencies](#step-1-install-dependencies)
4. [Step 2: Create Type Definitions](#step-2-create-type-definitions)
5. [Step 3: Create Reducers](#step-3-create-reducers)
6. [Step 4: Create Sagas](#step-4-create-sagas)
7. [Step 5: Create Services](#step-5-create-services)
8. [Step 6: Configure Store](#step-6-configure-store)
9. [Step 7: Set Up Persistence](#step-7-set-up-persistence)
10. [Step 8: Integration](#step-8-integration)
11. [Step 9: Testing](#step-9-testing)
12. [Troubleshooting](#troubleshooting)

## Overview

The state management system uses:

- **Redux Toolkit**: For simplified Redux setup and reducers
- **Redux Saga**: For handling side effects and async operations
- **Redux Persist**: For state persistence across browser sessions
- **TypeScript**: For type safety and better development experience

## Prerequisites

Before starting, ensure you have:

- React application set up
- TypeScript configured
- Basic understanding of Redux concepts
- API endpoints available

## Step 1: Install Dependencies

```bash
# Install Redux Toolkit and React Redux
npm install @reduxjs/toolkit react-redux

# Install Redux Saga for side effects
npm install redux-saga

# Install Redux Persist for state persistence
npm install redux-persist

# Install Redux Logger for development
npm install redux-logger

# Install Axios for API calls
npm install axios

# Install TypeScript types
npm install @types/redux-saga
```

## Step 2: Create Type Definitions

### 2.1 Create Common Types

Create `/src/app/core/state/types/common.ts`:

```typescript
export interface LoadingResult {
  success: boolean;
  loading: boolean;
  error: boolean;
}

export interface IMeta {
  current_page: number;
  pages_total: number;
  per_page: number;
  results_total: number;
}

export type Tab = {
  tabElement?: React.ReactNode;
  name: string;
  component?: JSX.Element;
};
```

### 2.2 Create Auth Types

Create `/src/app/core/state/types/auth.ts`:

```typescript
import { PayloadAction } from "@reduxjs/toolkit";
import { LoadingResult } from "./common";

// Auth State Interface
export interface AuthState {
  login: LoginRequest;
  user: User;
  updateUser: User;
  updateUserAvatar: UpdateUserAvatar;
  updateUserPassword: UpdateUserPassword;
  registerUser: RegisterUser;
  impersonateUser: ImpersonateUser;
  updateDashboardReports: DashboardReports;
  addFavoriteReport: FavoriteReports;
  removeFavoriteReport: FavoriteReports;
}

// Login Types
export type LoginRequest = LoadingResult & {
  data?: IOauth;
};

export type LoginRequestActionPayload = PayloadAction<LoginPayload>;

export type LoginPayload = {
  username: string;
  password: string;
};

// User Types
export type User = LoadingResult & {
  data?: IUser;
};

export type UpdateUserAvatar = LoadingResult & {
  data?: IUser;
};

export type UpdateUserPassword = LoadingResult & {
  data?: IUser;
};

export type UpdateUserRequestActionPayload = PayloadAction<UpdateUserParam>;
export type UpdateUserAvatarRequestActionPayload =
  PayloadAction<UpdateUserAvatarParam>;
export type UpdateUserPasswordRequestActionPayload =
  PayloadAction<UpdateUserPasswordParam>;

// Register Types
export type RegisterUser = LoadingResult & {
  data?: IUser;
};

export type RegisterUserRequestActionPayload = PayloadAction<RegisterUserParam>;

// Impersonate Types
export type ImpersonateUser = LoadingResult & {
  data?: IImpersonateUserResponse;
};

// Dashboard Reports Types
export type DashboardReports = LoadingResult & {
  data?: IUser;
};

export type DashboardReportsRequestActionPayload =
  PayloadAction<DashboardReportsParam>;

export type DashboardReportsParam = {
  dashboard_reports: string[];
};

// Favorite Reports Types
export type FavoriteReports = LoadingResult & {
  data?: IUser;
};

export type FavoriteReportsRequestActionPayload =
  PayloadAction<FavoriteReportsParam>;

export type FavoriteReportsParam = {
  report_id: number;
};

// Interface Definitions (these would be imported from your interfaces)
export interface IOauth {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

export interface IUser {
  id: string;
  attributes: {
    email: string;
    first_name: string;
    last_name: string;
    avatar?: string;
    dashboard_reports?: string[];
    favorite_reports?: number[];
  };
  relationships?: {
    roles?: Array<{
      attributes: { type: string };
      relationships?: {
        permissions?: Array<{
          attributes: { name: string };
        }>;
      };
    }>;
    user_gyms?: Array<{ id: string }>;
  };
}

export interface IImpersonateUserResponse {
  access_token: string;
  user: IUser;
}

// Parameter Types
export interface UpdateUserParam {
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface UpdateUserAvatarParam {
  avatar: File;
}

export interface UpdateUserPasswordParam {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface RegisterUserParam {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}
```

### 2.3 Create Other Entity Types

Create `/src/app/core/state/types/members.ts`:

```typescript
import { PayloadAction } from "@reduxjs/toolkit";
import { LoadingResult } from "./common";

export interface MembersState {
  members: MembersList;
  member: Member;
  createMember: CreateMember;
  updateMember: UpdateMember;
  deleteMember: DeleteMember;
}

export type MembersList = LoadingResult & {
  data?: IMember[];
  meta?: IMeta;
};

export type Member = LoadingResult & {
  data?: IMember;
};

export type CreateMember = LoadingResult & {
  data?: IMember;
};

export type UpdateMember = LoadingResult & {
  data?: IMember;
};

export type DeleteMember = LoadingResult & {
  data?: boolean;
};

// Action Payloads
export type GetMembersRequestActionPayload = PayloadAction<GetMembersParam>;
export type GetMemberRequestActionPayload = PayloadAction<GetMemberParam>;
export type CreateMemberRequestActionPayload = PayloadAction<CreateMemberParam>;
export type UpdateMemberRequestActionPayload = PayloadAction<UpdateMemberParam>;
export type DeleteMemberRequestActionPayload = PayloadAction<DeleteMemberParam>;

// Parameter Types
export interface GetMembersParam {
  page?: number;
  per_page?: number;
  search?: string;
  gym_id?: string;
}

export interface GetMemberParam {
  id: string;
}

export interface CreateMemberParam {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  gym_id: string;
}

export interface UpdateMemberParam {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

export interface DeleteMemberParam {
  id: string;
}

// Interface Definitions
export interface IMember {
  id: string;
  attributes: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    created_at: string;
    updated_at: string;
  };
  relationships?: {
    gym?: {
      data: {
        id: string;
        attributes: {
          name: string;
        };
      };
    };
  };
}
```

### 2.4 Create Index File for Types

Create `/src/app/core/state/types/index.ts`:

```typescript
// Export all types from individual files
export * from "./common";
export * from "./auth";
export * from "./members";
export * from "./organizations";
export * from "./gyms";
export * from "./forms";
export * from "./tasks";
export * from "./reports";
// Add other entity types as needed
```

## Step 3: Create Reducers

### 3.1 Create Auth Reducer

Create `/src/app/core/state/reducer/auth.ts`:

```typescript
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { bindActionCreators } from "redux";
import { useDispatch } from "react-redux";
import {
  AuthState,
  LoginRequestActionPayload,
  UpdateUserAvatarRequestActionPayload,
  UpdateUserRequestActionPayload,
  UpdateUserPasswordRequestActionPayload,
  RegisterUserRequestActionPayload,
  DashboardReportsRequestActionPayload,
  FavoriteReportsRequestActionPayload,
} from "../types/auth";

const initialState: AuthState = {
  login: {
    data: {
      access_token: "",
      expires_in: 0,
      refresh_token: "",
      token_type: "",
    },
    loading: false,
    success: false,
    error: false,
  },
  user: {
    data: undefined,
    loading: false,
    success: false,
    error: false,
  },
  updateUser: {
    data: undefined,
    loading: false,
    success: false,
    error: false,
  },
  updateUserAvatar: {
    data: undefined,
    loading: false,
    success: false,
    error: false,
  },
  updateUserPassword: {
    data: undefined,
    loading: false,
    success: false,
    error: false,
  },
  registerUser: {
    data: undefined,
    loading: false,
    success: false,
    error: false,
  },
  impersonateUser: {
    data: undefined,
    success: false,
    loading: false,
    error: false,
  },
  updateDashboardReports: {
    data: undefined,
    success: false,
    loading: false,
    error: false,
  },
  addFavoriteReport: {
    data: undefined,
    success: false,
    loading: false,
    error: false,
  },
  removeFavoriteReport: {
    data: undefined,
    success: false,
    loading: false,
    error: false,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login Actions
    login(state, actions: LoginRequestActionPayload) {
      state.login = {
        data: undefined,
        loading: true,
        success: false,
        error: false,
      };
    },
    loginSuccess(state, actions) {
      state.login = {
        data: actions.payload,
        loading: false,
        success: true,
        error: false,
      };
    },
    loginFailure(state) {
      state.login = {
        data: undefined,
        loading: false,
        success: false,
        error: true,
      };
    },

    // Get Current User Actions
    getCurrentUser(state) {
      state.user = {
        data: undefined,
        loading: true,
        success: false,
        error: false,
      };
    },
    getCurrentUserSuccess(state, actions) {
      state.user = {
        data: actions.payload,
        loading: false,
        success: true,
        error: false,
      };
    },
    getCurrentUserFailure(state) {
      state.user = {
        data: undefined,
        loading: false,
        success: false,
        error: true,
      };
    },

    // Update User Actions
    updateUser(state, actions: UpdateUserRequestActionPayload) {
      state.updateUser = {
        data: undefined,
        loading: true,
        success: false,
        error: false,
      };
    },
    updateUserSuccess(state, actions) {
      state.updateUser = {
        data: actions.payload,
        loading: false,
        success: true,
        error: false,
      };
      if (state.user.data?.attributes) {
        state.user.data.attributes = {
          ...actions.payload.attributes,
        };
      }
    },
    updateUserFailure(state) {
      state.updateUser = {
        data: undefined,
        loading: false,
        success: false,
        error: true,
      };
    },

    // Update User Avatar Actions
    updateUserAvatar(state, actions: UpdateUserAvatarRequestActionPayload) {
      state.updateUserAvatar = {
        data: undefined,
        loading: true,
        success: false,
        error: false,
      };
    },
    updateUserAvatarSuccess(state, actions) {
      state.updateUserAvatar = {
        data: actions.payload,
        loading: false,
        success: true,
        error: false,
      };
      if (state.user.data?.attributes) {
        state.user.data.attributes = {
          ...actions.payload.attributes,
        };
      }
    },
    updateUserAvatarFailure(state) {
      state.updateUserAvatar = {
        data: undefined,
        loading: false,
        success: false,
        error: true,
      };
    },
    resetUpdateUserAvatar(state) {
      state.updateUserAvatar = {
        data: undefined,
        loading: false,
        success: false,
        error: false,
      };
    },

    // Update User Password Actions
    updateUserPassword(state, actions: UpdateUserPasswordRequestActionPayload) {
      state.updateUserPassword = {
        data: undefined,
        loading: true,
        success: false,
        error: false,
      };
    },
    updateUserPasswordSuccess(state, actions) {
      state.updateUserPassword = {
        data: actions.payload,
        loading: false,
        success: true,
        error: false,
      };
    },
    updateUserPasswordFailure(state) {
      state.updateUserPassword = {
        data: undefined,
        loading: false,
        success: false,
        error: true,
      };
    },
    resetUpdateUserPassword(state) {
      state.updateUserPassword = {
        data: undefined,
        loading: false,
        success: false,
        error: false,
      };
    },

    // Register User Actions
    registerUser(state, actions: RegisterUserRequestActionPayload) {
      state.registerUser = {
        data: undefined,
        loading: true,
        success: false,
        error: false,
      };
    },
    registerUserSuccess(state, actions) {
      state.registerUser = {
        data: actions.payload,
        loading: false,
        success: true,
        error: false,
      };
    },
    registerUserFailure(state) {
      state.registerUser = {
        data: undefined,
        loading: false,
        success: false,
        error: true,
      };
    },
    resetRegisterUser(state) {
      state.registerUser = {
        data: undefined,
        loading: false,
        success: false,
        error: false,
      };
    },

    // Impersonate User Actions
    impersonateUser(state, actions: PayloadAction<number>) {
      state.impersonateUser = {
        data: undefined,
        loading: true,
        success: false,
        error: false,
      };
    },
    impersonateUserSuccess(state, actions) {
      state.impersonateUser = {
        data: actions.payload,
        loading: false,
        success: true,
        error: false,
      };
    },
    impersonateUserFailure(state) {
      state.impersonateUser = {
        data: undefined,
        loading: false,
        success: false,
        error: true,
      };
    },

    // Dashboard Reports Actions
    updateDashboardReports(
      state,
      actions: DashboardReportsRequestActionPayload
    ) {
      state.updateDashboardReports = {
        data: undefined,
        loading: true,
        success: false,
        error: false,
      };
    },
    updateDashboardReportsSuccess(state, actions) {
      state.updateDashboardReports = {
        data: actions.payload,
        loading: false,
        success: true,
        error: false,
      };
      if (state.user.data?.attributes) {
        state.user.data.attributes = {
          ...actions.payload.attributes,
        };
      }
    },
    updateDashboardReportsFailure(state) {
      state.updateDashboardReports = {
        data: undefined,
        loading: false,
        success: false,
        error: true,
      };
    },

    // Favorite Reports Actions
    addFavoriteReport(state, actions: FavoriteReportsRequestActionPayload) {
      state.addFavoriteReport = {
        data: undefined,
        loading: true,
        success: false,
        error: false,
      };
    },
    addFavoriteReportSuccess(state, actions) {
      state.addFavoriteReport = {
        data: actions.payload,
        loading: false,
        success: true,
        error: false,
      };
      if (state.user.data?.attributes) {
        state.user.data.attributes = {
          ...actions.payload.attributes,
        };
      }
    },
    addFavoriteReportFailure(state) {
      state.addFavoriteReport = {
        data: undefined,
        loading: false,
        success: false,
        error: true,
      };
    },

    removeFavoriteReport(state, actions: FavoriteReportsRequestActionPayload) {
      state.removeFavoriteReport = {
        data: undefined,
        loading: true,
        success: false,
        error: false,
      };
    },
    removeFavoriteReportSuccess(state, actions) {
      state.removeFavoriteReport = {
        data: actions.payload,
        loading: false,
        success: true,
        error: false,
      };
      if (state.user.data?.attributes) {
        state.user.data.attributes = {
          ...actions.payload.attributes,
        };
      }
    },
    removeFavoriteReportFailure(state) {
      state.removeFavoriteReport = {
        data: undefined,
        loading: false,
        success: false,
        error: true,
      };
    },
  },
});

// Export actions
export const {
  login,
  loginFailure,
  loginSuccess,
  getCurrentUser,
  getCurrentUserSuccess,
  getCurrentUserFailure,
  updateUser,
  updateUserFailure,
  updateUserSuccess,
  updateUserAvatar,
  updateUserAvatarFailure,
  updateUserAvatarSuccess,
  resetUpdateUserAvatar,
  updateUserPassword,
  updateUserPasswordFailure,
  updateUserPasswordSuccess,
  resetUpdateUserPassword,
  registerUser,
  registerUserFailure,
  registerUserSuccess,
  resetRegisterUser,
  impersonateUser,
  impersonateUserFailure,
  impersonateUserSuccess,
  addFavoriteReport,
  addFavoriteReportFailure,
  addFavoriteReportSuccess,
  removeFavoriteReport,
  removeFavoriteReportFailure,
  removeFavoriteReportSuccess,
  updateDashboardReports,
  updateDashboardReportsFailure,
  updateDashboardReportsSuccess,
} = authSlice.actions;

// Export action creators for useDispatch
export const mapDispatchToProps = () => {
  return bindActionCreators(
    {
      login,
      getCurrentUser,
      updateUser,
      updateUserAvatar,
      resetUpdateUserAvatar,
      resetUpdateUserPassword,
      updateUserPassword,
      registerUser,
      resetRegisterUser,
      impersonateUser,
      addFavoriteReport,
      removeFavoriteReport,
      updateDashboardReports,
    },
    useDispatch()
  );
};

export default authSlice.reducer;
```

### 3.2 Create Members Reducer

Create `/src/app/core/state/reducer/members.ts`:

```typescript
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { bindActionCreators } from "redux";
import { useDispatch } from "react-redux";
import {
  MembersState,
  GetMembersRequestActionPayload,
  GetMemberRequestActionPayload,
  CreateMemberRequestActionPayload,
  UpdateMemberRequestActionPayload,
  DeleteMemberRequestActionPayload,
} from "../types/members";

const initialState: MembersState = {
  members: {
    data: undefined,
    meta: undefined,
    loading: false,
    success: false,
    error: false,
  },
  member: {
    data: undefined,
    loading: false,
    success: false,
    error: false,
  },
  createMember: {
    data: undefined,
    loading: false,
    success: false,
    error: false,
  },
  updateMember: {
    data: undefined,
    loading: false,
    success: false,
    error: false,
  },
  deleteMember: {
    data: undefined,
    loading: false,
    success: false,
    error: false,
  },
};

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    // Get Members Actions
    getMembers(state, actions: GetMembersRequestActionPayload) {
      state.members = {
        data: undefined,
        meta: undefined,
        loading: true,
        success: false,
        error: false,
      };
    },
    getMembersSuccess(state, actions) {
      state.members = {
        data: actions.payload.data,
        meta: actions.payload.meta,
        loading: false,
        success: true,
        error: false,
      };
    },
    getMembersFailure(state) {
      state.members = {
        data: undefined,
        meta: undefined,
        loading: false,
        success: false,
        error: true,
      };
    },

    // Get Member Actions
    getMember(state, actions: GetMemberRequestActionPayload) {
      state.member = {
        data: undefined,
        loading: true,
        success: false,
        error: false,
      };
    },
    getMemberSuccess(state, actions) {
      state.member = {
        data: actions.payload,
        loading: false,
        success: true,
        error: false,
      };
    },
    getMemberFailure(state) {
      state.member = {
        data: undefined,
        loading: false,
        success: false,
        error: true,
      };
    },

    // Create Member Actions
    createMember(state, actions: CreateMemberRequestActionPayload) {
      state.createMember = {
        data: undefined,
        loading: true,
        success: false,
        error: false,
      };
    },
    createMemberSuccess(state, actions) {
      state.createMember = {
        data: actions.payload,
        loading: false,
        success: true,
        error: false,
      };
    },
    createMemberFailure(state) {
      state.createMember = {
        data: undefined,
        loading: false,
        success: false,
        error: true,
      };
    },

    // Update Member Actions
    updateMember(state, actions: UpdateMemberRequestActionPayload) {
      state.updateMember = {
        data: undefined,
        loading: true,
        success: false,
        error: false,
      };
    },
    updateMemberSuccess(state, actions) {
      state.updateMember = {
        data: actions.payload,
        loading: false,
        success: true,
        error: false,
      };
    },
    updateMemberFailure(state) {
      state.updateMember = {
        data: undefined,
        loading: false,
        success: false,
        error: true,
      };
    },

    // Delete Member Actions
    deleteMember(state, actions: DeleteMemberRequestActionPayload) {
      state.deleteMember = {
        data: undefined,
        loading: true,
        success: false,
        error: false,
      };
    },
    deleteMemberSuccess(state, actions) {
      state.deleteMember = {
        data: actions.payload,
        loading: false,
        success: true,
        error: false,
      };
    },
    deleteMemberFailure(state) {
      state.deleteMember = {
        data: undefined,
        loading: false,
        success: false,
        error: true,
      };
    },
  },
});

// Export actions
export const {
  getMembers,
  getMembersSuccess,
  getMembersFailure,
  getMember,
  getMemberSuccess,
  getMemberFailure,
  createMember,
  createMemberSuccess,
  createMemberFailure,
  updateMember,
  updateMemberSuccess,
  updateMemberFailure,
  deleteMember,
  deleteMemberSuccess,
  deleteMemberFailure,
} = membersSlice.actions;

// Export action creators for useDispatch
export const mapDispatchToProps = () => {
  return bindActionCreators(
    {
      getMembers,
      getMember,
      createMember,
      updateMember,
      deleteMember,
    },
    useDispatch()
  );
};

export default membersSlice.reducer;
```

### 3.3 Create Root Reducer

Create `/src/app/core/state/reducer/index.ts`:

```typescript
import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import auth from "./auth";
import members from "./members";
import organizations from "./organizations";
import gyms from "./gyms";
import forms from "./forms";
import tasks from "./tasks";
import reports from "./reports";
// Import other reducers as needed

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only persist auth state
};

const persistedAuthReducer = persistReducer(persistConfig, auth);

const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  members,
  organizations,
  gyms,
  forms,
  tasks,
  reports,
  // Add other reducers as needed
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
```

## Step 4: Create Sagas

### 4.1 Create Auth Saga

Create `/src/app/core/state/saga/auth.ts`:

```typescript
import { takeLatest, call, put } from "redux-saga/effects";
import {
  login,
  loginSuccess,
  loginFailure,
  getCurrentUser,
  getCurrentUserSuccess,
  getCurrentUserFailure,
  updateUser,
  updateUserFailure,
  updateUserSuccess,
  updateUserAvatar,
  updateUserAvatarFailure,
  updateUserAvatarSuccess,
  updateUserPassword,
  updateUserPasswordSuccess,
  updateUserPasswordFailure,
  registerUser,
  registerUserFailure,
  registerUserSuccess,
  impersonateUser,
  impersonateUserSuccess,
  impersonateUserFailure,
  addFavoriteReportSuccess,
  addFavoriteReportFailure,
  removeFavoriteReportSuccess,
  removeFavoriteReportFailure,
  addFavoriteReport,
  removeFavoriteReport,
  updateDashboardReportsSuccess,
  updateDashboardReportsFailure,
  updateDashboardReports,
} from "../reducer/auth";
import {
  getLoggedInUserRequest,
  loginRequest,
  updateUserRequest,
  updateUserAvatarRequest,
  updateUserPasswordRequest,
  registerUserRequest,
  impersonateUserRequest,
} from "../../services/auth/auth.service";
import { AxiosResponse } from "axios";
import {
  LoginRequestActionPayload,
  UpdateUserAvatarRequestActionPayload,
  UpdateUserPasswordRequestActionPayload,
  UpdateUserRequestActionPayload,
} from "../types/auth";
import { handleServerException } from "../../services/utils/utils.service";
import { persistor } from "../store";
import {
  DashboardReportsRequestActionPayload,
  FavoriteReportsRequestActionPayload,
} from "../types/reports";
import {
  addFavoriteReportRequest,
  removeFavoriteReportRequest,
  updateDashboardReportsRequest,
} from "../../services/reports/reports.service";

// Login Saga
function* loginRequestSaga(actions: LoginRequestActionPayload) {
  try {
    const data: AxiosResponse = yield call(loginRequest, actions.payload);
    yield put(loginSuccess(data));
    persistor.flush();
  } catch (err: any) {
    yield call(handleServerException, err, loginFailure.type, true);
  }
}

// Get Current User Saga
function* getCurrentUserSaga() {
  try {
    const { data }: AxiosResponse = yield call(getLoggedInUserRequest);
    yield put(getCurrentUserSuccess(data));
  } catch (err: any) {
    yield call(handleServerException, err, getCurrentUserFailure.type, true);
  }
}

// Update User Saga
function* updateUserSaga(actions: UpdateUserRequestActionPayload) {
  try {
    const { data }: AxiosResponse = yield call(
      updateUserRequest,
      actions.payload
    );
    yield put(updateUserSuccess(data));
  } catch (err: any) {
    yield call(handleServerException, err, updateUserFailure.type, true);
  }
}

// Update User Avatar Saga
function* updateUserAvatarSaga(actions: UpdateUserAvatarRequestActionPayload) {
  try {
    const { data }: AxiosResponse = yield call(
      updateUserAvatarRequest,
      actions.payload
    );
    yield put(updateUserAvatarSuccess(data));
  } catch (err: any) {
    yield call(handleServerException, err, updateUserAvatarFailure.type, true);
  }
}

// Update User Password Saga
function* updateUserPasswordSaga(
  actions: UpdateUserPasswordRequestActionPayload
) {
  try {
    const { data }: AxiosResponse = yield call(
      updateUserPasswordRequest,
      actions.payload
    );
    yield put(updateUserPasswordSuccess(data));
  } catch (err: any) {
    yield call(
      handleServerException,
      err,
      updateUserPasswordFailure.type,
      true
    );
  }
}

// Register User Saga
function* registerUserSaga(actions: any) {
  try {
    const { data }: AxiosResponse = yield call(
      registerUserRequest,
      actions.payload
    );
    yield put(registerUserSuccess(data));
  } catch (err: any) {
    yield call(handleServerException, err, registerUserFailure.type, true);
  }
}

// Impersonate User Saga
function* impersonateUserSaga(actions: any) {
  try {
    const { data }: AxiosResponse = yield call(
      impersonateUserRequest,
      actions.payload
    );
    yield put(impersonateUserSuccess(data));
    persistor.flush();
  } catch (err: any) {
    yield call(handleServerException, err, impersonateUserFailure.type, true);
  }
}

// Update Dashboard Reports Saga
function* updateDashboardReportsSaga(
  actions: DashboardReportsRequestActionPayload
) {
  try {
    const { data }: AxiosResponse = yield call(
      updateDashboardReportsRequest,
      actions.payload
    );
    yield put(updateDashboardReportsSuccess(data));
  } catch (err: any) {
    yield call(
      handleServerException,
      err,
      updateDashboardReportsFailure.type,
      true
    );
  }
}

// Add Favorite Report Saga
function* addFavoriteReportSaga(actions: FavoriteReportsRequestActionPayload) {
  try {
    const { data }: AxiosResponse = yield call(
      addFavoriteReportRequest,
      actions.payload
    );
    yield put(addFavoriteReportSuccess(data));
  } catch (err: any) {
    yield call(handleServerException, err, addFavoriteReportFailure.type, true);
  }
}

// Remove Favorite Report Saga
function* removeFavoriteReportSaga(
  actions: FavoriteReportsRequestActionPayload
) {
  try {
    const { data }: AxiosResponse = yield call(
      removeFavoriteReportRequest,
      actions.payload
    );
    yield put(removeFavoriteReportSuccess(data));
  } catch (err: any) {
    yield call(
      handleServerException,
      err,
      removeFavoriteReportFailure.type,
      true
    );
  }
}

// Root Saga
export function* rootSaga() {
  yield takeLatest(login.type, loginRequestSaga);
  yield takeLatest(getCurrentUser.type, getCurrentUserSaga);
  yield takeLatest(updateUser.type, updateUserSaga);
  yield takeLatest(updateUserAvatar.type, updateUserAvatarSaga);
  yield takeLatest(updateUserPassword.type, updateUserPasswordSaga);
  yield takeLatest(registerUser.type, registerUserSaga);
  yield takeLatest(impersonateUser.type, impersonateUserSaga);
  yield takeLatest(addFavoriteReport.type, addFavoriteReportSaga);
  yield takeLatest(removeFavoriteReport.type, removeFavoriteReportSaga);
  yield takeLatest(updateDashboardReports.type, updateDashboardReportsSaga);
}
```

### 4.2 Create Members Saga

Create `/src/app/core/state/saga/members.ts`:

```typescript
import { takeLatest, call, put } from "redux-saga/effects";
import {
  getMembers,
  getMembersSuccess,
  getMembersFailure,
  getMember,
  getMemberSuccess,
  getMemberFailure,
  createMember,
  createMemberSuccess,
  createMemberFailure,
  updateMember,
  updateMemberSuccess,
  updateMemberFailure,
  deleteMember,
  deleteMemberSuccess,
  deleteMemberFailure,
} from "../reducer/members";
import {
  getMembersRequest,
  getMemberRequest,
  createMemberRequest,
  updateMemberRequest,
  deleteMemberRequest,
} from "../../services/members/members.service";
import { AxiosResponse } from "axios";
import {
  GetMembersRequestActionPayload,
  GetMemberRequestActionPayload,
  CreateMemberRequestActionPayload,
  UpdateMemberRequestActionPayload,
  DeleteMemberRequestActionPayload,
} from "../types/members";
import { handleServerException } from "../../services/utils/utils.service";

// Get Members Saga
function* getMembersSaga(actions: GetMembersRequestActionPayload) {
  try {
    const { data }: AxiosResponse = yield call(
      getMembersRequest,
      actions.payload
    );
    yield put(getMembersSuccess(data));
  } catch (err: any) {
    yield call(handleServerException, err, getMembersFailure.type, true);
  }
}

// Get Member Saga
function* getMemberSaga(actions: GetMemberRequestActionPayload) {
  try {
    const { data }: AxiosResponse = yield call(
      getMemberRequest,
      actions.payload
    );
    yield put(getMemberSuccess(data));
  } catch (err: any) {
    yield call(handleServerException, err, getMemberFailure.type, true);
  }
}

// Create Member Saga
function* createMemberSaga(actions: CreateMemberRequestActionPayload) {
  try {
    const { data }: AxiosResponse = yield call(
      createMemberRequest,
      actions.payload
    );
    yield put(createMemberSuccess(data));
  } catch (err: any) {
    yield call(handleServerException, err, createMemberFailure.type, true);
  }
}

// Update Member Saga
function* updateMemberSaga(actions: UpdateMemberRequestActionPayload) {
  try {
    const { data }: AxiosResponse = yield call(
      updateMemberRequest,
      actions.payload
    );
    yield put(updateMemberSuccess(data));
  } catch (err: any) {
    yield call(handleServerException, err, updateMemberFailure.type, true);
  }
}

// Delete Member Saga
function* deleteMemberSaga(actions: DeleteMemberRequestActionPayload) {
  try {
    const { data }: AxiosResponse = yield call(
      deleteMemberRequest,
      actions.payload
    );
    yield put(deleteMemberSuccess(data));
  } catch (err: any) {
    yield call(handleServerException, err, deleteMemberFailure.type, true);
  }
}

// Root Saga
export function* rootSaga() {
  yield takeLatest(getMembers.type, getMembersSaga);
  yield takeLatest(getMember.type, getMemberSaga);
  yield takeLatest(createMember.type, createMemberSaga);
  yield takeLatest(updateMember.type, updateMemberSaga);
  yield takeLatest(deleteMember.type, deleteMemberSaga);
}
```

### 4.3 Create Root Saga

Create `/src/app/core/state/saga/index.ts`:

```typescript
import { all, fork } from "redux-saga/effects";
import * as authSaga from "./auth";
import * as membersSaga from "./members";
import * as organizationsSaga from "./organizations";
import * as gymsSaga from "./gyms";
import * as formsSaga from "./forms";
import * as tasksSaga from "./tasks";
import * as reportsSaga from "./reports";
// Import other sagas as needed

export default function* root() {
  const sagas = [
    ...Object.values(authSaga),
    ...Object.values(membersSaga),
    ...Object.values(organizationsSaga),
    ...Object.values(gymsSaga),
    ...Object.values(formsSaga),
    ...Object.values(tasksSaga),
    ...Object.values(reportsSaga),
    // Add other sagas as needed
  ];
  yield all(sagas.map(fork));
}
```

## Step 5: Create Services

### 5.1 Create Auth Service

Create `/src/app/core/services/auth/auth.service.ts`:

```typescript
import { AxiosResponse } from "axios";
import { api } from "../api";
import {
  LoginPayload,
  UpdateUserParam,
  UpdateUserAvatarParam,
  UpdateUserPasswordParam,
  RegisterUserParam,
} from "../../state/types/auth";

export const loginRequest = (payload: LoginPayload): Promise<AxiosResponse> => {
  return api.post("/auth/login", payload);
};

export const getLoggedInUserRequest = (): Promise<AxiosResponse> => {
  return api.get("/auth/me");
};

export const updateUserRequest = (
  payload: UpdateUserParam
): Promise<AxiosResponse> => {
  return api.put("/auth/user", payload);
};

export const updateUserAvatarRequest = (
  payload: UpdateUserAvatarParam
): Promise<AxiosResponse> => {
  const formData = new FormData();
  formData.append("avatar", payload.avatar);
  return api.post("/auth/user/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateUserPasswordRequest = (
  payload: UpdateUserPasswordParam
): Promise<AxiosResponse> => {
  return api.put("/auth/user/password", payload);
};

export const registerUserRequest = (
  payload: RegisterUserParam
): Promise<AxiosResponse> => {
  return api.post("/auth/register", payload);
};

export const impersonateUserRequest = (
  userId: number
): Promise<AxiosResponse> => {
  return api.post(`/auth/impersonate/${userId}`);
};
```

### 5.2 Create Members Service

Create `/src/app/core/services/members/members.service.ts`:

```typescript
import { AxiosResponse } from "axios";
import { api } from "../api";
import {
  GetMembersParam,
  GetMemberParam,
  CreateMemberParam,
  UpdateMemberParam,
  DeleteMemberParam,
} from "../../state/types/members";

export const getMembersRequest = (
  params: GetMembersParam
): Promise<AxiosResponse> => {
  return api.get("/members", { params });
};

export const getMemberRequest = (
  params: GetMemberParam
): Promise<AxiosResponse> => {
  return api.get(`/members/${params.id}`);
};

export const createMemberRequest = (
  payload: CreateMemberParam
): Promise<AxiosResponse> => {
  return api.post("/members", payload);
};

export const updateMemberRequest = (
  payload: UpdateMemberParam
): Promise<AxiosResponse> => {
  const { id, ...data } = payload;
  return api.put(`/members/${id}`, data);
};

export const deleteMemberRequest = (
  params: DeleteMemberParam
): Promise<AxiosResponse> => {
  return api.delete(`/members/${params.id}`);
};
```

### 5.3 Create API Configuration

Create `/src/app/core/services/api.ts`:

```typescript
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("access_token");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export { api };
```

### 5.4 Create Utils Service

Create `/src/app/core/services/utils/utils.service.ts`:

```typescript
import { put } from "redux-saga/effects";
import { toast } from "react-toastify";

export function* handleServerException(
  error: any,
  actionType: string,
  showToast: boolean = false
) {
  console.error("Server Exception:", error);

  if (showToast) {
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    toast.error(message);
  }

  yield put({ type: actionType });
}
```

## Step 6: Configure Store

### 6.1 Create Store Configuration

Create `/src/app/core/state/store.ts`:

```typescript
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import rootReducer from "./reducer/index";
import logger from "redux-logger";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./saga/index";
import { persistStore } from "redux-persist";

const sagaMiddleware = createSagaMiddleware();

const middleware = [sagaMiddleware];

// Add logger only in development
if (process.env.NODE_ENV === "development") {
  middleware.push(logger);
}

const store = configureStore({
  reducer: rootReducer,
  middleware,
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
```

## Step 7: Set Up Persistence

### 7.1 Configure Redux Persist

The persistence is already configured in the store setup. The auth reducer is
persisted to maintain user session across browser refreshes.

### 7.2 Create Persist Gate Component

Create `/src/app/core/components/PersistGate.tsx`:

```typescript
import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "../state/store";
import Loader from "./Loader";

interface CustomPersistGateProps {
  children: React.ReactNode;
}

const CustomPersistGate: React.FC<CustomPersistGateProps> = ({ children }) => {
  return (
    <PersistGate loading={<Loader />} persistor={persistor}>
      {children}
    </PersistGate>
  );
};

export default CustomPersistGate;
```

## Step 8: Integration

### 8.1 Update Main App Component

Update `/src/app/app.tsx`:

```typescript
import { useEffect } from "react";
import { mapDispatchToProps } from "./core/state/reducer/auth";
import AppRoutes from "./modules/routes";
import { RootState } from "./core/state/store";
import { useSelector } from "react-redux";
import Loader from "./core/components/Loader";
import CustomPersistGate from "./core/components/PersistGate";

const App = () => {
  const { getCurrentUser } = mapDispatchToProps();
  const { loading } = useSelector((state: RootState) => state.auth.user);
  const { data } = useSelector((state: RootState) => state.auth.login);

  useEffect(() => {
    if (!loading && data?.access_token) {
      getCurrentUser();
    }
  }, [data?.access_token]);

  return (
    <CustomPersistGate>
      {!loading && <AppRoutes />}
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      )}
    </CustomPersistGate>
  );
};

export default App;
```

### 8.2 Update Main Entry Point

Update `/src/main.tsx`:

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./app/core/state/store";
import App from "./app/app";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
```

## Step 9: Testing

### 9.1 Create Test Utilities

Create `/src/app/core/utils/testUtils.ts`:

```typescript
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "../state/store";

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
```

### 9.2 Create Reducer Tests

Create `/src/app/core/state/reducer/__tests__/auth.test.ts`:

```typescript
import authReducer, { login, loginSuccess, loginFailure } from "../auth";
import { AuthState } from "../../types/auth";

describe("Auth Reducer", () => {
  const initialState: AuthState = {
    login: {
      data: undefined,
      loading: false,
      success: false,
      error: false,
    },
    user: {
      data: undefined,
      loading: false,
      success: false,
      error: false,
    },
    // ... other initial state properties
  };

  it("should handle login action", () => {
    const action = login({
      payload: { username: "test", password: "test" },
    });
    const newState = authReducer(initialState, action);

    expect(newState.login.loading).toBe(true);
    expect(newState.login.success).toBe(false);
    expect(newState.login.error).toBe(false);
  });

  it("should handle loginSuccess action", () => {
    const mockData = {
      access_token: "token",
      expires_in: 3600,
      refresh_token: "refresh",
      token_type: "Bearer",
    };
    const action = loginSuccess(mockData);
    const newState = authReducer(initialState, action);

    expect(newState.login.loading).toBe(false);
    expect(newState.login.success).toBe(true);
    expect(newState.login.data).toEqual(mockData);
  });

  it("should handle loginFailure action", () => {
    const action = loginFailure();
    const newState = authReducer(initialState, action);

    expect(newState.login.loading).toBe(false);
    expect(newState.login.success).toBe(false);
    expect(newState.login.error).toBe(true);
  });
});
```

### 9.3 Create Saga Tests

Create `/src/app/core/state/saga/__tests__/auth.test.ts`:

```typescript
import { runSaga } from "redux-saga";
import { call, put } from "redux-saga/effects";
import { loginRequestSaga } from "../auth";
import { loginRequest } from "../../../services/auth/auth.service";
import { loginSuccess, loginFailure } from "../../reducer/auth";

describe("Auth Saga", () => {
  it("should handle successful login", async () => {
    const mockData = {
      access_token: "token",
      expires_in: 3600,
      refresh_token: "refresh",
      token_type: "Bearer",
    };

    const dispatched: any[] = [];

    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
      },
      loginRequestSaga,
      {
        payload: { username: "test", password: "test" },
      }
    ).toPromise();

    expect(dispatched).toContainEqual(loginSuccess(mockData));
  });
});
```

## Troubleshooting

### Common Issues

1. **Saga not running**: Ensure saga middleware is properly configured and root
   saga is running
2. **Persistence not working**: Check persist configuration and ensure
   PersistGate is wrapping the app
3. **Type errors**: Verify all type definitions are properly imported and
   exported
4. **API calls failing**: Check API configuration and ensure proper error
   handling
5. **State not updating**: Verify action creators are properly bound and
   dispatched

### Debug Tips

1. **Redux DevTools**: Use Redux DevTools extension to inspect state changes
2. **Console logs**: Add console.log statements in sagas to track execution
3. **Network tab**: Check API calls in browser network tab
4. **Type checking**: Use TypeScript strict mode to catch type errors early

### Performance Considerations

1. **Selective persistence**: Only persist necessary state to avoid performance
   issues
2. **Saga optimization**: Use takeLatest for actions that should cancel previous
   requests
3. **Memoization**: Use React.memo for components that consume Redux state
4. **State normalization**: Keep state normalized to avoid unnecessary
   re-renders

## Additional Notes

- The system supports complex state management with multiple entities
- Sagas handle all async operations and side effects
- TypeScript provides full type safety throughout the state management system
- Redux Persist maintains user session across browser refreshes
- The architecture is scalable and can handle additional entities easily

This setup provides a robust, type-safe state management system that can handle
complex application state while maintaining good performance and developer
experience.
