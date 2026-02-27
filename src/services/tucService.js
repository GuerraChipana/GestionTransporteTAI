import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/tucs";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const listarTucs = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const obtenerTucPorId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const crearTuc = async (data) => {
  try {
    const response = await axios.post(API_URL, data, getAuthHeaders());
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const actualizarTuc = async (id, data) => {
  try {
    const response = await axios.patch(
      `${API_URL}/${id}`,
      data,
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const cambiarEstadoTuc = async (id, data) => {
  try {
    const response = await axios.patch(
      `${API_URL}/${id}/estado`,
      data,
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
