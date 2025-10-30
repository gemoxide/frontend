export const adminBasePath = "/admin";
export const authBasePath = "/auth";

export const ROUTES = {
  AUTH: {
    login: { key: "/login" },
    register: { key: "/register" },
    register_with_otp: { key: "/register-with-otp" },
    forgot_password: { key: "/forgot-password" },
  },
  ADMIN: {
    dashboard: { key: adminBasePath + "/dashboard" },
    users: { key: adminBasePath + "/users" },
    organizations: { key: adminBasePath + "/organizations" },
    analytics: { key: adminBasePath + "/analytics" },
    reports: { key: adminBasePath + "/reports" },
    settings: { key: adminBasePath + "/settings" },
    clients: { key: adminBasePath + "/clients" }, //localhost:3000/admin/clients
    products: { key: adminBasePath + "/products" }, //localhost:3000/admin/products
  },
  USER: {
    dashboard: { key: "/dashboard" }, //localhost:3000/dashboard
    members: { key: "/members" },
    leads: { key: "/leads" },
  },
  SHARED: {
    profile: { key: "/profile" },
  },
};
