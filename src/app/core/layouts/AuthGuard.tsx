import { useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import Loader from "../components/Loader";
import { UserRoles, UserTypes } from "../interfaces/routes.interface";
import type { RootState } from "../state/store";
import { useSelector } from "react-redux";

interface AuthGuardProps {
  children: React.ReactNode;
  permissions?: string[];
  userTypes?: UserTypes[];
  roles?: (UserRoles | string)[];
}

const AuthGuard = ({ children, permissions, roles }: AuthGuardProps) => {
  const navigate = useNavigate();

  const {
    data: currentUser,
    loading: getUserLoading,
    success: getUserSuccess,
  } = useSelector((state: RootState) => state.auth.user);
  const { data: auth } = useSelector((state: RootState) => state.auth.login);

  const isAuthenticated = useMemo(() => {
    const hasToken = auth?.access_token || localStorage.getItem("token");
    const authenticated =
      !getUserLoading && getUserSuccess && currentUser && hasToken;

    console.log("AuthGuard - Authentication check:");
    console.log("  - getUserLoading:", getUserLoading);
    console.log("  - getUserSuccess:", getUserSuccess);
    console.log("  - currentUser exists:", !!currentUser);
    console.log("  - hasToken:", !!hasToken);
    console.log("  - isAuthenticated:", authenticated);

    return authenticated;
  }, [getUserLoading, currentUser, getUserSuccess, auth?.access_token]);

  const handleUserNavigation = useCallback(
    (userRole: string) => {
      console.log(
        "AuthGuard - handleUserNavigation called with role:",
        userRole
      );

      // Map API role names to user types
      if (userRole === "Administrator") {
        navigate(ROUTES.ADMIN.dashboard.key);
      } else if (userRole === "User" || userRole === "Staff") {
        navigate(ROUTES.USER.dashboard.key);
      } else {
        // Default fallback
        // navigate(ROUTES.USER.dashboard.key);
      }
    },
    [navigate]
  );

  useEffect(() => {
    console.log("AuthGuard - useEffect triggered");
    console.log("AuthGuard - getUserLoading:", getUserLoading);
    console.log("AuthGuard - isAuthenticated:", isAuthenticated);
    console.log("AuthGuard - currentUser:", currentUser);

    if (!getUserLoading) {
      if (isAuthenticated) {
        // Check permissions
        const permissionsList =
          currentUser?.relationships?.permissions?.map(
            (permission) => permission?.attributes?.name
          ) || [];

        if (permissions && permissions.length > 0) {
          const checkIfHasPermission = permissions?.some(
            (permission: string) => {
              return permissionsList?.includes(permission);
            }
          );
          if (!checkIfHasPermission) {
            const userRole =
              currentUser?.relationships?.roles?.[0]?.attributes?.name;
            handleUserNavigation(userRole || "User");
          }
        }

        // Check roles
        if (roles && roles.length > 0) {
          const userRole =
            currentUser?.relationships?.roles?.[0]?.attributes?.name;
          console.log("AuthGuard - User role:", userRole);
          console.log("AuthGuard - Required roles:", roles);

          if (userRole && roles.includes(userRole)) {
            console.log("AuthGuard - Role check passed");
            return;
          }

          console.log("AuthGuard - Role check failed, redirecting");
          handleUserNavigation(userRole || "User");
        } else {
          console.log("AuthGuard - No specific roles required, access granted");
        }
      } else {
        navigate(ROUTES.AUTH.login.key);
      }
    }
  }, [
    isAuthenticated,
    permissions,
    roles,
    currentUser,
    getUserLoading,
    handleUserNavigation,
    navigate,
  ]);

  return (
    <>
      {getUserLoading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : (
        <> {children}</>
      )}
    </>
  );
};

export default AuthGuard;
