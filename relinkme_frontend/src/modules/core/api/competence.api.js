// src/modules/core/api/competence.api.js
import axios from "@/services/axiosInstance";

/**
 * Récupérer toutes les compétences disponibles (pour les dropdowns)
 */
export const getAllCompetences = async () => {
  const { data } = await axios.get("/core/competences/");
  return data;
};

/**
 * Créer une nouvelle compétence (admin)
 */
export const createCompetence = async (competenceData) => {
  const { data } = await axios.post("/core/competences/", competenceData);
  return data;
};

/**
 * Récupérer une compétence par ID
 */
export const getCompetenceById = async (id) => {
  const { data } = await axios.get(`/core/competences/${id}/`);
  return data;
};

/**
 * Mettre à jour une compétence
 */
export const updateCompetence = async (id, competenceData) => {
  const { data } = await axios.put(`/core/competences/${id}/`, competenceData);
  return data;
};

/**
 * Supprimer une compétence
 */
export const deleteCompetence = async (id) => {
  const { data } = await axios.delete(`/core/competences/${id}/`);
  return data;
};

/**
 * Rechercher des compétences
 */
export const searchCompetences = async (query) => {
  const { data } = await axios.get(`/core/competences/?search=${query}`);
  return data;
};