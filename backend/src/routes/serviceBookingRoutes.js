const express = require('express');
const router = express.Router();
const serviceBookingController = require('../controllers/serviceBookingController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { adminMiddleware } = require('../middlewares/authMiddleware');

// Rutas protegidas (requieren autenticación)
router.get('/user', authMiddleware, serviceBookingController.getServiceBookingsByUser);
router.post('/', authMiddleware, serviceBookingController.createServiceBooking);
router.put('/:id', authMiddleware, serviceBookingController.updateServiceBooking);
router.patch('/:id/cancel', authMiddleware, serviceBookingController.cancelServiceBooking);

// Rutas solo para administradores
router.get('/', authMiddleware, adminMiddleware, serviceBookingController.getAllServiceBookings);
router.get('/:id', authMiddleware, adminMiddleware, serviceBookingController.getServiceBookingById);
router.patch('/:id/complete', authMiddleware, adminMiddleware, serviceBookingController.completeServiceBooking);
router.delete('/:id', authMiddleware, adminMiddleware, serviceBookingController.deleteServiceBooking);

module.exports = router;