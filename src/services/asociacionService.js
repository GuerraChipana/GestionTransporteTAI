import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/asociaciones";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const listarAsociaciones = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data.data; 
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const obtenerAsociacionPorId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data.data; 
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const crearAsociacion = async (data) => {
  try {
    const response = await axios.post(API_URL, data, getAuthHeaders());
    return response.data.data; 
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const actualizarAsociacion = async (id, data) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, data, getAuthHeaders());
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const cambiarEstadoAsociacion = async (id, data) => {
  try {
    // Nota: El backend tiene el path "/{id}/estado", así que lo armamos de esta forma
    const response = await axios.patch(`${API_URL}/${id}/estado`, data, getAuthHeaders());
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};