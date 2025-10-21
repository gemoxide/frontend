# AuthGuard and SidebarLayout Setup Instructions

This document provides step-by-step instructions for setting up the
authentication guard and sidebar layout routing system in the Coached Success
App.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Route Configuration](#step-1-route-configuration)
4. [Step 2: AuthGuard Implementation](#step-2-authguard-implementation)
5. [Step 3: SidebarLayout Setup](#step-3-sidebarlayout-setup)
6. [Step 4: Navigation System](#step-4-navigation-system)
7. [Step 5: Route Integration](#step-5-route-integration)
8. [Step 6: Testing](#step-6-testing)
9. [Troubleshooting](#troubleshooting)

## Overview

The application uses a sophisticated routing system with:

- **AuthGuard**: Protects routes based on user authentication, roles, and
  permissions
- **SidebarLayout**: Provides navigation structure with dynamic sidebar based on
  user type
- **Route-based permissions**: Fine-grained access control using roles and
  permissions
- **Dynamic navigation**: Sidebar items change based on user permissions and
  roles

## Prerequisites

Before starting, ensure you have the following dependencies and systems in
place:

### Required Dependencies

Install the necessary packages:

```bash
npm install react-router-dom
npm install @reduxjs/toolkit react-redux
npm install @heroicons/react
npm install react-toastify
npm install @types/react-router-dom
```

### Redux Store Configuration

1. **Store Setup**: Configure Redux store with auth reducer
2. **Auth State**: Implement auth state management with user data, loading
   states, and authentication tokens
3. **Actions**: Create actions for login, logout, and user data fetching
4. **Selectors**: Set up selectors to access auth state throughout the app

### Authentication System

1. **Login/Register Components**: Create authentication forms
2. **Token Management**: Implement JWT token storage and refresh logic
3. **API Integration**: Connect to authentication endpoints
4. **User Data Fetching**: Implement current user data retrieval

### Permission System

1. **Role Definitions**: Define user roles (admin, user, staff)
2. **Permission Types**: Create permission enums for granular access control
3. **User Permissions**: Implement permission checking logic
4. **Role-based Access**: Set up role-based route protection

### Required Components

1. **Loader Component**: For loading states during authentication
2. **TopNavBar Component**: Header component for the layout
3. **SideBarItem Component**: Individual sidebar navigation items
4. **ToggleSidebar Component**: For collapsible sidebar functionality

### Context Providers

1. **RightSideBarContext**: For managing right sidebar state
2. **DashboardReportsToggleContext**: For dashboard-specific toggles
3. **Auth Context**: For global authentication state (if not using Redux)

### File Structure

Ensure your project has the following structure:

```
src/
├── app/
│   ├── core/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── interfaces/
│   │   ├── layouts/
│   │   ├── services/
│   │   └── state/
│   ├── modules/
│   │   ├── admin/
│   │   ├── organization/
│   │   └── shared/
│   └── app.tsx
```

### Environment Setup

1. **API Base URL**: Configure your API endpoint
2. **Environment Variables**: Set up environment-specific configurations
3. **Build Configuration**: Ensure proper build setup for the routing system

### Testing Setup

1. **Test Utilities**: Set up testing utilities for route testing
2. **Mock Data**: Create mock user data for testing different permission
   scenarios
3. **Test Routes**: Prepare test routes for different user types and permissions

## Prerequisites Setup Guide

Follow these step-by-step instructions to set up all prerequisites before
implementing the AuthGuard and SidebarLayout system.

### Step 1: Install Required Dependencies

```bash
# Install React Router DOM
npm install react-router-dom

# Install Redux Toolkit and React Redux
npm install @reduxjs/toolkit react-redux

# Install Heroicons for navigation icons
npm install @heroicons/react

# Install React Toastify for notifications
npm install react-toastify

# Install TypeScript types
npm install @types/react-router-dom

# Install additional dependencies if not already present
npm install @types/react @types/react-dom
```

### Step 2: Set Up Redux Store

#### 2.1 Create Store Configuration

Create `/src/app/core/state/store.ts`:

```typescript
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/auth";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### 2.2 Create Auth Reducer

Create `/src/app/core/state/reducer/auth.ts`:

```typescript
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Define the auth state interface
interface AuthState {
  user: {
    data: any;
    loading: boolean;
    success: boolean;
    error: string | null;
  };
  login: {
    data: any;
    loading: boolean;
    success: boolean;
    error: string | null;
  };
}

const initialState: AuthState = {
  user: {
    data: null,
    loading: false,
    success: false,
    error: null,
  },
  login: {
    data: null,
    loading: false,
    success: false,
    error: null,
  },
};

// Create async thunks for API calls
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: { email: string; password: string }) => {
    // Implement your login API call here
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return response.json();
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async () => {
    // Implement your get current user API call here
    const token = localStorage.getItem("access_token");
    const response = await fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user.data = null;
      state.login.data = null;
      localStorage.removeItem("access_token");
    },
    clearError: (state) => {
      state.user.error = null;
      state.login.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.login.loading = true;
        state.login.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.login.loading = false;
        state.login.success = true;
        state.login.data = action.payload;
        localStorage.setItem("access_token", action.payload.access_token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.login.loading = false;
        state.login.error = action.error.message || "Login failed";
      });

    // Get current user cases
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.user.loading = true;
        state.user.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user.loading = false;
        state.user.success = true;
        state.user.data = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.user.loading = false;
        state.user.error = action.error.message || "Failed to get user data";
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

// Action creators for mapDispatchToProps
export const mapDispatchToProps = () => ({
  loginUser,
  getCurrentUser,
  logout,
  clearError,
});
```

#### 2.3 Set Up Redux Provider

Update your main app entry point (`/src/main.tsx` or `/src/index.tsx`):

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

### Step 3: Create Required Components

#### 3.1 Create Loader Component

Create `/src/app/core/components/Loader/index.tsx`:

```typescript
import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
};

export default Loader;
```

#### 3.2 Create TopNavBar Component

Create `/src/app/core/components/TopNavBar/index.tsx`:

```typescript
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../state/reducer";

const TopNavBar = () => {
  const { data: currentUser } = useSelector(
    (state: RootState) => state.auth.user
  );

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Coached Success</a>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img alt="User Avatar" src="/default-avatar.png" />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TopNavBar;
```

#### 3.3 Create SideBarItem Component

Create `/src/app/core/components/SideBarItem/index.tsx`:

```typescript
import React from "react";
import { NavLink } from "react-router-dom";

interface SideBarItemProps {
  icon: React.ComponentType<any>;
  name: string;
  path: string;
  iconActive?: React.ComponentType<any>;
}

const SideBarItem: React.FC<SideBarItemProps> = ({
  icon: Icon,
  name,
  path,
  iconActive: IconActive,
}) => {
  return (
    <li>
      <NavLink
        to={path}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive
              ? "bg-primary text-primary-content"
              : "text-gray-700 hover:bg-gray-100"
          }`
        }
      >
        {({ isActive }) => (
          <>
            {isActive && IconActive ? (
              <IconActive className="w-5 h-5" />
            ) : (
              <Icon className="w-5 h-5" />
            )}
            <span>{name}</span>
          </>
        )}
      </NavLink>
    </li>
  );
};

export default SideBarItem;
```

#### 3.4 Create ToggleSidebar Component

Create `/src/app/core/components/ToggleSidebar/index.tsx`:

```typescript
import React from "react";

interface ToggleSidebarProps {
  show: boolean;
  children: React.ReactNode;
}

const ToggleSidebar: React.FC<ToggleSidebarProps> = ({ show, children }) => {
  if (!show) return null;

  return (
    <div className="drawer-side">
      <label htmlFor="rightSideDrawer" className="drawer-overlay" />
      <div className="p-10 overflow-y-auto w-1/4 bg-base-100 text-base-content">
        {children}
      </div>
    </div>
  );
};

export default ToggleSidebar;
```

### Step 4: Set Up Context Providers

#### 4.1 Create RightSideBarContext

Create `/src/app/core/context/rightSideBar.tsx`:

```typescript
import React, { createContext, useContext, useState, ReactNode } from "react";

interface RightSideBarContextType {
  state: {
    component: ReactNode;
    refresh: boolean;
  };
  setState: (state: { component: ReactNode; refresh: boolean }) => void;
}

const RightSideBarContext = createContext<RightSideBarContextType | undefined>(
  undefined
);

export const RightSideBarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<{
    component: ReactNode;
    refresh: boolean;
  }>({
    component: null,
    refresh: false,
  });

  return (
    <RightSideBarContext.Provider value={{ state, setState }}>
      {children}
    </RightSideBarContext.Provider>
  );
};

export const useRightSideBar = () => {
  const context = useContext(RightSideBarContext);
  if (context === undefined) {
    throw new Error(
      "useRightSideBar must be used within a RightSideBarProvider"
    );
  }
  return context;
};

export const RightSideBarContext = RightSideBarContext;
```

#### 4.2 Create DashboardReportsToggleContext

Create `/src/app/core/context/dashboardReportsToggle.tsx`:

```typescript
import React, { createContext, useContext, useState, ReactNode } from "react";

interface DashboardReportsToggleContextType {
  showToggleReports: boolean;
  setShowToggleReports: (show: boolean) => void;
}

const DashboardReportsToggleContext = createContext<
  DashboardReportsToggleContextType | undefined
>(undefined);

export const DashboardReportsToggleProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [showToggleReports, setShowToggleReports] = useState(false);

  return (
    <DashboardReportsToggleContext.Provider
      value={{ showToggleReports, setShowToggleReports }}
    >
      {children}
    </DashboardReportsToggleContext.Provider>
  );
};

export const useDashboardReportsToggle = () => {
  const context = useContext(DashboardReportsToggleContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardReportsToggle must be used within a DashboardReportsToggleProvider"
    );
  }
  return context;
};

export const DashboardReportsToggleContext = DashboardReportsToggleContext;
```

### Step 5: Create Authentication Components

#### 5.1 Create Login Component

Create `/src/app/modules/shared/auth/Login/index.tsx`:

```typescript
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../core/state/reducer/auth";
import { ROUTES } from "../../../core/constants/routes";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(loginUser({ email, password }));
      navigate(ROUTES.USER.dashboard.key);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
```

#### 5.2 Create Register Component

Create `/src/app/modules/shared/auth/Register/index.tsx`:

```typescript
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../core/constants/routes";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement registration logic here
    console.log("Registration data:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                name="firstName"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="lastName"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="confirmPassword"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Account
            </button>
          </div>

          <div className="text-center">
            <Link
              to={ROUTES.AUTH.login.key}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
```

### Step 6: Set Up Environment Configuration

#### 6.1 Create Environment Variables

Create `.env` file in your project root:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Coached Success App
```

#### 6.2 Create API Configuration

Create `/src/app/core/services/api.ts`:

```typescript
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const api = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: {
      login: "/auth/login",
      register: "/auth/register",
      me: "/auth/me",
    },
    users: "/users",
    organizations: "/organizations",
  },
};

export default api;
```

### Step 7: Create Test Data and Utilities

#### 7.1 Create Mock User Data

Create `/src/app/core/utils/mockData.ts`:

```typescript
export const mockUsers = {
  admin: {
    id: "1",
    attributes: {
      type: "admin",
      email: "admin@example.com",
      first_name: "Admin",
      last_name: "User",
    },
    relationships: {
      roles: [
        {
          attributes: { type: "admin" },
          relationships: {
            permissions: [
              { attributes: { name: "organization.update" } },
              { attributes: { name: "user.view" } },
              { attributes: { name: "user.update" } },
            ],
          },
        },
      ],
      user_gyms: [],
    },
  },
  user: {
    id: "2",
    attributes: {
      type: "user",
      email: "user@example.com",
      first_name: "Regular",
      last_name: "User",
    },
    relationships: {
      roles: [
        {
          attributes: { type: "user" },
          relationships: {
            permissions: [{ attributes: { name: "member.view" } }],
          },
        },
      ],
      user_gyms: [],
    },
  },
  staff: {
    id: "3",
    attributes: {
      type: "user",
      email: "staff@example.com",
      first_name: "Staff",
      last_name: "Member",
    },
    relationships: {
      roles: [
        {
          attributes: { type: "user" },
          relationships: {
            permissions: [
              { attributes: { name: "member.view" } },
              { attributes: { name: "member.create" } },
              { attributes: { name: "member.update" } },
            ],
          },
        },
      ],
      user_gyms: [{ id: "1" }],
    },
  },
};
```

#### 7.2 Create Test Utilities

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

### Step 8: Verify Setup

#### 8.1 Test Redux Store

Create a simple test to verify Redux is working:

```typescript
// In your test file
import { store } from "../core/state/store";
import { loginUser } from "../core/state/reducer/auth";

test("Redux store is configured correctly", () => {
  const state = store.getState();
  expect(state.auth).toBeDefined();
  expect(state.auth.user).toBeDefined();
  expect(state.auth.login).toBeDefined();
});
```

#### 8.2 Test Components

Create basic component tests:

```typescript
import { render, screen } from "../core/utils/testUtils";
import Loader from "../core/components/Loader";

test("Loader component renders", () => {
  render(<Loader />);
  expect(screen.getByRole("status")).toBeInTheDocument();
});
```

### Step 9: Final Verification Checklist

Before proceeding to implement AuthGuard and SidebarLayout, verify:

- [ ] All dependencies are installed
- [ ] Redux store is configured and working
- [ ] Auth reducer is properly set up
- [ ] All required components are created
- [ ] Context providers are set up
- [ ] Authentication components are functional
- [ ] Environment variables are configured
- [ ] Test utilities are working
- [ ] File structure matches the expected layout

Once all prerequisites are set up and verified, you can proceed to implement the
AuthGuard and SidebarLayout system following the main setup instructions.

## Step 1: Route Configuration

### 1.1 Create Route Constants

Create `/src/app/core/constants/routes.ts`:

```typescript
export const adminBasePath = "/admin";
export const authBasePath = "/auth";

export const ROUTES = {
  AUTH: {
    login: { key: authBasePath + "/" },
    register: { key: authBasePath + "/register" },
    register_with_otp: { key: authBasePath + "/register-with-otp" },
    forgot_password: { key: authBasePath + "/forgot-password" },
  },
  ADMIN: {
    dashboard: { key: adminBasePath + "/dashboard" },
    users: { key: adminBasePath + "/users" },
    organizations: { key: adminBasePath + "/organizations" },
    // ... other admin routes
  },
  USER: {
    dashboard: { key: "/dashboard" },
    members: { key: "/members" },
    leads: { key: "/leads" },
    // ... other user routes
  },
  SHARED: {
    profile: { key: "/profile" },
  },
};
```

### 1.2 Define Route Interface

Create `/src/app/core/interfaces/routes.interface.ts`:

```typescript
export type RouteItem = {
  name?: string;
  id: string;
  path: string;
  component: ({}: any) => any;
  guard?: any;
  role?: any;
  index?: boolean;
  userTypes?: UserTypes[];
  roles?: UserRoles[];
  permissions?: PermissionType[];
  icon?: React.ComponentType;
  iconActive?: React.ComponentType;
  hidden?: boolean;
  current?: boolean;
  isSecondaryItem?: boolean;
  props?: any;
};

export enum UserTypes {
  admin = "admin",
  user = "user",
}

export enum UserRoles {
  admin = "Admin",
  user = "User",
  staff = "Staff",
}

export enum PermissionType {
  ORGANIZATION_UPDATE = "organization.update",
  MEMBER_VIEW = "member.view",
  MEMBER_CREATE = "member.create",
  // ... other permissions
}
```

## Step 2: AuthGuard Implementation

### 2.1 Create AuthGuard Component

Create `/src/app/core/layouts/AuthGuard.tsx`:

```typescript
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import Loader from "../components/Loader";
import { UserRoles, UserTypes } from "../interfaces/routes.interface";
import { RootState } from "../state/reducer";
import { useSelector } from "react-redux";

const AuthGuard = ({ children, permissions, userTypes, roles }: any) => {
  const navigate = useNavigate();

  const {
    data: currentUser,
    loading: getUserLoading,
    success: getUserSuccess,
  } = useSelector((state: RootState) => state.auth.user);
  const { data: auth } = useSelector((state: RootState) => state.auth.login);

  const isAuthenticated = useMemo(() => {
    return (
      !getUserLoading && getUserSuccess && currentUser && auth?.access_token
    );
  }, [getUserLoading, currentUser, getUserSuccess, auth?.access_token]);

  useEffect(() => {
    if (!getUserLoading) {
      if (isAuthenticated) {
        // Check permissions
        const permissionsList =
          currentUser?.relationships?.roles?.[0]?.relationships?.permissions?.map(
            (permission) => permission?.attributes?.name
          );

        if (permissions && permissions.length > 0) {
          const checkIfHasPermission = permissions?.some(
            (permission: string) => {
              return permissionsList?.includes(permission);
            }
          );
          if (!checkIfHasPermission) {
            handleUserNavigation(currentUser?.attributes?.type as UserTypes);
          }
        }

        // Check roles
        if (roles?.length > 0) {
          if (currentUser?.relationships?.roles) {
            if (roles?.includes(UserRoles.admin)) {
              if (
                currentUser?.relationships?.roles[0].attributes.type === "admin"
              ) {
                return;
              }
            }

            if (roles?.includes(UserRoles.user)) {
              if (
                currentUser?.relationships?.roles[0].attributes.type ===
                  "user" &&
                !currentUser.relationships.user_gyms?.length
              ) {
                return;
              }
            }

            if (roles?.includes(UserRoles.staff)) {
              if (
                currentUser?.relationships?.roles[0].attributes.type ===
                  "user" &&
                currentUser.relationships.user_gyms?.length
              ) {
                return;
              }
            }
          }
          handleUserNavigation(currentUser?.attributes?.type as UserTypes);
        }
      } else {
        navigate(ROUTES.AUTH.login.key);
      }
    }
  }, [isAuthenticated, permissions]);

  const handleUserNavigation = (userType: UserTypes) => {
    if (userType === UserTypes.admin) {
      navigate(ROUTES.ADMIN.dashboard.key);
    }
    if (userType === UserTypes.user) {
      navigate(ROUTES.USER.dashboard.key);
    }
  };

  return (
    <>
      {getUserLoading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : (
        <> {children}</>
      )}
    </>
  );
};

export default AuthGuard;
```

## Step 3: SidebarLayout Setup

### 3.1 Create SidebarLayout Component

Create `/src/app/core/layouts/SidebarLayout.tsx`:

```typescript
import { useContext, useEffect, useState } from "react";
import { IMainNavigation } from "../interfaces/navigation.interface";
import { RightSideBarContext } from "../context/rightSideBar";
import { getUserNavigation } from "../../core/services/routes/index";
import SideBarItem from "../components/SideBarItem";
import Header from "../components/TopNavBar";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import { RootState } from "../state/reducer";
import ToggleSidebar from "../components/ToggleSidebar";
import ToggleReportsForm from "../../modules/organization/dashboard/ToggleReportsForm";
import { DashboardReportsToggleContext } from "../context/dashboardReportsToggle";
import { useLocation } from "react-router-dom";
import { ROUTES } from "../constants/routes";

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const { state: rightSideBarState } = useContext(RightSideBarContext);
  const { showToggleReports, setShowToggleReports } = useContext(
    DashboardReportsToggleContext
  );
  const { data: currentUser, loading: getUserLoading } = useSelector(
    (state: RootState) => state.auth.user
  );

  const location = useLocation();

  useEffect(() => {
    setShowToggleReports(false);
  }, [location.pathname]);

  const [navigation, setNavigation] = useState<IMainNavigation>({
    primary: [],
    secondary: [],
  });

  useEffect(() => {
    if (rightSideBarState?.refresh) {
      document.getElementById("rightSideDrawer")?.click();
    }
  }, [rightSideBarState?.refresh]);

  useEffect(() => {
    if (!getUserLoading && currentUser) {
      const permissionsList =
        currentUser?.relationships?.roles?.[0]?.relationships?.permissions?.map(
          (permission) => permission?.attributes?.name
        ) || [];

      const userType =
        currentUser?.relationships?.roles?.[0]?.attributes?.type || "";

      setNavigation(
        getUserNavigation(
          userType,
          permissionsList,
          currentUser?.relationships?.user_gyms?.length || 0
        ) as any
      );
    }
  }, [currentUser, getUserLoading]);

  return (
    <>
      <Header />
      <div
        className={`drawer xl:drawer-open z-10 ${
          location.pathname === ROUTES.USER.dashboard.key ? "static" : ""
        }`}
      >
        <input id="leftSideDrawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content h-screen w-full overflow-x-scroll">
          <section className="flex-1 w-full">
            {getUserLoading && (
              <div className="flex justify-center h-full">
                <Loader />
              </div>
            )}

            {!getUserLoading && (
              <div
                className={
                  location.pathname === ROUTES.USER.dashboard.key
                    ? "pl-6 pr-20"
                    : "px-6"
                }
              >
                {children}
              </div>
            )}
          </section>
        </div>
        <ToggleSidebar show={showToggleReports}>
          <ToggleReportsForm />
        </ToggleSidebar>
        <div className="drawer-side rounded-tr-xl shadow-lg text-secondary z-50">
          <label htmlFor="leftSideDrawer" className="drawer-overlay" />
          <nav className="bg-white space-y-2 overflow-y-auto w-80 md:w-72 text-base-content flex flex-col justify-between h-screen">
            <ul className="menu w-full">
              {navigation.primary.map((item, idx) => (
                <SideBarItem
                  icon={item.icon as any}
                  name={item?.name}
                  iconActive={item.iconActive}
                  path={item?.path}
                  key={idx}
                />
              ))}
            </ul>
            <ul className="menu mb-12">
              {navigation.secondary.map((item, idx) => (
                <SideBarItem
                  icon={item.icon}
                  name={item?.name}
                  iconActive={item.iconActive}
                  path={item?.path}
                  key={idx}
                />
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default SidebarLayout;
```

## Step 4: Navigation System

### 4.1 Create Route Files

Create route files for different user types:

**Auth Routes** (`/src/app/core/services/routes/auth-routes.ts`):

```typescript
import Login from "../../../modules/shared/auth/Login/index";
import Register from "../../../modules/shared/auth/Register/index";
import { RouteItem } from "../../../core/interfaces/routes.interface";
import { ROUTES } from "../../../core/constants/routes";

const login: RouteItem = {
  id: ROUTES.AUTH.login.key,
  path: ROUTES.AUTH.login.key,
  component: Login,
  index: true,
};

const register: RouteItem = {
  id: ROUTES.AUTH.register.key,
  path: ROUTES.AUTH.register.key,
  component: Register,
};

export const authRoutes: RouteItem[] = [login, register];
```

**User Routes** (`/src/app/core/services/routes/user-routes.ts`):

```typescript
import {
  RouteItem,
  UserRoles,
  UserTypes,
  PermissionType,
} from "../../interfaces/routes.interface";
import AuthGuard from "../../layouts/AuthGuard";
import OrganizationDashboard from "../../../modules/organization/dashboard";
import Members from "../../../modules/organization/members";
import { ROUTES } from "../../constants/routes";

const userTypes = [UserTypes.user];

export const overview: RouteItem = {
  name: "Dashboard",
  id: ROUTES.USER.dashboard.key,
  path: ROUTES.USER.dashboard.key,
  component: OrganizationDashboard,
  guard: AuthGuard,
  userTypes,
  roles: [UserRoles.user, UserRoles.staff],
  icon: ChartPieIcon,
  iconActive: ChartPieIconSolid,
};

export const members: RouteItem = {
  name: "Members",
  id: ROUTES.USER.members.key,
  path: ROUTES.USER.members.key,
  component: Members,
  guard: AuthGuard,
  userTypes,
  permissions: [PermissionType.MEMBER_VIEW],
  roles: [UserRoles.user, UserRoles.staff],
  icon: UserCircleIcon,
  iconActive: UserCircleIconSolid,
};

export const userRoutes: RouteItem[] = [
  overview,
  members,
  // ... other routes
];
```

**Admin Routes** (`/src/app/core/services/routes/admin-routes.ts`):

```typescript
import {
  RouteItem,
  UserRoles,
  UserTypes,
} from "../../interfaces/routes.interface";
import AuthGuard from "../../layouts/AuthGuard";
import AdminDashboard from "../../../modules/admin/dashboard";
import { ROUTES } from "../../constants/routes";

const userTypes = [UserTypes.admin];

export const overview: RouteItem = {
  name: "Dashboard",
  id: ROUTES.ADMIN.dashboard.key,
  path: ROUTES.ADMIN.dashboard.key,
  component: AdminDashboard,
  guard: AuthGuard,
  userTypes,
  roles: [UserRoles.admin],
  icon: ChartPieIcon,
  iconActive: ChartPieIconSolid,
};

export const adminRoutes: RouteItem[] = [
  overview,
  // ... other admin routes
];
```

### 4.2 Create Navigation Service

Create `/src/app/core/services/routes/index.ts`:

```typescript
import { IGym } from "../../interfaces/gyms.interface";
import { IRole } from "../../interfaces/roles.interface";
import { UserRoles } from "../../interfaces/routes.interface";
import { adminRoutes } from "./admin-routes";
import { userRoutes } from "./user-routes";

export const getUserNavigation = (
  type: string,
  permissionsList: string[],
  userGymsCount: number
) => {
  const adminSideBarPrimary = adminRoutes?.filter(
    (val) => !val.hidden && !val.isSecondaryItem
  );

  const adminSideBarSecondary = adminRoutes?.filter(
    (val) => !val.hidden && val.isSecondaryItem
  );

  const userSideBarItemsPrimary = userRoutes?.filter((val) => {
    if (val.hidden) return false;

    if (val.permissions && val.permissions?.length > 0) {
      const checkIfHasPermission = val?.permissions?.some(
        (permission: string) => {
          return permissionsList?.includes(permission);
        }
      );
      if (!checkIfHasPermission) return false;
    }

    if (val.roles?.includes(UserRoles.user)) {
      if (type === "user" && !userGymsCount) {
        return !val.isSecondaryItem;
      }
    }

    if (val.roles?.includes(UserRoles.staff)) {
      if (type === "user" && userGymsCount) {
        return !val.isSecondaryItem;
      }
    }

    return false;
  });

  const userSideBarItemsSecondary = userRoutes?.filter((val) => {
    if (val.hidden) return false;

    if (val.permissions && val.permissions?.length > 0) {
      const checkIfHasPermission = val?.permissions?.some(
        (permission: string) => {
          return permissionsList?.includes(permission);
        }
      );
      return !val.hidden && val.isSecondaryItem && checkIfHasPermission;
    }

    if (val.roles?.includes(UserRoles.user)) {
      if (type === "user" && !userGymsCount) {
        return val.isSecondaryItem;
      }
    }

    if (val.roles?.includes(UserRoles.staff)) {
      if (type === "user" && userGymsCount) {
        return val.isSecondaryItem;
      }
    }

    return false;
  });

  if (type === "admin") {
    return {
      primary: adminSideBarPrimary,
      secondary: adminSideBarSecondary,
    };
  } else {
    return {
      primary: userSideBarItemsPrimary,
      secondary: userSideBarItemsSecondary,
    };
  }
};
```

## Step 5: Route Integration

### 5.1 Create Main Routes Component

Create `/src/app/modules/routes.tsx`:

```typescript
import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "../core/layouts/AuthLayout";
import SidebarLayout from "../core/layouts/SidebarLayout";
import { RouteItem } from "../core/interfaces/routes.interface";
import { authRoutes } from "../core/services/routes/auth-routes";
import { adminRoutes } from "../core/services/routes/admin-routes";
import { userRoutes } from "../core/services/routes/user-routes";
import { sharedRoutes } from "../core/services/routes/shared-routes";

export type ChildRoutesProps = {
  Layout: any;
  routes: RouteItem[];
};

const childRoutes: FC<ChildRoutesProps> = ({ Layout, routes }): any => {
  return routes.map(
    (
      {
        component: Component,
        guard,
        path,
        index,
        roles,
        userTypes,
        props,
        permissions,
      },
      key
    ) => {
      const Guard = guard;

      return (
        <Route
          index={index}
          key={key}
          path={path}
          element={
            <Layout>
              {guard ? (
                <Guard
                  roles={roles}
                  userTypes={userTypes}
                  permissions={permissions}
                >
                  <Component {...props} />
                </Guard>
              ) : (
                <Component {...props} />
              )}
            </Layout>
          }
        />
      );
    }
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {childRoutes({
        routes: authRoutes,
        Layout: AuthLayout,
      })}
      {childRoutes({
        routes: userRoutes,
        Layout: SidebarLayout,
      })}
      {childRoutes({
        routes: adminRoutes,
        Layout: SidebarLayout,
      })}
      {childRoutes({
        routes: sharedRoutes,
        Layout: SidebarLayout,
      })}
      <Route path="/" element={<AuthLayout />} />
      <Route path="*" element={<AuthLayout />} />
    </Routes>
  );
};

export default AppRoutes;
```

### 5.2 Update App Component

Update `/src/app/app.tsx`:

```typescript
import { useEffect } from "react";
import { mapDispatchToProps } from "./core/state/reducer/auth";
import AppRoutes from "./modules/routes";
import { RootState } from "./core/state/store";
import { useSelector } from "react-redux";
import Loader from "../app/core/components/Loader";

const App = () => {
  const { getCurrentUser } = mapDispatchToProps();
  const { loading } = useSelector((state: RootState) => state.auth.user);
  const { data } = useSelector((state: RootState) => state.auth.login);

  useEffect(() => {
    if (!loading && data?.access_token) getCurrentUser();
  }, [data?.access_token]);

  return (
    <>
      {!loading && <AppRoutes />}
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      )}
    </>
  );
};

export default App;
```

## Step 6: Testing

### 6.1 Test Authentication Flow

1. **Test unauthenticated access**: Navigate to protected routes without login
2. **Test role-based access**: Login with different user types (admin, user,
   staff)
3. **Test permission-based access**: Verify users only see routes they have
   permissions for
4. **Test navigation**: Ensure sidebar updates based on user permissions

### 6.2 Test Route Protection

1. **Permission-based routes**: Test routes that require specific permissions
2. **Role-based routes**: Test routes that require specific roles
3. **User type routes**: Test routes that require specific user types
4. **Redirect behavior**: Verify proper redirects when access is denied

## Troubleshooting

### Common Issues

1. **Routes not loading**: Check if components are properly imported
2. **Sidebar not updating**: Verify `getUserNavigation` function is working
   correctly
3. **Permission errors**: Ensure permission names match exactly
4. **Role access issues**: Verify role types are correctly defined
5. **Navigation not working**: Check if routes are properly configured in the
   main routes file

### Debug Tips

1. **Console logs**: Add console.log statements in AuthGuard and SidebarLayout
2. **Redux DevTools**: Use Redux DevTools to inspect auth state
3. **Network tab**: Check API calls for user data and permissions
4. **Route testing**: Test individual route components in isolation

### Performance Considerations

1. **Lazy loading**: Implement lazy loading for route components
2. **Memoization**: Use React.memo for expensive components
3. **Route splitting**: Split routes by user type for better performance
4. **Permission caching**: Cache permission checks to avoid repeated API calls

## Additional Notes

- The system supports three user types: `admin`, `user`, and `staff`
- Permissions are granular and can be combined for complex access control
- The sidebar automatically updates based on user permissions and roles
- Routes can be hidden from navigation using the `hidden` property
- Secondary navigation items are supported for additional organization
- The system supports both role-based and permission-based access control

This setup provides a robust, scalable authentication and routing system that
can handle complex permission requirements while maintaining good performance
and user experience.
