const express = require('express');
    const router = express.Router();
    const reviewController = require('../controllers/reviewController');
    const auth = require('../middleware/auth');

    // Get reviews for a specific room
    router.get('/rooms/:roomId', reviewController.getReviewsByRoom);

    // Create a new review for a room (requires authentication)
    router.post('/rooms/:roomId', auth, reviewController.createReview);

    module.exports = router;
