import axios from "@/services/axiosInstance";

export const creation_admin = async (id_admin = 0, payload) => {
  try {
    const { data } = await axios.post(
      `admin/create/${parseInt(payload['utilisateur'])}/${id_admin}`,
      payload
    );
    return data;
  } catch (error) {
    console.error("Erreur création admin:", error.response?.data || error.message);
    throw error;
  }
};

export const  getAllAdmin = async () => {
    try {
    const { data } = await axios.get(`admin/list`)
    return data;
  } catch (error) {
    console.error("Erreur :", error.response?.data || error.message);
    throw error;
  }
}
export const  getAllAdminUser = async (id_admin=0,filter) => {
    try {
    const { data } = await axios.get(`admin/joined-list/${id_admin}?admin=${filter}`)
    return data;
  } catch (error) {
    console.error("Erreur :", error.response?.data || error.message);
    throw error;
  }
}

export const getAdminById = async (code_admin) => {
       try {
    const { data } = await axios.get(`admin/list/${code_admin}`)
    return data;
  } catch (error) {
    console.error("Erreur :", error.response?.data || error.message);
    throw error;
  }
}

export const deleteAdmin = async (code_admin) => {
       try {
    const { data } = await axios.post(`admin/delete/${code_admin}`)
    return data;
  } catch (error) {
    console.error("Erreur :", error.response?.data || error.message);
    throw error;
  }
}

export const updateAdmin = async (code_admin,code_manipulator,formData) => {
       try {
    const { data } = await axios.post(`admin/update/${code_admin}/${code_manipulator}`,formData)
    return data;
  } catch (error) {
    console.error("Erreur :", error.response?.data || error.message);
    throw error;
  }
}

export const  getAllUsers = async () => {
    try {
    const { data } = await axios.get(`admin/users`)
    return data.list;
  } catch (error) {
    console.error("Erreur :", error.response?.data || error.message);
    throw error;
  }
}