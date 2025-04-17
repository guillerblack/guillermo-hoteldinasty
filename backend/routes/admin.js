const express = require('express');
    const router = express.Router();
    const adminController = require('../controllers/adminController');
    const auth = require('../middleware/auth'); // Authentication middleware
    const admin = require('../middleware/admin'); // Authorization middleware for admins

    // Get all rooms (admin only)
    router.get('/rooms', auth, admin, adminController.getAllRooms);

    // Create a new room (admin only)
    router.post('/rooms', auth, admin, adminController.createRoom);

    // Get a specific room by ID (admin only)
    router.get('/rooms/:id', auth, admin, adminController.getRoomById);

    // Update a room by ID (admin only)
    router.put('/rooms/:id', auth, admin, adminController.updateRoom);

    // Delete a room by ID (admin only)
    router.delete('/rooms/:id', auth, admin, adminController.deleteRoom);

    module.exports = router;
