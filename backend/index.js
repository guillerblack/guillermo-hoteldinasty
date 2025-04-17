const express = require('express');
    const cors = require('cors');
    const authRoutes = require('./routes/auth.js');  // Added .js extension
    const adminRoutes = require('./routes/admin.js'); // Added .js extension
    const bookingRoutes = require('./routes/bookings.js'); // Added .js extension
    const userRoutes = require('./routes/users.js'); // Added .js extension
    const reviewRoutes = require('./routes/reviews.js'); // Added .js extension
    const db = require('./config/db.js'); // Added .js extension

    const app = express();

    // Middleware
    app.use(cors());
    app.use(express.json()); // For parsing JSON request bodies

    // Test database connection
    db.connect((err) => {
      if (err) {
        console.error('Error connecting to database:', err);
        return;
      }
      console.log('Connected to database');
    });

    // Routes
    app.use('/auth', authRoutes);
    app.use('/admin', adminRoutes);
    app.use('/bookings', bookingRoutes);
    app.use('/users', userRoutes);
    app.use('/reviews', reviewRoutes);

    // Basic route for testing
    app.get('/', (req, res) => {
      res.json({ message: 'Server running on port 5000' });
    });

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
