const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar el almacenamiento para las imágenes de habitaciones
const roomStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Cambiar la ruta para que coincida con la estructura esperada
    const uploadPath = path.join(__dirname, '../../public/img/rooms');
    
    // Crear el directorio si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    console.log('Directorio de destino para imágenes de habitaciones:', uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generar un nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = 'room-' + uniqueSuffix + ext;
    console.log('Nombre de archivo generado:', filename);
    cb(null, filename);
  }
});

// Configurar el almacenamiento para las imágenes de servicios (platos)
const serviceStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Cambiar la ruta para guardar en public/img/service
    const uploadPath = path.join(__dirname, '../../public/img/service');
    
    // Crear el directorio si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    console.log('Directorio de destino para imágenes de servicios:', uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generar un nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = 'service-' + uniqueSuffix + ext;
    console.log('Nombre de archivo generado:', filename);
    cb(null, filename);
  }
});

// Filtro para asegurar que solo se suban imágenes
const fileFilter = (req, file, cb) => {
  console.log('Archivo recibido en fileFilter:', file);
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'), false);
  }
};

// Middleware para subir imágenes de habitaciones
const uploadRoomImage = multer({
  storage: roomStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite de 5MB
  }
}).single('image');

// Middleware mejorado con manejo de errores
const uploadRoomImageHandler = (req, res, next) => {
  console.log('Iniciando procesamiento de imagen de habitación...');
  console.log('Headers recibidos:', req.headers);
  
  uploadRoomImage(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      // Error de Multer
      console.error('Error de Multer:', err);
      return res.status(400).json({ message: `Error al subir imagen: ${err.message}` });
    } else if (err) {
      // Otro tipo de error
      console.error('Error en uploadRoomImage:', err);
      return res.status(500).json({ message: `Error al procesar imagen: ${err.message}` });
    }
    
    // Log para verificar si se recibió el archivo
    console.log('Archivo procesado:', req.file);
    next();
  });
};

// Middleware para subir imágenes de servicios (platos)
const uploadServiceImage = multer({
  storage: serviceStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite de 5MB
  }
}).single('image');

// Middleware mejorado con manejo de errores para servicios
const uploadServiceImageHandler = (req, res, next) => {
  console.log('Iniciando procesamiento de imagen de servicio...');
  console.log('Headers recibidos:', req.headers);
  
  uploadServiceImage(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      // Error de Multer
      console.error('Error de Multer:', err);
      return res.status(400).json({ message: `Error al subir imagen: ${err.message}` });
    } else if (err) {
      // Otro tipo de error
      console.error('Error en uploadServiceImage:', err);
      return res.status(500).json({ message: `Error al procesar imagen: ${err.message}` });
    }
    
    // Log para verificar si se recibió el archivo
    console.log('Archivo de servicio procesado:', req.file);
    next();
  });
};

module.exports = {
  uploadRoomImage: uploadRoomImageHandler,
  uploadServiceImage: uploadServiceImageHandler
};