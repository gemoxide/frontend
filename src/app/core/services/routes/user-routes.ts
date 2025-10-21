import React from "react";
import type { RouteItem } from "../../interfaces/routes.interface";
import { UserTypes, PermissionType } from "../../interfaces/routes.interface";
import AuthGuard from "../../layouts/AuthGuard";
import { ROUTES } from "../../constants/routes";
import { ForUserComponent } from "../../components/TestNavigation";

// Create a simple dashboard component for users
const UserDashboard = () => {
  return React.createElement(
    "div",
    { className: "p-6" },
    React.createElement(
      "h1",
      { className: "text-2xl font-bold" },
      "User Dashboard"
    ),
    React.createElement("p", null, "Welcome to your dashboard!")
  );
};

const userTypes = [UserTypes.user];

export const overview: RouteItem = {
  name: "Dashboard",
  id: ROUTES.USER.dashboard.key,
  path: ROUTES.USER.dashboard.key,
  component: UserDashboard,
  guard: AuthGuard,
  userTypes,
  roles: ["User", "Staff"], // Use exact role names from API
};

const MembersComponent = () => {
  return React.createElement("div", null, "Members Page");
};

export const members: RouteItem = {
  name: "Members",
  id: ROUTES.USER.members.key,
  path: ROUTES.USER.members.key,
  component: MembersComponent,
  guard: AuthGuard,
  userTypes,
  permissions: [PermissionType.MEMBER_VIEW],
  roles: ["User", "Staff"], // Use exact role names from API
};

// Test navigation items for users
export const testForUser: RouteItem = {
  name: "For User",
  id: "/test-for-user",
  path: "/test-for-user",
  component: ForUserComponent,
  guard: AuthGuard,
  userTypes: [UserTypes.user],
  roles: ["User"], // Use exact role name from API
};

export const userRoutes: RouteItem[] = [
  overview,
  members,
  testForUser,
  // ... other routes
];
