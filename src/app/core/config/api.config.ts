import { ENV_CONFIG } from "./environment";

// API Configuration
export const API_CONFIG = {
  BASE_URL: ENV_CONFIG.API_BASE_URL,
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      ME: "/auth/me",
      LOGOUT: "/auth/logout",
    },
    USERS: "/users",
    ORGANIZATIONS: "/organizations",
  },
} as const;

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Pre-built API URLs
export const API_URLS = {
  LOGIN: buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN),
  REGISTER: buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.REGISTER),
  ME: buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.ME),
  LOGOUT: buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGOUT),
} as const;
