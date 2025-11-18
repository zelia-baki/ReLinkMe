import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const [adminRole,setAdminRole] = useState(null);
    const [adminId,setAdminId] = useState(0);
    const [codeAdmin,setCodeAdmin] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [name,setAdminName] = useState(null);
    const [email,setAdminEmail] = useState(null);

    const ROLES = {
        SUPER_ADMIN: "super_admin",
        ADMIN_VALIDATION: 'admin_validation',
        ADMIN_MODERATION: 'admin_moderation'
    }

    const login = (role,id,code,nom,email) => {
        setAdminRole(role);
        setAdminId(id);
        setCodeAdmin(code);
        setAdminName(nom);
        setAdminEmail(email);
        setIsLoggedIn(true);
    }

    const logout = () => {
        setAdminRole(null);
        setAdminId(0);
        setCodeAdmin(null);
        setAdminName(null);
        setAdminEmail(null);
        setIsLoggedIn(false);
    }

    const value = {
        adminRole,
        adminId,
        codeAdmin,
        name,
        email,
        isLoggedIn,
        login,
        logout,
        ROLES
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}