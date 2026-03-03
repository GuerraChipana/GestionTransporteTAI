import axios from "axios";

// Apuntamos al nuevo controlador de reportes
const API_URL = import.meta.env.VITE_API_URL + "/reportes";

// Tu función estándar para obtener el token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// --- 1. Obtener los contadores para las tarjetas ---
export const obtenerDashboard = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard`, getAuthHeaders());
    // CORRECCIÓN: Devolvemos response.data completo (que incluye success y data)
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// --- 2. Descargar el archivo Excel ---
export const descargarExcel = async (tipo) => {
  try {
    const config = {
      ...getAuthHeaders(),
      responseType: "blob", 
    };

    const response = await axios.get(`${API_URL}/excel/${tipo}`, config);

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    link.setAttribute("download", `Reporte_${tipo}.xlsx`);

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    if (error.response && error.response.data instanceof Blob) {
      const errorData = await error.response.data.text();
      console.error("Error del servidor:", errorData);
    }
    throw error;
  }
};