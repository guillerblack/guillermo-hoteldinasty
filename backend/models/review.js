const db = require('../config/db');

    exports.getReviewsByRoom = (roomId) => {
      return new Promise((resolve, reject) => {
        const query = `
          SELECT r.*, u.name AS user_name
          FROM reviews r
          JOIN users u ON r.user_id = u.id
          WHERE r.room_id = ?
        `;
        db.query(query, [roomId], (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        });
      });
    };

    exports.createReview = (review) => {
      return new Promise((resolve, reject) => {
        const { user_id, room_id, rating, comment } = review;
        const query = `
          INSERT INTO reviews (user_id, room_id, rating, comment)
          VALUES (?, ?, ?, ?)
        `;
        db.query(query, [user_id, room_id, rating, comment], (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result.insertId);
        });
      });
    };
