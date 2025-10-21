import React from "react";

interface ToggleSidebarProps {
  show: boolean;
  children: React.ReactNode;
}

const ToggleSidebar: React.FC<ToggleSidebarProps> = ({ show, children }) => {
  if (!show) return null;

  return (
    <div className="drawer-side">
      <label htmlFor="rightSideDrawer" className="drawer-overlay" />
      <div className="p-10 overflow-y-auto w-1/4 bg-base-100 text-base-content">
        {children}
      </div>
    </div>
  );
};

export default ToggleSidebar;
