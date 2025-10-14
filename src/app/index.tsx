import App from "./app";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./core/context/AuthContext";

const MainApp = () => {
  return (
    <AuthProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </AuthProvider>
    
  );
};

export default MainApp;