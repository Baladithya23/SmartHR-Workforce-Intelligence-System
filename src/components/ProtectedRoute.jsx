import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wraps a route element.
 * - If not logged in → redirect to /login
 * - If requiredRole provided and user lacks it → redirect to /
 */
export default function ProtectedRoute({ children, requiredRole }) {
    const { token, hasRole } = useAuth();
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return <Navigate to="/" replace />;
    }

    return children;
}
