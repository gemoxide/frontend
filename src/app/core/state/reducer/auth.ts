import { createSlice } from "@reduxjs/toolkit";
import { bindActionCreators } from "redux";
import type { Dispatch } from "redux";
import type { AuthState, LoginPayload } from "../types";

const initialState: AuthState = {
  login: {
    data: {
      access_token: "",
      expires_in: 0,
      token_type: "",
      user: undefined,
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
  logout: {
    data: undefined,
    loading: false,
    success: false,
    error: false,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login Actions
    login(state) {
      state.login = {
        data: undefined,
        loading: true,
        success: false,
        error: false,
      };
    },
    loginRequest(state) {
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
      // Store token in localStorage
      if (actions.payload.access_token) {
        localStorage.setItem("access_token", actions.payload.access_token);
        localStorage.setItem("token", actions.payload.access_token);
      }
      // Store user data if available
      if (actions.payload.user) {
        state.user = {
          data: actions.payload.user,
          loading: false,
          success: true,
          error: false,
        };
      }
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

    // Logout Actions
    logout(state) {
      state.logout = {
        data: undefined,
        loading: true,
        success: false,
        error: false,
      };
    },
    logoutSuccess(state) {
      state.logout = {
        data: true,
        loading: false,
        success: true,
        error: false,
      };
      // Clear user and login data
      state.user = {
        data: undefined,
        loading: false,
        success: false,
        error: false,
      };
      state.login = {
        data: {
          access_token: "",
          expires_in: 0,
          token_type: "",
          user: undefined,
        },
        loading: false,
        success: false,
        error: false,
      };
      // Clear localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("token");
    },
    logoutFailure(state) {
      state.logout = {
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
  loginRequest,
  loginFailure,
  loginSuccess,
  getCurrentUser,
  getCurrentUserSuccess,
  getCurrentUserFailure,
  logout,
  logoutSuccess,
  logoutFailure,
} = authSlice.actions;

// Create a custom action creator for login request
export const loginRequestAction = (payload: LoginPayload) => ({
  type: loginRequest.type,
  payload,
});

// Export action creators for useDispatch
export const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      login,
      getCurrentUser,
      logout,
    },
    dispatch
  );
};

export default authSlice.reducer;
