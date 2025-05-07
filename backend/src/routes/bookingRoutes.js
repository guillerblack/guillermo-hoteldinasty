const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Rutas para reservas
router.get('/all', bookingController.getAllBookings);
router.get('/user', bookingController.getUserBookings);
router.post('/', bookingController.createBooking);
router.put('/:id', bookingController.updateBooking);
router.delete('/:id', bookingController.deleteBooking);

// Añadir la ruta para cancelar reservas
router.put('/:id/cancel', bookingController.cancelBooking);

module.exports = router;