import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Menu from "../common/Menu";
import { AuthService } from "../../services/api/authService";

function ProtectedRoute({ children }) {
    const authService = new AuthService();
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        authService.isAuthenticated().then(setIsAuthorized);
    }, []);

    if (isAuthorized === null) return <div></div>;

    return isAuthorized ? (
        <div>
            <Menu />
            <div className="p-2">{children}</div>
        </div>
    ) : (
        <Navigate to="/login" />
    );
}

export default ProtectedRoute;