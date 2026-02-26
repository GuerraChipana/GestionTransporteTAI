// src/services/vehiculoService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/vehiculos";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

const getMultipartHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      // Axios calculará automáticamente el Content-Type y el boundary
    },
  };
};

// 1. LISTAR TODOS
export const listarVehiculos = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data.data; 
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 2. OBTENER POR ID
export const obtenerVehiculoPorId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data.data; 
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 3. CREAR VEHÍCULO (Con imagen opcional)
export const crearVehiculo = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData, getMultipartHeaders());
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 4. ACTUALIZAR VEHÍCULO (Con imagen opcional)
export const actualizarVehiculo = async (id, formData) => {
  try {
    const response = await axios.patch(
      `${API_URL}/${id}`,
      formData,
      getMultipartHeaders(),
    );
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 5. CAMBIAR ESTADO
export const cambiarEstadoVehiculo = async (id, data) => {
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
