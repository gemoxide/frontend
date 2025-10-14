import { Route, Routes } from "react-router-dom";
import AuthGuard from "./core/layout/AuthGuard";

import Login from "./modules/shared/auth/Login";
import Register from "./modules/shared/auth/Register";

import Admin from "./modules/admin";

const App = () => {
  return (
    <>
        <Routes>
            {/* <Route path="/" element={<Navigate to="/login" />} />
            <Route 
                path="/login" 
                element={
                    <AuthGuard>
                        <Login />
                    </AuthGuard>
                } />
            <Route
                path="/admin"
                element={
                    <AuthGuard>
                        <Admin />
                    </AuthGuard>
                }
            /> */}
            <Route element={<AuthGuard />}>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route path="/admin" element={<Admin />} />
        </Route>
        </Routes>
    </>
  );
};

export default App;