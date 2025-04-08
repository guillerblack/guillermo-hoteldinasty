import axios from "axios";

// Crear una instancia de Axios
const api = axios.create({
  baseURL: "http://localhost:8000/api", // Cambia esto si tu backend tiene otra URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token de autenticación a cada solicitud
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
