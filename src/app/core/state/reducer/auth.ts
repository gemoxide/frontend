import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_URLS } from "../../config/api.config";
import type {
  LoginResponse,
  UserFromState,
} from "../../interfaces/user.interface";

// Define the auth state interface
interface AuthState {
  user: {
    data: UserFromState | null;
    loading: boolean;
    success: boolean;
    error: string | null;
    initialized: boolean; // Track if we've attempted to fetch user data on app start
  };
  login: {
    data: LoginResponse | null;
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
    initialized: false,
  },
  login: {
    data: null,
    loading: false,
    success: false,
    error: null,
  },
};

// Create async thunks for API calls
export const loginUser = createAsyncThunk<
  LoginResponse,
  { email: string; password: string }
>(
  "auth/loginUser",
  async (credentials: { email: string; password: string }) => {
    const response = await fetch(API_URLS.LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<LoginResponse>;
  }
);

export const getCurrentUser = createAsyncThunk<UserFromState, void>(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      const response = await fetch(API_URLS.ME, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        // If token is invalid, clear it from localStorage
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("access_token");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // The API returns { data: { ...user } }, so we need to extract the data
      return result.data as UserFromState;
    } catch (error) {
      console.error("getCurrentUser error:", error);
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
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
      localStorage.removeItem("token");
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
        // Store token with consistent key
        localStorage.setItem("token", action.payload.access_token);
        localStorage.setItem("access_token", action.payload.access_token);
        // Set user data from login response
        state.user.data = action.payload.user;
        state.user.success = true;
        state.user.loading = false;
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
        state.user.initialized = true; // Mark as initialized when we start fetching
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user.loading = false;
        state.user.success = true;
        state.user.data = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.user.loading = false;
        state.user.error = action.error.message || "Failed to get user data";
        // Clear user data if token is invalid
        if (
          action.error.message?.includes("401") ||
          action.error.message?.includes("No token found")
        ) {
          state.user.data = null;
          state.login.data = null;
        }
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
