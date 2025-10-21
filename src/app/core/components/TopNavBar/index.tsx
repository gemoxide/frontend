import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../state/store";
import type { UserFromState } from "../../interfaces/user.interface";
import { logout } from "../../state/reducer/auth";
import { ROUTES } from "../../constants/routes";
import type { AppDispatch } from "../../state/store";

const TopNavBar = () => {
  const { data: currentUser } = useSelector(
    (state: RootState) => state.auth.user
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = currentUser as UserFromState | null;

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.AUTH.login.key);
  };

  return (
    <div className="navbar bg-base-100 shadow-sm w-full min-h-[4rem] z-[60] relative border-b border-gray-200">
      <div className="navbar-start flex-1">
        <label
          htmlFor="leftSideDrawer"
          className="btn btn-square btn-ghost lg:hidden"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </label>
      </div>
      <div className="navbar-end flex-none gap-2">
        {user && (
          <div className="hidden md:flex items-center px-2">
            <span className="text-sm text-gray-600 font-medium">
              Welcome, {user.attributes.name}
            </span>
          </div>
        )}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-lg">
              {user?.attributes?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[100] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a onClick={handleLogout} className="cursor-pointer">
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TopNavBar;
