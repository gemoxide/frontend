import { useAuth } from "../../core/context/useAuth";
import { useNavigate } from "react-router-dom";

const Admin = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const goToNavigationPage = () => {
        navigate("/navigation");
    };
    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    return (
        <div>
            <h1 className="text-2xl font-bold">
                Welcome to Admin Dashboard
            </h1>
            <button className="btn btn-sm" onClick={goToNavigationPage}>
                Go to Navigation
            </button>
            <button className="btn btn-sm" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default Admin;