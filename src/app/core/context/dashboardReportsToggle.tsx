import React, { createContext, useContext, useState, ReactNode } from "react";

interface DashboardReportsToggleContextType {
  showToggleReports: boolean;
  setShowToggleReports: (show: boolean) => void;
}

const DashboardReportsToggleContext = createContext<
  DashboardReportsToggleContextType | undefined
>(undefined);

export const DashboardReportsToggleProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [showToggleReports, setShowToggleReports] = useState(false);

  return (
    <DashboardReportsToggleContext.Provider
      value={{ showToggleReports, setShowToggleReports }}
    >
      {children}
    </DashboardReportsToggleContext.Provider>
  );
};

export const useDashboardReportsToggle = () => {
  const context = useContext(DashboardReportsToggleContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardReportsToggle must be used within a DashboardReportsToggleProvider"
    );
  }
  return context;
};

export { DashboardReportsToggleContext };
