import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirigir al login si hay error de autenticación
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Función para obtener la URL completa de una imagen
export const getImageUrl = (imagePath) => {
  if (!imagePath) return `${API_URL}/img/rooms/default-room.jpg`;
  
  // Si la ruta ya incluye la URL base, devolverla tal cual
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Si la ruta no comienza con /, añadirla
  if (!imagePath.startsWith('/')) {
    imagePath = '/' + imagePath;
  }
  
  // Devolver la URL completa
  return `${API_URL}${imagePath}`;
};

// Función para manejar errores de carga de imágenes
export const handleImageError = (e) => {
  console.error(`Error cargando imagen: ${e.target.src}`);
  e.target.src = getImageUrl('/img/rooms/default-room.jpg');
};

// Funciones para habitaciones
export const roomService = {
  getAll: async () => {
    try {
      const response = await api.get('/api/rooms');
      return response.data;
    } catch (error) {
      console.error('Error al obtener habitaciones:', error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/api/rooms/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener habitación ${id}:`, error);
      throw error;
    }
  },
  
  create: async (roomData) => {
    try {
      // Si hay un archivo de imagen, usar FormData
      if (roomData.imageFile) {
        const formData = new FormData();
        Object.keys(roomData).forEach(key => {
          if (key === 'imageFile') {
            formData.append('image', roomData.imageFile);
          } else {
            formData.append(key, roomData[key]);
          }
        });
        
        const response = await axios.post(`${API_URL}/api/rooms`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        return response.data;
      } else {
        // Si no hay archivo, enviar como JSON
        const response = await api.post('/api/rooms', roomData);
        return response.data;
      }
    } catch (error) {
      console.error('Error al crear habitación:', error);
      throw error;
    }
  },
  
  update: async (id, roomData) => {
    try {
      // Si hay un archivo de imagen, usar FormData
      if (roomData.imageFile) {
        const formData = new FormData();
        Object.keys(roomData).forEach(key => {
          if (key === 'imageFile') {
            formData.append('image', roomData.imageFile);
          } else {
            formData.append(key, roomData[key]);
          }
        });
        
        const response = await axios.put(`${API_URL}/api/rooms/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        return response.data;
      } else {
        // Si no hay archivo, enviar como JSON
        const response = await api.put(`/api/rooms/${id}`, roomData);
        return response.data;
      }
    } catch (error) {
      console.error(`Error al actualizar habitación ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/api/rooms/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar habitación ${id}:`, error);
      throw error;
    }
  },
  
  checkAvailability: async (roomId, checkInDate, checkOutDate) => {
    try {
      const response = await api.get(`/api/rooms/${roomId}/availability`, {
        params: { checkInDate, checkOutDate }
      });
      return response.data;
    } catch (error) {
      console.error(`Error al verificar disponibilidad de habitación ${roomId}:`, error);
      throw error;
    }
  }
};

// Funciones para reservas
export const bookingService = {
  getAll: async () => {
    try {
      const response = await api.get('/api/bookings');
      return response.data;
    } catch (error) {
      console.error('Error al obtener reservas:', error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/api/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener reserva ${id}:`, error);
      throw error;
    }
  },
  
  create: async (bookingData) => {
    try {
      const response = await api.post('/api/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error al crear reserva:', error);
      throw error;
    }
  },
  
  update: async (id, bookingData) => {
    try {
      const response = await api.put(`/api/bookings/${id}`, bookingData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar reserva ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/api/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar reserva ${id}:`, error);
      throw error;
    }
  },
  
  getUserBookings: async () => {
    try {
      const response = await api.get('/api/bookings/user');
      return response.data;
    } catch (error) {
      console.error('Error al obtener reservas del usuario:', error);
      throw error;
    }
  }
};

// Funciones para autenticación
export const authService = {
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'admin';
  }
};

export default api;