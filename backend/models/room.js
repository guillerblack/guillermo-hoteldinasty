const db = require('../config/db');

    exports.getAllRooms = () => {
      return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM rooms';
        db.query(query, (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        });
      });
    };

    exports.createRoom = (room) => {
      return new Promise((resolve, reject) => {
        const { name, description, max_persons, price, image_url } = room;
        const query = 'INSERT INTO rooms (name, description, max_persons, price, image_url) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [name, description, max_persons, price, image_url], (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result.insertId);
        });
      });
    };

    exports.getRoomById = (id) => {
      return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM rooms WHERE id = ?';
        db.query(query, [id], (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results[0]);
        });
      });
    };

    exports.updateRoom = (id, room) => {
      return new Promise((resolve, reject) => {
        const { name, description, max_persons, price, image_url } = room;
        const query = 'UPDATE rooms SET name = ?, description = ?, max_persons = ?, price = ?, image_url = ? WHERE id = ?';
        db.query(query, [name, description, max_persons, price, image_url, id], (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    };

    exports.deleteRoom = (id) => {
      return new Promise((resolve, reject) => {
        const query = 'DELETE FROM rooms WHERE id = ?';
        db.query(query, [id], (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    };
