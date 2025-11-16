// modules/candidatures/api/candidatures.api.js
import axios from "@/services/axiosInstance";

// ========================================
// API POUR LES CHÔMEURS
// ========================================

/**
 * 📋 Récupérer toutes mes candidatures
 */
export const getMesCandidatures = async () => {
  try {
    const { data } = await axios.get("/core/candidatures/mes-candidatures/");
    return data;
  } catch (error) {
    console.error("❌ Erreur récupération candidatures:", error);
    throw error;
  }
};

/**
 * 📝 Postuler à une offre
 */
export const postulerOffre = async (candidatureData) => {
  try {
    const { data } = await axios.post("/core/candidatures/postuler/", candidatureData);
    return data;
  } catch (error) {
    console.error("❌ Erreur postulation:", error);
    throw error;
  }
};

/**
 * 🔍 Détails d'une de mes candidatures
 */
export const getMaCandidatureDetail = async (id) => {
  try {
    const { data } = await axios.get(`/core/candidatures/mes-candidatures/${id}/`);
    return data;
  } catch (error) {
    console.error("❌ Erreur récupération détails candidature:", error);
    throw error;
  }
};

// ========================================
// API POUR LES RECRUTEURS
// ========================================

/**
 * 📥 Récupérer les candidatures reçues
 * @param {Object} filters - { offre: id, statut: 'en_attente' }
 */
export const getCandidaturesRecues = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const { data } = await axios.get(`/core/candidatures/recues/?${params}`);
    return data;
  } catch (error) {
    console.error("❌ Erreur récupération candidatures reçues:", error);
    throw error;
  }
};

/**
 * 🔍 Détails d'une candidature reçue
 */
export const getCandidatureRecueDetail = async (id) => {
  try {
    const { data } = await axios.get(`/core/candidatures/recues/${id}/`);
    return data;
  } catch (error) {
    console.error("❌ Erreur récupération détails candidature reçue:", error);
    throw error;
  }
};

/**
 * ✏️ Mettre à jour le statut d'une candidature (recruteur)
 */
export const updateStatutCandidature = async (id, statut) => {
  try {
    const { data } = await axios.patch(`/core/candidatures/recues/${id}/`, { statut });
    return data;
  } catch (error) {
    console.error("❌ Erreur mise à jour statut:", error);
    throw error;
  }
};

// ========================================
// STATISTIQUES
// ========================================

/**
 * 📊 Récupérer les statistiques des candidatures
 */
export const getCandidatureStats = async () => {
  try {
    const { data } = await axios.get("/core/candidatures/stats/");
    return data;
  } catch (error) {
    console.error("❌ Erreur récupération stats:", error);
    throw error;
  }
};

export default {
  // Chômeur
  getMesCandidatures,
  postulerOffre,
  getMaCandidatureDetail,
  
  // Recruteur
  getCandidaturesRecues,
  getCandidatureRecueDetail,
  updateStatutCandidature,
  
  // Stats
  getCandidatureStats,
};