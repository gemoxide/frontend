import { adminRoutes } from "./admin-routes";
import { userRoutes } from "./user-routes";

export const getUserNavigation = (
  permissionsList: string[],
  userRole?: string
) => {
  console.log("getUserNavigation - userRole:", userRole);
  console.log("getUserNavigation - permissionsList:", permissionsList);

  // Combine all routes and filter based on user type and role
  const allRoutes = [...userRoutes, ...adminRoutes];
  console.log(
    "getUserNavigation - allRoutes:",
    allRoutes.map((r) => ({ name: r.name, roles: r.roles }))
  );

  const primaryItems = allRoutes?.filter((val) => {
    if (val.hidden || val.isSecondaryItem) return false;

    console.log(
      `Checking route: ${val.name}, roles: ${val.roles}, userRole: ${userRole}`
    );

    // Check role-based visibility
    if (val.roles && val.roles.length > 0) {
      const hasRole = val.roles.includes(userRole as any);
      console.log(`Route ${val.name} has role ${userRole}: ${hasRole}`);
      if (userRole && !hasRole) {
        return false;
      }
    }

    // Check permissions
    if (val.permissions && val.permissions?.length > 0) {
      const checkIfHasPermission = val?.permissions?.some(
        (permission: string) => {
          return permissionsList?.includes(permission);
        }
      );
      if (!checkIfHasPermission) return false;
    }

    return true;
  });

  console.log(
    "getUserNavigation - primaryItems:",
    primaryItems.map((r) => r.name)
  );

  const secondaryItems = allRoutes?.filter((val) => {
    if (val.hidden || !val.isSecondaryItem) return false;

    // Check role-based visibility
    if (val.roles && val.roles.length > 0) {
      if (userRole && !val.roles.includes(userRole as any)) {
        return false;
      }
    }

    // Check permissions
    if (val.permissions && val.permissions?.length > 0) {
      const checkIfHasPermission = val?.permissions?.some(
        (permission: string) => {
          return permissionsList?.includes(permission);
        }
      );
      if (!checkIfHasPermission) return false;
    }

    return true;
  });

  return {
    primary: primaryItems,
    secondary: secondaryItems,
  };
};
