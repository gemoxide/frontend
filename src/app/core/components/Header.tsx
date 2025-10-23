import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../state/reducer/auth";
import type { RootState } from "../state/store";
import type { AppDispatch } from "../state/store";

interface HeaderProps {
  title?: string;
  showLogout?: boolean;
}

const Header = ({
  title = "Admin Dashboard",
  showLogout = true,
}: HeaderProps) => {
  const { data: user } = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex items-center space-x-3">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Logo"
          />
          <span className="text-2xl font-semibold text-gray-900 dark:text-white">
            {title}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Welcome, {user.attributes?.name || user.attributes?.email}
            </span>
          )}
          {showLogout && (
            <button
              onClick={handleLogout}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
