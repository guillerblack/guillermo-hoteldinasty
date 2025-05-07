const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');
const { uploadRoomImage } = require('../middlewares/uploadMiddleware');

// Ruta para obtener todas las habitaciones (pública)
router.get('/', roomController.getAllRooms);

// Ruta para obtener una habitación por ID (pública)
router.get('/:id', roomController.getRoomById);

// Ruta para verificar disponibilidad (pública)
router.post('/check-availability', roomController.checkAvailability);

// Middleware para depuración
const debugMiddleware = (req, res, next) => {
  console.log('Petición recibida en /api/rooms');
  console.log('Método:', req.method);
  console.log('Headers:', req.headers);
  console.log('Content-Type:', req.headers['content-type']);
  next();
};

// Ruta para crear una habitación (protegida, solo admin)
router.post('/', 
  debugMiddleware,
  authMiddleware, 
  adminMiddleware, 
  uploadRoomImage, 
  roomController.createRoom
);

// Eliminar la ruta duplicada y dejar solo esta
router.put('/:id', 
  authMiddleware, 
  adminMiddleware, 
  uploadRoomImage, 
  roomController.updateRoom
);

router.delete(
    '/:id',
    authMiddleware,
    adminMiddleware,
    roomController.deleteRoom
  );

module.exports = router;