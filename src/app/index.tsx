import { useEffect, useState, useCallback, useRef } from "react";
import { mapDispatchToProps } from "./core/state/reducer/auth";
import AppRoutes from "./modules/routes";
import type { RootState } from "./core/state/store";
import { useSelector, useDispatch } from "react-redux";
import Loader from "./core/components/Loader";
import { RightSideBarProvider } from "./core/context/rightSideBar";
import { DashboardReportsToggleProvider } from "./core/context/dashboardReportsToggle";

const App = () => {
  const dispatch = useDispatch();
  const { getCurrentUser } = mapDispatchToProps(dispatch);
  const {
    loading,
    data: currentUser,
    success: userSuccess,
    error: userError,
  } = useSelector((state: RootState) => state.auth.user);
  const { data } = useSelector((state: RootState) => state.auth.login);
  const [isInitialized, setIsInitialized] = useState(false);
  const hasValidatedToken = useRef(false);

  const validateToken = useCallback(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  useEffect(() => {
    // Check for token in localStorage on app initialization
    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");

    console.log("App - Token exists:", !!token);
    console.log("App - Loading:", loading);
    console.log("App - Current user exists:", !!currentUser);
    console.log("App - User success:", userSuccess);
    console.log("App - Login data exists:", !!data?.access_token);

    // If we have a token but no user data, validate the token (only once)
    if (
      token &&
      !loading &&
      !currentUser &&
      !userSuccess &&
      !hasValidatedToken.current
    ) {
      console.log("App - Token found, validating token...");
      hasValidatedToken.current = true;
      validateToken();
    }
  }, [data?.access_token, loading, currentUser, userSuccess, validateToken]);

  // Set initialized when we have a definitive auth state
  useEffect(() => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");

    console.log("App - Initialization check:");
    console.log("  - Token exists:", !!token);
    console.log("  - Loading:", loading);
    console.log("  - Current user exists:", !!currentUser);
    console.log("  - User success:", userSuccess);
    console.log("  - User error:", userError);

    // Handle API call failure - clear invalid token
    if (userError && token) {
      console.log("App - API call failed, clearing invalid token...");
      localStorage.removeItem("token");
      localStorage.removeItem("access_token");
    }

    // Initialize if:
    // 1. We have user data (authenticated)
    // 2. We have no token (not authenticated)
    // 3. We're not loading (regardless of auth state)
    // 4. API call failed (token invalid/expired)
    if (
      (token && currentUser && userSuccess) || // Authenticated
      !token || // No token
      !loading || // Not loading
      userError // API call failed
    ) {
      console.log("App - Authentication state determined, initializing...");
      setIsInitialized(true);
    }
  }, [loading, currentUser, userSuccess, userError]);

  return (
    <div className="w-full min-h-screen">
      <RightSideBarProvider>
        <DashboardReportsToggleProvider>
          {isInitialized ? (
            <AppRoutes />
          ) : (
            <div className="flex justify-center items-center h-screen">
              <Loader />
            </div>
          )}
        </DashboardReportsToggleProvider>
      </RightSideBarProvider>
    </div>
  );
};

export default App;
