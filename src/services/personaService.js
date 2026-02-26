import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/personas";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // O como llames a tu token
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const listarPersonas = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data.data;
};

export const obtenerPersonaPorId = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
  return response.data.data;
};

export const crearPersona = async (personaData) => {
  const response = await axios.post(API_URL, personaData, getAuthHeaders());
  return response.data.data;
};

export const actualizarPersona = async (id, personaData) => {
  const response = await axios.patch(
    `${API_URL}/${id}`,
    personaData,
    getAuthHeaders(),
  );
  return response.data.data;
};

export const cambiarEstadoPersona = async (id, estadoData) => {
  const response = await axios.patch(
    `${API_URL}/${id}/estado`,
    estadoData,
    getAuthHeaders(),
  );
  return response.data.data;
};

// Servicio especial para consultar RENIEC
export const consultarReniec = async (dni, passwordConsulta) => {
  const response = await axios.post(
    `${API_URL}/reniec`,
    { dni, password_consulta: passwordConsulta },
    getAuthHeaders(),
  );
  return response.data.data;
};
