import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

type AuthGuardProps = {
  children: ReactNode;
};

const AuthGuard = ({ children }: AuthGuardProps) => {
    const { token } = useAuth();
    // const location = useLocation();

    // if (token && location.pathname !== "/login") {
    //     return <Navigate to="/admin" />;
    // }else if (!token && location.pathname !== "/login") {
    //     return <Navigate to="/login" />;
    // }
    if (!token) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default AuthGuard;
