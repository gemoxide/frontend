import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./modules/shared/auth/Login";
import Admin from "./modules/admin";
import AuthGuard from "./core/layout/AuthGuard";

const App = () => {
  return (
    <>
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route
                path="/admin"
                element={
                    <AuthGuard>
                        <Admin />
                    </AuthGuard>
                }
            />
        </Routes>
    </>
  );
};

export default App;