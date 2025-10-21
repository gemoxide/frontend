import React, { createContext, useContext, useState, ReactNode } from "react";

interface RightSideBarContextType {
  state: {
    component: ReactNode;
    refresh: boolean;
  };
  setState: (state: { component: ReactNode; refresh: boolean }) => void;
}

const RightSideBarContext = createContext<RightSideBarContextType | undefined>(
  undefined
);

export const RightSideBarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<{
    component: ReactNode;
    refresh: boolean;
  }>({
    component: null,
    refresh: false,
  });

  return (
    <RightSideBarContext.Provider value={{ state, setState }}>
      {children}
    </RightSideBarContext.Provider>
  );
};

export const useRightSideBar = () => {
  const context = useContext(RightSideBarContext);
  if (context === undefined) {
    throw new Error(
      "useRightSideBar must be used within a RightSideBarProvider"
    );
  }
  return context;
};

export { RightSideBarContext };
