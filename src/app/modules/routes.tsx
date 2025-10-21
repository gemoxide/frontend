import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "../core/layouts/AuthLayout";
import SidebarLayout from "../core/components/SidebarLayout";
import NotFound from "../core/components/NotFound";
import RouteHandler from "../core/components/RouteHandler";
import type { RouteItem } from "../core/interfaces/routes.interface";
import { authRoutes } from "../core/services/routes/auth-routes";
import { adminRoutes } from "../core/services/routes/admin-routes";
import { userRoutes } from "../core/services/routes/user-routes";
import { sharedRoutes } from "../core/services/routes/shared-routes";

export type ChildRoutesProps = {
  Layout: React.ComponentType<{ children: React.ReactNode }>;
  routes: RouteItem[];
};

const childRoutes = ({ Layout, routes }: ChildRoutesProps) => {
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
      return (
        <Route
          index={index}
          key={key}
          path={path}
          element={
            <Layout>
              {guard
                ? React.createElement(guard, {
                    roles,
                    userTypes,
                    permissions,
                    children: React.createElement(Component, props),
                  })
                : React.createElement(Component, props)}
            </Layout>
          }
        />
      );
    }
  );
};

const AppRoutes = () => {
  return (
    <RouteHandler>
      <Routes>
        <Route
          path="/"
          element={
            <AuthLayout>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Welcome to CCLPI
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    Your comprehensive management platform
                  </p>
                  <div className="space-x-4">
                    <a
                      href="/login"
                      className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Sign In
                    </a>
                    <a
                      href="/register"
                      className="inline-block px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Sign Up
                    </a>
                  </div>
                </div>
              </div>
            </AuthLayout>
          }
        />
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
        <Route
          path="/test"
          element={
            <AuthLayout>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Test Page
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    This is a test route to verify routing is working.
                  </p>
                </div>
              </div>
            </AuthLayout>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </RouteHandler>
  );
};

export default AppRoutes;
