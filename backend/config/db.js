const mysql = require('mysql2');

    const db = mysql.createConnection({
      host: 'localhost',      // O la IP de tu servidor MySQL si no es localhost
      user: 'root',           // Tu nombre de usuario de MySQL
      password: '',       // Tu contraseña de MySQL
      database: 'bd-hotelnew',  // El nombre de tu base de datos
      port: 3307              // El puerto en el que está escuchando MySQL (¡verifica este valor!)
    });

    module.exports = db;
