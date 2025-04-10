const express = require("express");
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();

// Configuración del servidor Express
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

// Configuración de la conexión a PostgreSQL
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "testdb",
  password: "password",
  port: 5432,
});

client.connect((err) => {
  if (err) {
    console.error("Connection error", err.stack);
  } else {
    console.log("Connected to the database");
  }
});

// Configuración de multer para subir archivos
const upload = multer({ dest: "uploads/" });
