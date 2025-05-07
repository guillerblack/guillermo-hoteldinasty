const db = require('../config/db');

class Review {
  static async create(reviewData) {
    try {
      const [result] = await db.execute(
        'INSERT INTO reviews (user_id, room_id, rating, comment) VALUES (?, ?, ?, ?)',
        [reviewData.userId, reviewData.roomId, reviewData.rating, reviewData.comment]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async getByRoomId(roomId) {
    try {
      const [rows] = await db.execute(
        `SELECT r.*, u.name as user_name 
         FROM reviews r 
         JOIN users u ON r.user_id = u.id 
         WHERE r.room_id = ? 
         ORDER BY r.created_at DESC`,
        [roomId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Review;