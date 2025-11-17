// src/modules/Offres/api/offres.api.js
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
 * 🔍 Récupère une offre par ID
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
 * ✏️ Met à jour une offre
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
 * 🗑️ Supprime une offre
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
 * 🧠 Ajouter des compétences à une offre
 */
export const ajouterCompetences = async (competencesData) => {
  try {
    // Envoyer plusieurs compétences en une seule requête
    const promises = competencesData.map(comp => 
      axios.post("/recruteur/offres-competences/", comp)
    );
    await Promise.all(promises);
    return { success: true };
  } catch (error) {
    console.error("❌ Erreur ajout compétences:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 📝 Ajouter des tests de compétences
 */
export const ajouterTests = async (testsData) => {
  try {
    // Envoyer plusieurs tests en une seule requête
    const promises = testsData.map(test => 
      axios.post("/recruteur/tests-competences/", test)
    );
    await Promise.all(promises);
    return { success: true };
  } catch (error) {
    console.error("❌ Erreur ajout tests:", error.response?.data || error.message);
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
/**
 * 🧠 Récupère les compétences d'une offre
 */
export const getCompetencesOffre = async (offreId) => {
  try {
    const response = await axios.get(`/recruteur/offres-competences/?offre=${offreId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur récupération compétences offre:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 📝 Récupère les tests d'une offre
 */
export const getTestsOffre = async (offreId) => {
  try {
    const response = await axios.get(`/recruteur/tests-competences/?offre=${offreId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur récupération tests offre:", error.response?.data || error.message);
    throw error;
  }
};


export default {
  publierOffre,
  getMesOffres,
  getOffresPubliques,
  getOffreById,
  updateOffre,
  deleteOffre,
  ajouterCompetences,
  ajouterTests,
  checkIsRecruteur,
  getCompetencesOffre,
  getTestsOffre
};