import { useEffect } from "react";
import { mapDispatchToProps } from "./core/state/reducer/auth";
import AppRoutes from "./modules/routes";
import type { RootState } from "./core/state/store";
import { useSelector } from "react-redux";
import Loader from "./core/components/Loader";
import { RightSideBarProvider } from "./core/context/rightSideBar";
import { DashboardReportsToggleProvider } from "./core/context/dashboardReportsToggle";

const App = () => {
  const { getCurrentUser } = mapDispatchToProps();
  const {
    loading,
    data: currentUser,
    success: userSuccess,
    initialized,
  } = useSelector((state: RootState) => state.auth.user);
  const { data } = useSelector((state: RootState) => state.auth.login);

  useEffect(() => {
    // Check for token in localStorage on app initialization
    const token = localStorage.getItem("token");

    console.log("App - Token exists:", !!token);
    console.log("App - Loading:", loading);
    console.log("App - Initialized:", initialized);
    console.log("App - Current user exists:", !!currentUser);
    console.log("App - User success:", userSuccess);
    console.log("App - Login data exists:", !!data?.access_token);

    // Always validate token on app initialization if it exists
    if (token && !loading && !initialized) {
      console.log("App - Token found, validating token for the first time...");
      getCurrentUser();
    } else if (token && !loading && initialized && !currentUser) {
      console.log(
        "App - Token exists but user fetch failed, user may need to login again"
      );
    } else if (currentUser && userSuccess) {
      console.log("App - User data exists and validated, skipping API call");
    } else if (!token) {
      console.log("App - No token found");
    } else if (loading) {
      console.log("App - Still loading user data...");
    }
  }, [
    data?.access_token,
    loading,
    getCurrentUser,
    currentUser,
    userSuccess,
    initialized,
  ]);

  return (
    <div className="w-full min-h-screen">
      <RightSideBarProvider>
        <DashboardReportsToggleProvider>
          {!loading && <AppRoutes />}
          {loading && (
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
