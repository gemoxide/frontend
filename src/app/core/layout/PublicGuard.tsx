import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

type PublicGuardProps = {
  children: ReactNode;
};

const PublicGuard = ({ children }: PublicGuardProps) => {
    const { token } = useAuth();

    if (token) {
        return <Navigate to="/admin" />;
    }
    
    return children;
};

export default PublicGuard;
