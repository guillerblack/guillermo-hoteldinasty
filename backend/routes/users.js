const express = require('express');
    const router = express.Router();
    const userController = require('../controllers/userController');
    const auth = require('../middleware/auth'); // Import the authentication middleware

    // Get the profile of the authenticated user
    router.get('/me', auth, userController.getProfile);

    // Update the profile of the authenticated user
    router.put('/me', auth, userController.updateProfile);

    module.exports = router;
