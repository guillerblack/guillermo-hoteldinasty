const db = require('../config/db');

class Service {
  static async getAll() {
    try {
      const [rows] = await db.execute('SELECT * FROM services');
      // Convertir el precio a número para cada servicio
      return rows.map(service => ({
        ...service,
        price: Number(service.price)
      }));
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.execute('SELECT * FROM services WHERE id = ?', [id]);
      if (rows[0]) {
        // Convertir el precio a número
        return {
          ...rows[0],
          price: Number(rows[0].price)
        };
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async getByCategory(category) {
    try {
      const [rows] = await db.execute('SELECT * FROM services WHERE category = ?', [category]);
      // Convertir el precio a número para cada servicio
      return rows.map(service => ({
        ...service,
        price: Number(service.price)
      }));
    } catch (error) {
      throw error;
    }
  }

  static async create(serviceData) {
    try {
      const { name, description, price, category, image_url, duration, available } = serviceData;
      
      // Insertar el servicio en la base de datos
      const [result] = await db.execute(
        `INSERT INTO services (name, description, price, category, image_url, duration, available) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, description, price, category, image_url, duration, available]
      );
      
      // Devolver el servicio creado con su ID
      return {
        id: result.insertId,
        name,
        description,
        price,
        category,
        image_url,
        duration,
        available
      };
    } catch (error) {
      console.error('Error al crear servicio:', error);
      throw error;
    }
  }
  
  // Método para actualizar un servicio
  static async update(id, serviceData) {
    try {
      const { name, description, price, category, image_url, duration, available } = serviceData;
      
      console.log('Updating service with data:', {
        id,
        name,
        description,
        price,
        category,
        image_url,
        duration,
        available
      });
      
      // Use prepared statement to avoid SQL injection
      const [result] = await db.execute(
        `UPDATE services 
         SET name = COALESCE(?, name), 
             description = COALESCE(?, description), 
             price = COALESCE(?, price), 
             category = COALESCE(?, category), 
             image_url = ?, 
             duration = COALESCE(?, duration), 
             available = COALESCE(?, available) 
         WHERE id = ?`,
        [
          name || null, 
          description || null, 
          price || null, 
          category || null, 
          image_url, 
          duration === undefined ? null : duration, 
          available === undefined ? null : available, 
          id
        ]
      );
      
      console.log('Update result:', result);
      
      // Obtener el servicio actualizado
      return this.getById(id);
    } catch (error) {
      console.error('Error al actualizar servicio:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute('DELETE FROM services WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Service;