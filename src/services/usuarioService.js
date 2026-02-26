import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/usuarios";

// Interceptor/Helper para headers limpios
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const listarUsuarios = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data.data; 
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const obtenerUsuarioPorId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data.data; 
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const crearUsuario = async (data) => {
  try {
    const response = await axios.post(API_URL, data, getAuthHeaders());
    return response.data.data; } catch (error) {
    throw error.response?.data || error;
  }
};

export const actualizarUsuario = async (id, data) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, data, getAuthHeaders());
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const cambiarEstadoUsuario = async (id, data) => {
  try {
    const response = await axios.patch(`${API_URL}/cambiar-estado/${id}`, data, getAuthHeaders());
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const cambiarCredenciales = async (data) => {
  try {
    const response = await axios.patch(`${API_URL}/cambio-credencial`, data, getAuthHeaders());
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};