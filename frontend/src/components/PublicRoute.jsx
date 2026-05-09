import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PublicRoute({ children }) {

    const { currentUser } = useContext(AuthContext);

    // Sudah login
    if (currentUser) {
        return (
        <Navigate
            to="/dashboard"
            replace
        />
        );
    }

    // Belum login
    return children;
}

export default PublicRoute;