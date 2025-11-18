import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { isLoggedIn, userRole } = useAuth();

    if (!isLoggedIn) {
        return <Navigate to="/admin/login" replace />;
    }

    if (
        allowedRoles &&
        !allowedRoles.map(r => r.toLowerCase()).includes(userRole?.toLowerCase())
    ) {
        return <Navigate to="/admin/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
