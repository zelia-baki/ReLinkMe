import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { adminRole, adminId, codeAdmin, name, email, isLoggedIn } = useAuth(); 

    if (!isLoggedIn) {
        return <Navigate to="/admin/login" replace />;
    }

    if (
        allowedRoles &&
        !allowedRoles.map(r => r.toLowerCase()).includes(adminRole?.toLowerCase())
    ) {
        return <Navigate to="/admin/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
