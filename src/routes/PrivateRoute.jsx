import { Navigate } from "react-router-dom";
import { getTokenData } from "../utils/tokenUtils";

export default function PrivateRoute({ children, allowedRoles = [] }) {
    const user = getTokenData();

    // 1. Si no hay usuario logueado, lo mandamos al login
    if (!user) {
        return <Navigate to="/administracion-login" replace />;
    }

    // 2. Si la ruta exige roles específicos, verificamos si el usuario los tiene
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role?.toUpperCase())) {
        return <Navigate to="/dashboard" replace />;
    }

    // 3. Si todo está bien, renderizamos el componente
    return children;
}