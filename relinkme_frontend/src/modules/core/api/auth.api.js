// modules/core/api/auth.api.js
import axios from "@/services/axiosInstance";

// 🔐 Connexion
export const login = async (email, password) => {
  try {
    const response = await axios.post("/core/login/", {
      email,
      password
    }, {
      transformRequest: [(data, headers) => {
        delete headers.Authorization; // Pas de token pour la connexion
        return JSON.stringify(data);
      }],
    });
    
    // Stocker les tokens
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🚪 Déconnexion
export const logout = async () => {
  try {
    const refresh_token = localStorage.getItem('refresh_token');
    if (refresh_token) {
      await axios.post("/core/logout/", { refresh: refresh_token });
    }
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  } finally {
    // Nettoyer le localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
};

// 👤 Récupérer l'utilisateur connecté
export const getCurrentUser = async () => {
  const { data } = await axios.get("/core/me/");
  return data;
};

// 🔍 Vérifier si l'utilisateur est connecté
export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

// 📊 Récupérer les infos utilisateur depuis localStorage
export const getUserFromStorage = () => {
  const userString = localStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
};