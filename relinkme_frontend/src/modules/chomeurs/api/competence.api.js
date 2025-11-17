// modules/chomeur/api/competence.api.js
import axios from "@/services/axiosInstance";

/**
 * Récupérer toutes les compétences du chômeur connecté
 */
export const getChomeurCompetences = async () => {
  const { data } = await axios.get("/chomeur/mes-competences/");
  return data;
};

/**
 * Ajouter une nouvelle compétence
 */
export const addCompetence = async (competenceData) => {
  const { data } = await axios.post("/chomeur/mes-competences/", competenceData);
  return data;
};

/**
 * 🆕 Ajouter plusieurs compétences en une seule fois
 */
export const addCompetencesBulk = async (competencesArray) => {
  const { data } = await axios.post("/chomeur/mes-competences/bulk/", {
    competences: competencesArray
  });
  return data;
};

/**
 * Mettre à jour une compétence
 */
export const updateCompetence = async (id, competenceData) => {
  const { data } = await axios.put(`/chomeur/competences/${id}/`, competenceData);
  return data;
};

/**
 * Supprimer une compétence
 */
export const deleteCompetence = async (id) => {
  const { data } = await axios.delete(`/chomeur/competences/${id}/`);
  return data;
};

/**
 * 🆕 Supprimer plusieurs compétences en une fois
 */
export const deleteCompetencesBulk = async (idsArray) => {
  const { data } = await axios.post("/chomeur/mes-competences/bulk-delete/", {
    ids: idsArray
  });
  return data;
};

/**
 * Récupérer une compétence par ID
 */
export const getCompetenceById = async (id) => {
  const { data } = await axios.get(`/chomeur/competences/${id}/`);
  return data;
};