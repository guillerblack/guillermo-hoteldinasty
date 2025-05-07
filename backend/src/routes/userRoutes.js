const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Rutas protegidas que requieren autenticación
router.get('/', authMiddleware, userController.getAllUsers);
router.delete('/:id', authMiddleware, userController.deleteUser);
router.patch('/:id/make-admin', authMiddleware, userController.makeAdmin);
router.patch('/:id/update-role', authMiddleware, userController.updateUserRole);

module.exports = router;