const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path'); 
const router = express.Router();

// Importar rutas
const authRoutes = require('./src/routes/authRoutes');
const roomRoutes = require('./src/routes/roomRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const serviceBookingRoutes = require('./src/routes/serviceBookingRoutes');
const spaRoutes = require('./src/routes/spaRoutes');
const userRoutes = require('./src/routes/userRoutes');
const app = express();
const PORT = process.env.PORT || 5000;


// Middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Añadir PATCH aquí
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(express.json());

// Configuración para servir archivos estáticos con cabeceras CORS
// Primero configurar las rutas estáticas antes de las rutas de la API
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cache-Control', 'public, max-age=3600'); // Agregar caché para mejorar rendimiento
  next();
}, express.static(path.join(__dirname, 'public/uploads')));

// Modificar la configuración para servir imágenes desde /img
app.use('/img', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate'); // Deshabilitar caché para depuración
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  res.header('X-Content-Type-Options', 'nosniff');
  console.log('Solicitud de imagen recibida:', req.url); // Agregar log para depuración
  next();
}, express.static(path.join(__dirname, 'public/img')));

// Servir archivos estáticos directamente
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/service-bookings', serviceBookingRoutes);
app.use('/spa', spaRoutes);
app.use('/api/users', userRoutes);

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ message: 'API de Hotel Dynasty funcionando correctamente' });
});

// Ruta para verificar si las imágenes existen
app.get('/check-image/:folder/:filename', (req, res) => {
  const { folder, filename } = req.params;
  const imagePath = path.join(__dirname, 'public', folder, filename);
  
  if (require('fs').existsSync(imagePath)) {
    res.json({ exists: true, path: `/${folder}/${filename}` });
  } else {
    res.json({ exists: false });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error en el servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});