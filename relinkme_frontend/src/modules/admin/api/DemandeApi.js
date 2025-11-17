import axios from "@/services/axiosInstance";

export const creation_demande = async (id_utilisateur, payload) => {
  try {
    const { data } = await axios.post(
      `demande/create/${parseInt(payload['utilisateur'])}`,
      payload
    );
    return data;
  } catch (error) {
    console.error("Erreur création demande:", error.response?.data || error.message);
    throw error;
  }
};

export const  getAllDemande = async (filter,payload) => {
    try {
    const { data } = await axios.post(`demande/liste?statut=${filter}`,payload)
    return data;
  } catch (error) {
    console.error("Erreur :", error.response?.data || error.message);
    throw error;
  }
}

export const  getSingleDemande = async (idDmd,payload) => {
    try {
    const { data } = await axios.post(`demande/${idDmd}`,payload)
    return data;
  } catch (error) {
    console.error("Erreur :", error.response?.data || error.message);
    throw error;
  }
}

export const  getSingleUser = async (idUser) => {
    try {
    const { data } = await axios.get(`admin/user/${idUser}`)
    return data;
  } catch (error) {
    console.error("Erreur :", error.response?.data || error.message);
    throw error;
  }
}


export const getAllLocListe = async (code_admin) => {
       try {
    const { data } = await axios.get(`demande/localisation/liste/${code_admin}`)
    return data;
  } catch (error) {
    console.error("Erreur :", error.response?.data || error.message);
    throw error;
  }
}

export const creation_loc = async (id_utilisateur, payload) => {
  try {
    const { data } = await axios.post(
      `demande/localisation/create/${parseInt(id_utilisateur)}`,
      payload
    );
    return data;
  } catch (error) {
    console.error("Erreur création demande:", error.response?.data || error.message);
    throw error;
  }
};


export const traiterDemande = async (id_demande,idAdmin,formData) => {
       try {
    const { data } = await axios.post(`demande/traitement/${id_demande}/${idAdmin}`,formData)
    return data;
  } catch (error) {
    console.error("Erreur :", error.response?.data || error.message);
    throw error;
  }
}