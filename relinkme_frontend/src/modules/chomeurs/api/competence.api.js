import axios from "@/services/axiosInstance";

const BASE_URL = "/chomeur/competences/";

// Récupérer toutes les compétences du chômeur
export const getChomeurCompetences = async () => {
  const { data } = await axios.get(BASE_URL);
  return data;
};

// Ajouter une compétence
export const addCompetence = async (payload) => {
  const { data } = await axios.post(BASE_URL, payload);
  return data;
};

// Supprimer une compétence
export const deleteCompetence = async (id) => {
  await axios.delete(`${BASE_URL}${id}/`);
};
