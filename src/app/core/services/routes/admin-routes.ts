import type { RouteItem } from "../../interfaces/routes.interface";
import { UserTypes } from "../../interfaces/routes.interface";
import AuthGuard from "../../layouts/AuthGuard";
import Admin from "../../../modules/admin";
import { ROUTES } from "../../constants/routes";
import { ForAdminComponent } from "../../components/TestNavigation";
import Clients from "../../../modules/admin/clients";
import Products from "../../../modules/admin/products";

const userTypes = [UserTypes.admin];

export const overview: RouteItem = {
  name: "Dashboard",
  id: ROUTES.ADMIN.dashboard.key,
  path: ROUTES.ADMIN.dashboard.key,
  component: Admin,
  guard: AuthGuard,
  userTypes,
  roles: ["Administrator"], // Use exact role name from API
};

export const testForAdmin: RouteItem = {
  name: "For Admin",
  id: "/test-for-admin",
  path: "/test-for-admin",
  component: ForAdminComponent,
  guard: AuthGuard,
  userTypes: [UserTypes.admin],
  roles: ["Administrator"], // Use exact role name from API
};

export const clients: RouteItem = {
  name: "Clients",
  id: ROUTES.ADMIN.clients.key,
  path: ROUTES.ADMIN.clients.key,
  component: Clients,
  guard: AuthGuard,
  userTypes,
  roles: ["Administrator"], // Use exact role name from API
};

export const products: RouteItem = {
  name: "Products",
  id: ROUTES.ADMIN.products.key,
  path: ROUTES.ADMIN.products.key,
  component: Products,
  guard: AuthGuard,
  userTypes,
  roles: ["Administrator"], // Use exact role name from API
};

export const adminRoutes: RouteItem[] = [
  overview, // Main admin dashboard route
  testForAdmin,
  clients,
  products,
  // ... other admin routes
];
