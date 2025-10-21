import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../state/store";
import { ROUTES } from "../constants/routes";

interface RouteHandlerProps {
  children: React.ReactNode;
}

const RouteHandler: React.FC<RouteHandlerProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get authentication state
  const {
    data: currentUser,
    loading: getUserLoading,
    success: userSuccess,
  } = useSelector((state: RootState) => state.auth.user);
  const { data: auth } = useSelector((state: RootState) => state.auth.login);

  // Check if user is authenticated
  const isAuthenticated =
    currentUser &&
    userSuccess &&
    (auth?.access_token || localStorage.getItem("token"));

  useEffect(() => {
    console.log("RouteHandler - Path:", location.pathname);
    console.log("RouteHandler - IsAuthenticated:", isAuthenticated);
    console.log("RouteHandler - Loading:", getUserLoading);
    console.log("RouteHandler - UserSuccess:", userSuccess);
    console.log("RouteHandler - CurrentUser:", currentUser);
    console.log("RouteHandler - Auth data:", auth);
    console.log(
      "RouteHandler - Token in localStorage:",
      localStorage.getItem("token")
    );

    // Don't redirect if still loading
    if (getUserLoading) {
      console.log("RouteHandler - Still loading, waiting...");
      return;
    }

    const path = location.pathname;

    // Public routes that don't require authentication
    const publicRoutes = [
      ROUTES.AUTH.login.key,
      ROUTES.AUTH.register.key,
      ROUTES.AUTH.forgot_password.key,
      "/",
    ];

    console.log("RouteHandler - Public routes:", publicRoutes);
    console.log("RouteHandler - Is public route:", publicRoutes.includes(path));

    // If accessing a public route, allow it
    if (publicRoutes.includes(path)) {
      console.log("RouteHandler - Allowing public route");
      return;
    }

    // Check if there's a token in localStorage but no user data yet
    const token = localStorage.getItem("token");
    if (token && !currentUser && !getUserLoading) {
      console.log(
        "RouteHandler - Token exists but no user data, waiting for user fetch..."
      );
      return; // Wait for the App component to fetch user data
    }

    // If user is not authenticated and trying to access protected route
    if (!isAuthenticated && !token) {
      console.log("RouteHandler - No token found, redirecting to login");
      // Redirect to login but preserve the intended destination
      const redirectUrl = encodeURIComponent(path);
      navigate(`${ROUTES.AUTH.login.key}?redirect=${redirectUrl}`, {
        replace: true,
      });
    } else if (token && !isAuthenticated && !getUserLoading) {
      console.log(
        "RouteHandler - Token exists but authentication failed, redirecting to login"
      );
      // Token exists but authentication failed (token expired/invalid)
      const redirectUrl = encodeURIComponent(path);
      navigate(`${ROUTES.AUTH.login.key}?redirect=${redirectUrl}`, {
        replace: true,
      });
    }
  }, [
    isAuthenticated,
    getUserLoading,
    location.pathname,
    navigate,
    currentUser,
    userSuccess,
  ]);

  // Always render children - let individual route guards handle protection
  return <>{children}</>;
};

export default RouteHandler;
