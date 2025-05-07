const db = require('../config/db');

class Room {
  static async getAll() {
    try {
      const [rows] = await db.execute(`
        SELECT 
          id,
          name as nombre,
          description as descripcion,
          max_persons as maxPersonas,
          price as valor,
          REPLACE(image_url, 'public/', '/') as image,
          size as tamaño,
          disponible
        FROM rooms 
        WHERE disponible = 1
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.execute(`
        SELECT 
          id,
          name as nombre,
          description as descripcion,
          max_persons as maxPersonas,
          price as valor,
          REPLACE(image_url, 'public/', '/') as image,
          size as tamaño,
          disponible
        FROM rooms
        WHERE id = ?
        LIMIT 1
      `, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async checkAvailability(roomId, checkInDate, checkOutDate) {
    try {
      const [rows] = await db.execute(
        `SELECT * FROM bookings 
         WHERE room_id = ? 
         AND status != 'cancelled'
         AND ((check_in_date <= ? AND check_out_date >= ?) 
         OR (check_in_date <= ? AND check_out_date >= ?) 
         OR (check_in_date >= ? AND check_out_date <= ?))`,
        [roomId, checkOutDate, checkInDate, checkInDate, checkOutDate, checkInDate, checkOutDate]
      );
      return rows.length === 0;
    } catch (error) {
      throw error;
    }
  }

  static async create(roomData) {
    try {
      console.log("Datos recibidos en el modelo:", roomData);
      
      // Asegurarse de que la ruta de la imagen sea correcta
      let imageUrl = roomData.image;
      
      // Si no hay imagen, dejar como null
      if (!imageUrl) {
        imageUrl = null;
      } else if (!imageUrl.startsWith('/img/rooms/')) {
        // Extraer el nombre del archivo y construir la ruta correcta
        const filename = imageUrl.split('/').pop();
        imageUrl = `/img/rooms/${filename}`;
      }
  
      console.log("URL de imagen a guardar:", imageUrl);
  
      const [result] = await db.execute(
        'INSERT INTO rooms (name, description, max_persons, price, image_url, size, disponible) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          roomData.nombre,
          roomData.descripcion,
          roomData.maxPersonas,
          roomData.valor,
          imageUrl,  // Usar la ruta corregida o null
          roomData.tamano,
          1
        ]
      );
  
      // Transformar los datos para devolverlos en el formato esperado por el frontend
      const newRoom = {
        id: result.insertId,
        nombre: roomData.nombre,
        descripcion: roomData.descripcion,
        maxPersonas: roomData.maxPersonas,
        valor: roomData.valor,
        image: imageUrl,
        tamano: roomData.tamano,
        disponible: 1
      };
  
      console.log("Habitación creada:", newRoom);
      return newRoom;
    } catch (error) {
      console.error("Error en create:", error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      // Verificar si existen reservas activas para la habitación
      const [bookings] = await db.execute(
        'SELECT id FROM bookings WHERE room_id = ? AND status != "cancelled"',
        [id]
      );
      if (bookings.length > 0) {
        throw new Error('No se puede eliminar la habitación porque tiene reservas activas.');
      }
      const [result] = await db.execute(
        'DELETE FROM rooms WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error en delete:', error);
      throw error;
    }
  }

  static async update(id, roomData) {
    try {
      // Asegurarse de que la ruta de la imagen sea correcta
      let imageUrl = roomData.image;
      
      // Si la imagen comienza con /img/rooms/, mantenerla así para la base de datos
      if (imageUrl && !imageUrl.startsWith('/img/rooms/')) {
        // Si viene de otra ruta, extraer el nombre del archivo
        const filename = imageUrl.split('/').pop();
        imageUrl = `/img/rooms/${filename}`;
      }
  
      // Asegurarse de que todos los valores sean null en lugar de undefined
      const nombre = roomData.nombre === undefined ? null : roomData.nombre;
      const descripcion = roomData.descripcion === undefined ? null : roomData.descripcion;
      const maxPersonas = roomData.maxPersonas === undefined ? null : roomData.maxPersonas;
      const valor = roomData.valor === undefined ? null : roomData.valor;
      
      // Manejar tanto tamaño como tamano para compatibilidad
      let tamano = null;
      if (roomData.tamano !== undefined) {
        tamano = roomData.tamano;
      } else if (roomData.tamaño !== undefined) {
        tamano = roomData.tamaño;
      }
  
      console.log("Valores a actualizar en BD:", {
        nombre, descripcion, maxPersonas, valor, imageUrl, tamano, id
      });
  
      const [result] = await db.execute(
        `UPDATE rooms SET name = ?, description = ?, max_persons = ?, price = ?, image_url = ?, size = ? WHERE id = ?`,
        [
          nombre,
          descripcion,
          maxPersonas,
          valor,
          imageUrl,  // Usar la ruta corregida
          tamano,
          id
        ]
      );
      
      // Devolver un objeto con los datos actualizados para mejor respuesta
      if (result.affectedRows > 0) {
        return {
          id,
          nombre,
          descripcion,
          maxPersonas,
          valor,
          image: imageUrl,
          tamaño: tamano,
          disponible: 1
        };
      }
      return false;
    } catch (error) {
      console.error("Error en update:", error);
      throw error;
    }
  }
}


module.exports = Room;