const db = require('../config/db');

class ServiceBooking {
  static async getAll() {
    try {
      const [rows] = await db.execute(
        `SELECT sb.*, s.name as service_name, s.image_url, u.name as user_name, u.email
         FROM service_bookings sb
         JOIN services s ON sb.service_id = s.id
         JOIN users u ON sb.user_id = u.id
         ORDER BY sb.booking_date DESC, sb.booking_time DESC`
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.execute(
        `SELECT sb.*, s.name as service_name, s.image_url, s.price as service_price, 
                s.description as service_description, s.category
         FROM service_bookings sb
         JOIN services s ON sb.service_id = s.id
         WHERE sb.id = ?`,
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getByUserId(userId) {
    try {
      const [rows] = await db.execute(
        `SELECT sb.*, s.name as service_name, s.image_url, s.category
         FROM service_bookings sb
         JOIN services s ON sb.service_id = s.id
         WHERE sb.user_id = ?
         ORDER BY sb.booking_date DESC, sb.booking_time DESC`,
        [userId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async create(bookingData) {
    try {
      const [result] = await db.execute(
        `INSERT INTO service_bookings 
         (user_id, service_id, booking_date, booking_time, quantity, special_requests, status, total_price) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          bookingData.user_id,
          bookingData.service_id,
          bookingData.booking_date,
          bookingData.booking_time,
          bookingData.quantity,
          bookingData.special_requests,
          bookingData.status || 'pending',
          bookingData.total_price
        ]
      );
      
      return { id: result.insertId, ...bookingData };
    } catch (error) {
      throw error;
    }
  }

  static async update(id, bookingData) {
    try {
      const updateFields = Object.keys(bookingData)
        .map(key => `${key} = ?`)
        .join(', ');
      
      const values = [...Object.values(bookingData), id];
      
      const [result] = await db.execute(
        `UPDATE service_bookings SET ${updateFields} WHERE id = ?`,
        values
      );
      
      return result.affectedRows > 0 ? { id, ...bookingData } : null;
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(id, status) {
    try {
      const [result] = await db.execute(
        'UPDATE service_bookings SET status = ? WHERE id = ?',
        [status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute(
        'DELETE FROM service_bookings WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ServiceBooking;