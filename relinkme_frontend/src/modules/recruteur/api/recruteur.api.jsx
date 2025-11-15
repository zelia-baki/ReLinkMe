// modules/recruteur/api/recruteur.api.js
import axios from "@/services/axiosInstance";

/**
 * 🆕 Inscription d'un nouveau recruteur (sans authentification)
 */
export const inscriptionRecruteur = async (formData) => {
  try {
    // Utilise une instance axios sans token pour l'inscription
    const response = await axios.post("/recruteur/inscription/", formData, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Pas d'autorisation requise pour l'inscription
      transformRequest: [(data, headers) => {
        delete headers.Authorization;
        return JSON.stringify(data);
      }],
    });
    return response.data;
  } catch (error) {
    console.error("❌ Erreur inscription recruteur:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Récupère le profil du recruteur connecté
 */
export const getRecruteurProfile = async () => {
  try {
    const response = await axios.get("/recruteur/recruteurs/me/");
    return response.data;
  } catch (error) {
    console.error("❌ Erreur récupération profil:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 Récupère tous les recruteurs
 */
export const getAllRecruteurs = async () => {
  const { data } = await axios.get("/recruteur/recruteurs/");
  return data;
};

/**
 * 🔹 Récupère un recruteur par ID
 */
export const getRecruteurById = async (id) => {
  const { data } = await axios.get(`/recruteur/recruteurs/${id}/`);
  return data;
};

/**
 * Met à jour le profil du recruteur
 */
export const updateRecruteur = async (id, data) => {
  try {
    const response = await axios.patch(`/recruteur/recruteurs/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur mise à jour recruteur:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 Supprime un recruteur
 */
export const deleteRecruteur = async (id) => {
  const { data } = await axios.delete(`/recruteur/recruteurs/${id}/`);
  return data;
};

export default {
  inscriptionRecruteur,
  getRecruteurProfile,
  getAllRecruteurs,
  getRecruteurById,
  updateRecruteur,
  deleteRecruteur,
};