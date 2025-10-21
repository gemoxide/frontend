import Login from "../../../modules/shared/auth/Login/index";
import Register from "../../../modules/shared/auth/Register/index";
import type { RouteItem } from "../../../core/interfaces/routes.interface";
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
