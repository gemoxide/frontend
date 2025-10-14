import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./modules/shared/auth/Login";
import Admin from "./modules/admin";
import AuthGuard from "./core/layout/AuthGuard";
import PublicGuard from "./core/layout/PublicGuard";

const App = () => {
  return (
    <>
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route 
                path="/login" 
                element={
                    <PublicGuard>
                        <Login />
                    </PublicGuard>
                } />
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