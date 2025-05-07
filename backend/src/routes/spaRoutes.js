const express = require('express');
const router = express.Router();
const spaController = require('../controllers/spaController');

// Ruta para obtener todos los servicios de SPA
router.get('/services', spaController.getAllSpaServices);

// Ruta para obtener un servicio específico por ID
router.get('/services/:id', spaController.getSpaServiceById);

// Ruta para obtener servicios destacados
router.get('/featured', spaController.getFeaturedSpaServices);

module.exports = router;