import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Settings, Lock, Map, Zap, History, LogOut, Mail, UserCircle } from 'lucide-react';

// Mock user data and navigation links (replace with actual context/state data)
const MOCK_USER = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'super_admin', // For conditional logic example
};

const navLinks = [
    { name: 'Accueil', path: '/dashboard', icon: Home, roles: ['super_admin', 'admin_validation', 'admin_moderation'] },
    { name: 'Utilisateurs', path: '/admin/users', icon: Users, roles: ['super_admin', 'admin_validation'] },
    { name: 'Administrateurs', path: '/admin', icon: Settings, roles: ['super_admin'] },
    { name: 'Vérifications', path: '/admin/demande', icon: Lock, roles: ['super_admin', 'admin_validation'] },
    { name: 'Localisations', path: '/admin/localisation', icon: Map, roles: ['super_admin', 'admin_validation', 'admin_moderation'] },
    { name: 'Modérations', path: '/admin/signalement', icon: Zap, roles: ['super_admin', 'admin_moderation'] },
    { name: 'Historique', path: '/admin/historique', icon: History, roles: ['super_admin'] },
];

// Reusable styling function for NavLink
const getNavLinkClass = ({ isActive }) => 
    `flex items-center p-3 my-1 rounded-lg transition-colors duration-200 
     ${isActive 
        ? 'bg-blue-600 text-white shadow-lg' 
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
     }`;

const Menu = () => {
    const handleLogout = () => {
        console.log("Logout initiated for:", MOCK_USER.email);
    };

    return (
        <div className="flex flex-col h-screen w-64 bg-gray-800 text-white p-4 shadow-2xl fixed z-50">
            <div className="flex items-center justify-center h-16 mb-6">
                <span className="text-2xl font-extrabold text-blue-400 tracking-wider">APP-LOGO</span>
            </div>
            <NavLink 
                to="/profile"
                className="flex flex-col p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200 mb-6 cursor-pointer"
            >
                <div className="flex items-center">
                    <UserCircle className="w-8 h-8 text-blue-400 mr-3" />
                    <div className="truncate">
                        <p className="font-semibold text-sm">{MOCK_USER.name}</p>
                        <p className="text-xs text-gray-400 truncate">{MOCK_USER.email}</p>
                    </div>
                </div>
            </NavLink>

            <nav className="flex-grow">
                {navLinks.map((link) => {
                    const isAuthorized = link.roles.includes(MOCK_USER.role);

                    if (!isAuthorized) {
                        return null;
                    }

                    return (
                        <NavLink 
                            key={link.name} 
                            to={link.path}
                            className={getNavLinkClass}
                            end
                        >
                            <link.icon className="w-5 h-5 mr-3" />
                            <span className="font-medium">{link.name}</span>
                        </NavLink>
                    );
                })}
            </nav>

            
            <div className="mt-auto pt-4 border-t border-gray-700">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center p-3 rounded-lg text-red-400 bg-gray-700 hover:bg-red-800 hover:text-white transition-colors duration-200 font-medium"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Se déconnecter
                </button>
            </div>
        </div>
    );
};

export default Menu;