import axios from "@/services/axiosInstance";

export const login_admin = async (payload) => {
    try {
        const { data } = await axios.post(
          `admin/login`,
          payload
        );
        return data;
      } catch (error) {
        console.error("Erreur création admin:", error.response?.data || error.message);
        throw error;
      }
}
