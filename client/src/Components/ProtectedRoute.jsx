import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";
import React from "react";
export default function ProtectedRoute() {
    const token = localStorage.getItem("token");
    const location = useLocation();

    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location.pathname,
                }}
            />
        );
    }

    return <Outlet />;
}