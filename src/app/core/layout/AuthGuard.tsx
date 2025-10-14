// import { type ReactNode } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

// type AuthGuardProps = {
//   children: ReactNode;
// };

// const AuthGuard = ({ children }: AuthGuardProps) => {
const AuthGuard = () => {
    const { token } = useAuth();
    const location = useLocation();

    // const isLoginPage = location.pathname === "/login";
    const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
    const isPublicPage = publicRoutes.some((path) => location.pathname.startsWith(path));

    // Case 1: User NOT logged in → block private pages
    if (!token && !isPublicPage) {
        return <Navigate to="/login" replace />;
    }

    // Case 2: User IS logged in → block login page
    if (token && isPublicPage) {
        return <Navigate to="/admin" replace />;
    }

    return <Outlet />;
};

export default AuthGuard;
