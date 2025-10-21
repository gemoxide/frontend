import React from "react";
import type { RouteItem } from "../../interfaces/routes.interface";
import { ROUTES } from "../../constants/routes";

const ProfileComponent = () => {
  return React.createElement("div", null, "Profile Page");
};

const profile: RouteItem = {
  name: "Profile",
  id: ROUTES.SHARED.profile.key,
  path: ROUTES.SHARED.profile.key,
  component: ProfileComponent,
  isSecondaryItem: true,
};

export const sharedRoutes: RouteItem[] = [profile];
