const axios = require('axios');
require('dotenv').config();

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la petición API:', error.message);
    return Promise.reject(error);
  }
);

module.exports = api;