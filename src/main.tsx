import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./app/core/state/store";
import CustomPersistGate from "./app/core/components/PersistGate";
import "./index.css";
import AppRoot from "./app/index.tsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <CustomPersistGate>
        <BrowserRouter>
          <ToastContainer />
          <AppRoot />
          <ToastContainer />
        </BrowserRouter>
      </CustomPersistGate>
    </Provider>
  </StrictMode>
);
