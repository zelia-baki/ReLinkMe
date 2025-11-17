// src/modules/competences/api/competences.api.js
import axios from "@/services/axiosInstance";

/**
 * 📋 Récupère TOUTES les compétences disponibles
 */
export const getAllCompetences = async () => {
  try {
    const response = await axios.get("/core/competences/");
    return response.data;
  } catch (error) {
    console.error("❌ Erreur récupération compétences:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔍 Récupère une compétence par ID
 */
export const getCompetenceById = async (id) => {
  try {
    const response = await axios.get(`/core/competences/${id}/`);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur récupération compétence:", error.response?.data || error.message);
    throw error;
  }
};

export default {
  getAllCompetences,
  getCompetenceById,
};