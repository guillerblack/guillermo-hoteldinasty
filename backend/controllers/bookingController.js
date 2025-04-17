const {
      createBooking,
      getUserBookings,
      // getBookingById,
      // cancelBooking,
    } = require('../models/booking'); // Import model functions

    exports.createBooking = async (req, res) => {
      try {
        const bookingId = await createBooking({ ...req.body, user_id: req.user.userId }); // Add user ID to booking data
        res.status(201).json({ message: 'Booking created successfully', bookingId });
      } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Error creating booking' });
      }
    };

    exports.getUserBookings = async (req, res) => {
      try {
        const bookings = await getUserBookings(req.user.userId);
        res.json(bookings);
      } catch (error) {
        console.error('Error getting user bookings:', error);
        res.status(500).json({ message: 'Error getting bookings' });
      }
    };

    // (Optional)
    // exports.getBookingById = async (req, res) => { ... };

    // (Optional)
    // exports.cancelBooking = async (req, res) => { ... };
