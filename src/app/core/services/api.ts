const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

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
