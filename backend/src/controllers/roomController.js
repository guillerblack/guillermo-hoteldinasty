const Room = require('../models/roomModel');
const Review = require('../models/reviewModel');
const fs = require('fs');
const path = require('path');

// Obtener todas las habitaciones
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.getAll();
    const roomsWithFormattedImages = rooms.map(room => ({
      ...room,
      valor: parseFloat(room.valor), // Asegurar que valor sea número
      image: room.image ? `/img/rooms/${path.basename(room.image)}` : null
    }));

    res.json({ 
      success: true, 
      rooms: roomsWithFormattedImages 
    });
  } catch (error) {
    console.error('Error getting rooms:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener habitaciones' 
    });
  }
};

// Obtener una habitación por ID
exports.getRoomById = async (req, res) => {
  try {
    const roomId = req.params.id;
    const room = await Room.getById(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Habitación no encontrada' });
    }

    // Obtener reseñas de la habitación
    const reviews = await Review.getByRoomId(roomId);

    res.json({ room, reviews });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Verificar disponibilidad de una habitación
exports.checkAvailability = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;

    if (!roomId || !checkInDate || !checkOutDate) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    const isAvailable = await Room.checkAvailability(roomId, checkInDate, checkOutDate);

    res.json({ available: isAvailable });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Crear una nueva habitación
exports.createRoom = async (req, res) => {
  try {
    console.log("Datos recibidos:", req.body);
    console.log("Archivo recibido:", req.file);
    console.log("Headers recibidos:", req.headers);
    
    const { nombre, descripcion, maxPersonas, valor, tamano } = req.body;

    // Verificar si se recibió un archivo y manejarlo correctamente
    let imagePath = '';
    if (req.file) {
      // Si hay un archivo, usar su nombre para la ruta
      imagePath = `/img/rooms/${req.file.filename}`;
      console.log("Imagen recibida y procesada:", imagePath);
    } else {
      // Si no hay archivo, no asignar imagen por defecto
      imagePath = null;
      console.log("No se recibió imagen, no se asignará imagen");
    }

    const roomData = {
      nombre: nombre || null,
      descripcion: descripcion || null,
      maxPersonas: maxPersonas !== undefined ? parseInt(maxPersonas) : null,
      valor: valor !== undefined ? parseFloat(valor) : null,
      image: imagePath, // Asignar la ruta de la imagen o null
      tamano: tamano !== undefined ? parseInt(tamano) : null
    };

    console.log("Datos a guardar:", roomData);
    const newRoom = await Room.create(roomData);

    res.status(201).json({
      message: 'Habitación creada exitosamente',
      room: newRoom
    });
  } catch (error) {
    console.error("Error al crear habitación:", error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// Eliminar una habitación
exports.deleteRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const deleted = await Room.delete(roomId);

    if (deleted) {
      const updatedRooms = await Room.getAll();
      res.json({
        message: 'Habitación eliminada exitosamente',
        updatedRooms
      });
    } else {
      res.status(404).json({ message: 'Habitación no encontrada' });
    }
  } catch (error) {
    if (error.message && error.message.includes('reservas activas')) {
      res.status(409).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }
};

// Actualizar una habitación
exports.updateRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    // Change 'tamaño' to 'tamano' to match frontend and model
    const { nombre, descripcion, maxPersonas, valor, tamano } = req.body;

    const currentRoom = await Room.getById(roomId);
    if (!currentRoom) {
      return res.status(404).json({ message: 'Habitación no encontrada' });
    }

    let imagePath = currentRoom.image;

    if (req.file) {
      imagePath = `/img/rooms/${req.file.filename}`;
      if (
        currentRoom.image &&
        !currentRoom.image.includes('default-room.jpg') &&
        currentRoom.image.startsWith('/img/rooms/')
      ) {
        try {
          const oldImagePath = path.join(__dirname, '../../public', currentRoom.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (err) {
          // No detener el flujo si falla el borrado
        }
      }
    } else if (req.body.image && typeof req.body.image === 'string' && req.body.image.startsWith('/img/rooms/') && req.body.image !== currentRoom.image) {
      imagePath = req.body.image;
    }

    // Datos para actualizar la habitación
    const roomData = {
      nombre: nombre || currentRoom.nombre,
      descripcion: descripcion || currentRoom.descripcion,
      maxPersonas: maxPersonas !== undefined ? parseInt(maxPersonas) : currentRoom.maxPersonas,
      valor: valor !== undefined ? parseFloat(valor) : currentRoom.valor,
      image: imagePath,
      tamaño: tamano !== undefined ? parseInt(tamano) : currentRoom.tamaño
    };

    console.log("Datos a actualizar:", roomData);
    
    // Llamar al método update del modelo
    const updated = await Room.update(roomId, roomData);
    
    if (updated) {
      // Obtener la habitación actualizada
      const updatedRoom = await Room.getById(roomId);
      res.json({
        message: 'Habitación actualizada exitosamente',
        room: updatedRoom
      });
    } else {
      res.status(500).json({ message: 'Error al actualizar la habitación' });
    }
  } catch (error) {
    console.error("Error al actualizar habitación:", error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};
// Utilidad para validar la ruta de la imagen
const validateImagePath = (imagePath) => {
  if (!imagePath) return null;
  
  // Si es una URL completa, devolver tal cual
  if (imagePath.startsWith('http')) return imagePath;
  
  // Si es una ruta relativa, asegurar que tenga el prefijo correcto
  return imagePath.startsWith('/img') ? 
    imagePath : 
    `/img/rooms/${imagePath}`;
};