import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/busquedas";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};


export const buscarPorPlaca = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/por-placa`,
      data,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const buscarPorPadron = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/por-padron`,
      data,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
