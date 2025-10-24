import React, { useEffect, useState } from "react";
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
  const [isInitialized, setIsInitialized] = useState(false);

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

  // Initialize after first render to allow Redux state to rehydrate
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

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

    // Don't redirect if still loading - wait for App component to complete authentication
    if (getUserLoading) {
      console.log("RouteHandler - Still loading, waiting for App component...");
      return;
    }

    // Only redirect if we're certain the user is not authenticated
    // (no token AND no user data AND not loading)
    const token = localStorage.getItem("token");
    if (!token && !currentUser && !getUserLoading) {
      console.log(
        "RouteHandler - No token and no user data, redirecting to login"
      );
      // Redirect to login but preserve the intended destination
      const redirectUrl = encodeURIComponent(path);
      navigate(`${ROUTES.AUTH.login.key}?redirect=${redirectUrl}`, {
        replace: true,
      });
    }
  }, [
    isInitialized,
    isAuthenticated,
    getUserLoading,
    location.pathname,
    navigate,
    currentUser,
    userSuccess,
    auth,
  ]);

  // Always render children - let individual route guards handle protection
  return <>{children}</>;
};

export default RouteHandler;
