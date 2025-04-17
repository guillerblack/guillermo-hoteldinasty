const db = require('../config/db');

    exports.createBooking = (booking) => {
      return new Promise((resolve, reject) => {
        const { user_id, room_id, check_in_date, check_out_date, num_adults, num_children } = booking;
        const query = `
          INSERT INTO bookings (user_id, room_id, check_in_date, check_out_date, num_adults, num_children)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(query, [user_id, room_id, check_in_date, check_out_date, num_adults, num_children], (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result.insertId);
        });
      });
    };

    exports.getUserBookings = (userId) => {
      return new Promise((resolve, reject) => {
        const query = `
          SELECT b.*, r.name AS room_name
          FROM bookings b
          JOIN rooms r ON b.room_id = r.id
          WHERE b.user_id = ?
        `;
        db.query(query, [userId], (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        });
      });
    };

    // (Optional)
    // exports.getBookingById = (id) => { ... };

    // (Optional)
    // exports.cancelBooking = (id) => { ... };
