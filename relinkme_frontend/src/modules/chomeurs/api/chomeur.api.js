// modules/chomeurs/api/chomeur.api.js (VERSION COMPLÈTE)
import axios from "@/services/axiosInstance";

// 🆕 Inscription d'un nouveau chômeur (sans authentification)
export const inscriptionChomeur = async (formData) => {
  try {
    // Utilise une instance axios sans token pour l'inscription
    const response = await axios.post("/chomeur/inscription/", formData, {
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
    throw error;
  }
};

// 🔹 Récupérer tous les chômeurs
export const getAllChomeurs = async () => {
  const { data } = await axios.get("/chomeur/chomeurs/");
  return data;
};

// 🔹 Récupérer un chômeur par ID
export const getChomeurById = async (id) => {
  const { data } = await axios.get(`/chomeur/chomeurs/${id}/`);
  return data;
};

// 🔹 Mettre à jour un chômeur
export const updateChomeur = async (id, updatedData) => {
  const { data } = await axios.put(`/chomeur/chomeurs/${id}/`, updatedData);
  return data;
};

// 🔹 Supprimer un chômeur
export const deleteChomeur = async (id) => {
  const { data } = await axios.delete(`/chomeur/chomeurs/${id}/`);
  return data;
};

export const getMonProfil = async () => {
  const { data } = await axios.get("/chomeur/mon-profil/");
  return data;
};

// 🆕 Récupérer mes compétences
export const getMesCompetences = async () => {
  const { data } = await axios.get("/chomeur/mes-competences/");
  return data;
};

// 🆕 Ajouter une compétence
export const ajouterCompetence = async (competenceData) => {
  const { data } = await axios.post("/chomeur/mes-competences/", competenceData);
  return data;
};

// 🆕 Supprimer une compétence
export const supprimerCompetence = async (id) => {
  const { data } = await axios.delete(`/chomeur/competences/${id}/`);
  return data;
};

// 🆕 Récupérer mes exploits
export const getMesExploits = async () => {
  const { data } = await axios.get("/chomeur/mes-exploits/");
  return data;
};

// 🆕 Ajouter un exploit
export const ajouterExploit = async (exploitData) => {
  const { data } = await axios.post("/chomeur/mes-exploits/", exploitData);
  return data;
};

// 🆕 Modifier un exploit
export const modifierExploit = async (id, exploitData) => {
  const { data } = await axios.put(`/chomeur/exploits/${id}/`, exploitData);
  return data;
};

// 🆕 Supprimer un exploit
export const supprimerExploit = async (id) => {
  const { data } = await axios.delete(`/chomeur/exploits/${id}/`);
  return data;
};