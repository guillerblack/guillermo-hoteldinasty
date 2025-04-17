const express = require('express');
    const router = express.Router();
    const bookingController = require('../controllers/bookingController');
    const auth = require('../middleware/auth');

    // Create a new booking
    router.post('/', auth, bookingController.createBooking);

    // Get booking history for the authenticated user
    router.get('/user', auth, bookingController.getUserBookings);

    // (Optional) Get details of a specific booking
    // router.get('/:id', auth, bookingController.getBookingById);

    // (Optional) Cancel a booking
    // router.delete('/:id', auth, bookingController.cancelBooking);

    module.exports = router;
