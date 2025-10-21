import React from "react";
import { NavLink } from "react-router-dom";

interface SideBarItemProps {
  icon: React.ComponentType<any>;
  name: string;
  path: string;
  iconActive?: React.ComponentType<any>;
}

const SideBarItem: React.FC<SideBarItemProps> = ({
  icon: Icon,
  name,
  path,
  iconActive: IconActive,
}) => {
  return (
    <li>
      <NavLink
        to={path}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive
              ? "bg-primary text-primary-content"
              : "text-gray-700 hover:bg-gray-100"
          }`
        }
      >
        {({ isActive }) => (
          <>
            {isActive && IconActive ? (
              <IconActive className="w-5 h-5" />
            ) : (
              <Icon className="w-5 h-5" />
            )}
            <span>{name}</span>
          </>
        )}
      </NavLink>
    </li>
  );
};

export default SideBarItem;
