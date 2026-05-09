import { useContext } from "react";

import { Navigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }) {

    const { currentUser } =
        useContext(AuthContext);

    // Belum login
    if (!currentUser) {
        return (
        <Navigate to="/" replace />
        );
    }

    // Sudah login
    return children;
}

export default ProtectedRoute;