import { useContext, useEffect, useState } from "react";
import type { IMainNavigation } from "../interfaces/navigation.interface";
import type { UserFromState } from "../interfaces/user.interface";
import { RightSideBarContext } from "../context/rightSideBar";
import { getUserNavigation } from "../services/routes";
import SideBarItem from "./SideBarItem";
import TopNavBar from "./TopNavBar";
import Loader from "./Loader";
import { useSelector } from "react-redux";
import type { RootState } from "../state/store";
import ToggleSidebar from "./ToggleSidebar";
import { DashboardReportsToggleContext } from "../context/dashboardReportsToggle";
import { useLocation } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import Logo from "./Logo";

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const rightSideBarContext = useContext(RightSideBarContext);
  const dashboardToggleContext = useContext(DashboardReportsToggleContext);

  const rightSideBarState = rightSideBarContext?.state;
  const showToggleReports = dashboardToggleContext?.showToggleReports || false;
  const { data: currentUser, loading: getUserLoading } = useSelector(
    (state: RootState) => state.auth.user
  );

  const location = useLocation();

  useEffect(() => {
    if (dashboardToggleContext?.setShowToggleReports) {
      dashboardToggleContext.setShowToggleReports(false);
    }
  }, [location.pathname, dashboardToggleContext]);

  const [navigation, setNavigation] = useState<IMainNavigation>({
    primary: [],
    secondary: [],
  });

  useEffect(() => {
    if (rightSideBarState?.refresh) {
      document.getElementById("rightSideDrawer")?.click();
    }
  }, [rightSideBarState?.refresh]);

  useEffect(() => {
    if (!getUserLoading && currentUser) {
      // Type assertion to access nested properties safely
      const user = currentUser as UserFromState;

      const permissionsList =
        user?.relationships?.roles?.[0]?.relationships?.permissions
          ?.map((permission) => permission.attributes.name)
          .filter((name): name is string => name !== undefined) || [];

      // Get the role name for role-based filtering
      const roleName = user?.relationships?.roles?.[0]?.attributes?.name || "";

      console.log("SidebarLayout - user:", user);
      console.log("SidebarLayout - roleName:", roleName);
      console.log("SidebarLayout - permissionsList:", permissionsList);

      setNavigation(
        getUserNavigation(
          permissionsList,
          roleName // Pass role name for role-based filtering
        ) as IMainNavigation
      );
    }
  }, [currentUser, getUserLoading]);

  return (
    <div className="flex h-screen">
      <div
        className={`drawer lg:drawer-open z-10 ${
          location.pathname === ROUTES.USER.dashboard.key ? "static" : ""
        }`}
        style={{ marginTop: 0 }}
      >
        <input id="leftSideDrawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content h-screen w-full overflow-x-scroll">
          <TopNavBar />
          <section className="flex-1 w-full">
            {getUserLoading && (
              <div className="flex justify-center h-full">
                <Loader />
              </div>
            )}

            {!getUserLoading && (
              <div
                className={
                  location.pathname === ROUTES.USER.dashboard.key
                    ? "pl-6 pr-20"
                    : "px-6"
                }
              >
                {children}
              </div>
            )}
          </section>
        </div>
        <ToggleSidebar show={showToggleReports}>
          <div>Toggle Reports Form</div>
        </ToggleSidebar>
        <div className="drawer-side shadow-lg text-secondary z-40">
          <label htmlFor="leftSideDrawer" className="drawer-overlay z-30" />
          <nav className="bg-white space-y-2 overflow-y-auto w-80 md:w-72 text-base-content flex flex-col justify-between h-screen">
            <div className="flex items-center p-4 border-b border-gray-200">
              <Logo size="md" className="mr-3" />
              <span className="text-lg font-bold text-gray-800">CCLPI</span>
            </div>
            <ul className="menu w-full">
              {navigation.primary.map((item, idx) => (
                <SideBarItem
                  icon={item.icon || (() => null)}
                  name={item?.name || ""}
                  iconActive={item.iconActive}
                  path={item?.path || ""}
                  key={idx}
                />
              ))}
            </ul>
            <ul className="menu mb-12">
              {navigation.secondary.map((item, idx) => (
                <SideBarItem
                  icon={item.icon || (() => null)}
                  name={item?.name || ""}
                  iconActive={item.iconActive}
                  path={item?.path || ""}
                  key={idx}
                />
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
