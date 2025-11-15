// modules/offres/api/offres.api.js
import axios from "@/services/axiosInstance";

/**
 * 📝 Publier une nouvelle offre (recruteur authentifié)
 */
export const publierOffre = async (offreData) => {
  try {
    const response = await axios.post("/recruteur/offres/", offreData);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur publication offre:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 📋 Récupère toutes les offres du recruteur connecté
 * (Pour la page MesOffres - recruteur voit SEULEMENT ses offres)
 */
export const getMesOffres = async () => {
  try {
    const response = await axios.get("/recruteur/offres/");
    return response.data;
  } catch (error) {
    console.error("❌ Erreur récupération offres:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🌐 Récupère toutes les offres publiques actives
 * (Pour la page ListeOffres - candidats voient TOUTES les offres)
 */
export const getOffresPubliques = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`/recruteur/offres/publiques/?${params}`);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur récupération offres publiques:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔍 Récupère une offre par ID (tout le monde peut voir une offre active)
 */
export const getOffreById = async (id) => {
  try {
    const response = await axios.get(`/recruteur/offres/${id}/`);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur récupération offre:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * ✏️ Met à jour une offre (SEULEMENT le propriétaire)
 */
export const updateOffre = async (id, offreData) => {
  try {
    const response = await axios.patch(`/recruteur/offres/${id}/`, offreData);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur mise à jour offre:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🗑️ Supprime une offre (SEULEMENT le propriétaire)
 */
export const deleteOffre = async (id) => {
  try {
    const response = await axios.delete(`/recruteur/offres/${id}/`);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur suppression offre:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔐 Vérifie si l'utilisateur connecté est un recruteur
 */
export const checkIsRecruteur = async () => {
  try {
    const response = await axios.get("/recruteur/recruteurs/me/");
    return { isRecruteur: true, data: response.data };
  } catch (error) {
    return { isRecruteur: false, data: null };
  }
};

export default {
  publierOffre,
  getMesOffres,
  getOffresPubliques,
  getOffreById,
  updateOffre,
  deleteOffre,
  checkIsRecruteur,
};