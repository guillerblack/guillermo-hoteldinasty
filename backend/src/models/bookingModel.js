const db = require('../config/db');

class Booking {
  static async create(bookingData) {
    try {
      const [result] = await db.execute(
        `INSERT INTO bookings 
         (user_id, room_id, check_in_date, check_out_date, num_adults, num_children, status, total_price) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          bookingData.userId,
          bookingData.roomId,
          bookingData.checkInDate,
          bookingData.checkOutDate,
          bookingData.numAdults,
          bookingData.numChildren,
          bookingData.status || 'pending',
          bookingData.totalPrice
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async getByUserId(userId) {
    try {
      const [rows] = await db.execute(
        `SELECT b.*, r.name as room_name, r.image_url 
         FROM bookings b 
         JOIN rooms r ON b.room_id = r.id 
         WHERE b.user_id = ? 
         ORDER BY b.created_at DESC`,
        [userId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.execute(
        `SELECT b.*, r.name as room_name, r.image_url 
         FROM bookings b 
         JOIN rooms r ON b.room_id = r.id 
         WHERE b.id = ?`,
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(id, status) {
    try {
      const [result] = await db.execute(
        'UPDATE bookings SET status = ? WHERE id = ?',
        [status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  
  static async getAll() {
    try {
      const [rows] = await db.query(`
        SELECT b.*, u.email as user_name, r.name as room_name
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN rooms r ON b.room_id = r.id
      `);
      return rows;
    } catch (error) {
      console.error('Error al obtener todas las reservas:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute(
        'DELETE FROM bookings WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error al eliminar la reserva:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const { check_in_date, check_out_date, num_adults, num_children } = data;
      
      const query = `
        UPDATE bookings 
        SET check_in_date = ?, check_out_date = ?, num_adults = ?, num_children = ?, updated_at = NOW()
        WHERE id = ?
      `;
      
      const [result] = await db.execute(query, [
        check_in_date, 
        check_out_date, 
        num_adults, 
        num_children, 
        id
      ]);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error en Booking.update:', error);
      throw error;
    }
  }
}




module.exports = Booking;