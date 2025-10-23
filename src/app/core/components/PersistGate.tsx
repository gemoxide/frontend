import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "../state/store";
import Loader from "./Loader";

interface CustomPersistGateProps {
  children: React.ReactNode;
}

const CustomPersistGate: React.FC<CustomPersistGateProps> = ({ children }) => {
  return (
    <PersistGate loading={<Loader />} persistor={persistor}>
      {children}
    </PersistGate>
  );
};

export default CustomPersistGate;
