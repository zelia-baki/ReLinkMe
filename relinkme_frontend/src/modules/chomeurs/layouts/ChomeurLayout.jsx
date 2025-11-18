// modules/chomeurs/layouts/ChomeurLayout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  User, Award, TrendingUp, Send, Briefcase, 
  Coins, Settings, LogOut, Menu, X, Bell,
  Search, ChevronDown
} from 'lucide-react';
import { getMonProfil } from '@/modules/chomeurs/api/chomeur.api';
import { getInitials } from '@/modules/chomeurs/utils/helpers';

/**
 * 🏗️ Layout principal pour les pages Chômeur
 * Contient la navigation fixe en haut et sidebar
 */
export default function ChomeurLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [profil, setProfil] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Navigation items
  const navItems = [
    { 
      path: '/chomeur/profil', 
      label: 'Profil', 
      icon: User,
      description: 'Mon profil'
    },
    { 
      path: '/chomeur/competences', 
      label: 'Compétences', 
      icon: Award,
      description: 'Gérer mes compétences'
    },
    { 
      path: '/chomeur/exploits', 
      label: 'Portfolio', 
      icon: TrendingUp,
      description: 'Mes projets'
    },
    { 
      path: '/offres', 
      label: 'Offres', 
      icon: Briefcase,
      description: 'Parcourir les offres'
    },
    { 
      path: '/chomeur/candidatures', 
      label: 'Candidatures', 
      icon: Send,
      description: 'Suivre mes candidatures'
    }
  ];

  // Charger le profil au montage
  useEffect(() => {
    fetchProfil();
  }, []);

  const fetchProfil = async () => {
    try {
      const data = await getMonProfil();
      setProfil(data.profil);
    } catch (error) {
      console.error('Erreur chargement profil:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/connexion');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER FIXE EN HAUT */}
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Burger menu mobile */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {isSidebarOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>

              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate('/chomeur/profil')}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">JC</span>
                </div>
                <span className="hidden sm:block text-xl font-bold text-gray-800">JobConnect</span>
              </div>
            </div>

            {/* Navigation Desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                      ${active 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Actions à droite */}
            <div className="flex items-center gap-3">
              {/* Solde jetons */}
              <button
                onClick={() => navigate('/chomeur/jetons')}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                <Coins className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-semibold text-yellow-800">
                  {profil?.solde_jetons || 0}
                </span>
              </button>

              {/* Notifications */}
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Menu profil */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {getInitials(profil?.utilisateur?.nom_complet || 'User')}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                {/* Dropdown menu profil */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-800">
                        {profil?.utilisateur?.nom_complet || 'Utilisateur'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {profil?.utilisateur?.email}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        navigate('/chomeur/profil');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4" />
                      Mon profil
                    </button>

                    <button
                      onClick={() => {
                        navigate('/chomeur/parametres');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4" />
                      Paramètres
                    </button>

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SIDEBAR MOBILE (overlay) */}
      {isSidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>

          {/* Sidebar */}
          <aside className="fixed top-16 left-0 bottom-0 w-72 bg-white border-r border-gray-200 z-40 lg:hidden overflow-y-auto">
            <nav className="p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-start gap-3 p-3 rounded-lg transition-all
                      ${active 
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Solde jetons mobile */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  navigate('/chomeur/jetons');
                  setIsSidebarOpen(false);
                }}
                className="w-full flex items-center justify-between p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Coins className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-600">Solde jetons</p>
                    <p className="text-lg font-bold text-yellow-800">
                      {profil?.solde_jetons || 0}
                    </p>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 text-yellow-600 rotate-[-90deg]" />
              </button>
            </div>
          </aside>
        </>
      )}

      {/* CONTENU PRINCIPAL */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}