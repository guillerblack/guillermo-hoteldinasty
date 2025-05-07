// Example of how your routes should be configured
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { uploadServiceImage } = require('../middlewares/uploadMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.get('/category/:category', serviceController.getServicesByCategory);

// Protected routes - make sure uploadServiceImage is applied to POST and PUT routes
router.post('/', authMiddleware, uploadServiceImage, serviceController.createService);
router.put('/:id', authMiddleware, uploadServiceImage, serviceController.updateService);
router.delete('/:id', authMiddleware, serviceController.deleteService);

module.exports = router;