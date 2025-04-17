const db = require('../config/db');

    exports.createUser = (user) => {
      return new Promise((resolve, reject) => {
        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.query(query, [user.name, user.email, user.password], (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result.insertId);
        });
      });
    };// ... (existing code in backend/models/user.js)

    exports.findUserById = (id) => {
      return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE id = ?';
        db.query(query, [id], (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results[0]);
        });
      });
    };

    exports.updateUser = (id, user) => {
      return new Promise((resolve, reject) => {
        const { name } = user; // Only allow updating the name for now (you can add more fields)
        const query = 'UPDATE users SET name = ? WHERE id = ?';
        db.query(query, [name, id], (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    };


    exports.findUserByEmail = (email) => {
      return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results[0]); // Assuming email is unique, return the first result
        });
      });
    };
