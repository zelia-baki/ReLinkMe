 import axios from "@/services/axiosInstance";

 export const signaler = async (id_signaleur,id_signale, payload) => {
   try {
     const { data } = await axios.post(
       `admin/signalement/create/${parseInt(id_signaleur)}/${id_signale}`,
       payload
     );
     return data;
   } catch (error) {
     console.error("Erreur lors du signalement", error.response?.data || error.message);
     throw error;
   }
 };

 export const traiterSignalement = async (idSignalement,idAdmin,formData) => {
        try {
     const { data } = await axios.post(`admin/signalement/traitement/${idSignalement}/${idAdmin}}`,formData)
     return data;
   } catch (error) {
     console.error("Erreur :", error.response?.data || error.message);
     throw error;
   }
 }

 export const deleteSignalement = async (idSignalement) => {
        try {
     const { data } = await axios.post(`admin/signalement/delete/${idSignalement}`)
     return data;
   } catch (error) {
     console.error("Erreur :", error.response?.data || error.message);
     throw error;
   }
 }

export const  listSignalement = async (statut,payload) => {
    try {
    const { data } = await axios.post(`admin/signalement/liste?statut=${statut}`,payload)
    return data;
  } catch (error) {
    console.error("Erreur :", error.response?.data || error.message);
    throw error;
  }
}