// modules/recruteur/api/recruteur.api.js
import axios from "@/services/axiosInstance";

/**
 * 🆕 Inscription d'un nouveau recruteur (sans authentification)
 */
export const inscriptionRecruteur = async (formData) => {
  try {
    const response = await axios.post("/recruteur/inscription/", formData, {
      headers: {
        'Content-Type': 'application/json',
      },
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
 * 📋 Récupère le profil du recruteur connecté
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
 * 📋 Récupère tous les recruteurs
 */
export const getAllRecruteurs = async () => {
  try {
    const response = await axios.get("/recruteur/recruteurs/");
    return response.data;
  } catch (error) {
    console.error("❌ Erreur récupération recruteurs:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔍 Récupère un recruteur par ID
 */
export const getRecruteurById = async (id) => {
  try {
    const response = await axios.get(`/recruteur/recruteurs/${id}/`);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur récupération recruteur:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * ✏️ Met à jour le profil du recruteur
 */
export const updateRecruteur = async (id, updateData) => {
  try {
    const response = await axios.patch(`/recruteur/recruteurs/${id}/`, updateData);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur mise à jour recruteur:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🗑️ Supprime un recruteur
 */
export const deleteRecruteur = async (id) => {
  try {
    const response = await axios.delete(`/recruteur/recruteurs/${id}/`);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur suppression recruteur:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 👤 Récupère le profil complet du recruteur connecté
 */
export const getMonProfilRecruteur = async () => {
  try {
    const response = await axios.get("/recruteur/recruteurs/me/");
    return response.data;
  } catch (error) {
    console.error("❌ Erreur récupération profil recruteur:", error.response?.data || error.message);
    throw error;
  }
};