import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'

import axios from 'axios'
import { toast } from 'sonner'

// --- CONFIGURACIÓN GLOBAL DE ERRORES (INTERCEPTOR) ---
axios.interceptors.response.use(
  (response) => {
    // Si la petición fue exitosa, la dejamos pasar
    return response;
  },
  (error) => {
    // 1. Buscamos primero en la doble capa "data" de tu backend
    // 2. Si no existe, buscamos en una sola capa
    // 3. Si el backend está caído y no responde, mostramos un mensaje genérico
    const mensajeError =
      error.response?.data?.data?.message ||
      error.response?.data?.message ||
      "Ocurrió un error inesperado al conectar con el servidor.";

    // Lanzamos la notificación bonita
    toast.error("Acción denegada", {
      description: mensajeError,
      duration: 5000,
    });

    return Promise.reject(error);
  }
);
// -----------------------------------------------------

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)