const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const ServiceBooking = require('../models/ServiceBooking');

// ... existing code ...
// Obtener todos los usuarios (solo para administradores)
exports.getAllUsers = async (req, res) => {
  try {
    // Verificar si el usuario es administrador
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
    }

    // Obtener todos los usuarios de la base de datos
    const [rows] = await User.getAllUsers();
    
    // Devolver la lista de usuarios
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};


// Eliminar un usuario (solo para administradores)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Verificar si el usuario es administrador
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
    }
    
    // Verificar si el usuario existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    // No permitir eliminar al propio usuario administrador
    if (userId == req.user.id) {
      return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta de administrador.' });
    }
    
    // Verificar si el usuario tiene reservas de habitaciones
    const userBookings = await Booking.getByUserId(userId);
    if (userBookings && userBookings.length > 0) {
      return res.status(409).json({ 
        message: "No se puede eliminar el usuario porque tiene reservas de habitaciones asociadas" 
      });
    }
    
    // Verificar si el usuario tiene reservas de servicios
    const userServiceBookings = await ServiceBooking.getByUserId(userId);
    if (userServiceBookings && userServiceBookings.length > 0) {
      return res.status(409).json({ 
        message: "No se puede eliminar el usuario porque tiene reservas de servicios asociadas" 
      });
    }
    
    // Proceder con la eliminación
    const deleted = await User.deleteUser(userId);
    
    if (deleted) {
      res.json({ message: "Usuario eliminado exitosamente" });
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ 
      message: "Error en el servidor al eliminar el usuario", 
      error: error.message 
    });
  }
};


// Convertir un usuario en administrador
exports.makeAdmin = async (req, res) => {
  try {
    // Verificar si el usuario es administrador
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
    }

    const userId = req.params.id;
    
    // Actualizar el rol del usuario a 'admin'
    const updated = await User.updateRole(userId, 'admin');
    
    if (updated) {
      res.json({ message: 'Usuario actualizado a administrador con éxito.' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado.' });
    }
  } catch (error) {
    console.error('Error al actualizar rol de usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Actualizar el rol de un usuario
exports.updateUserRole = async (req, res) => {
  try {
    // Verificar si el usuario es administrador
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
    }

    const userId = req.params.id;
    const { role } = req.body;
    
    // Validar que el rol sea válido
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Rol no válido. Debe ser "user" o "admin".' });
    }
    
    // No permitir que un administrador cambie su propio rol
    if (userId == req.user.id) {
      return res.status(400).json({ message: 'No puedes cambiar tu propio rol.' });
    }
    
    // Actualizar el rol del usuario
    const updated = await User.updateRole(userId, role);
    
    if (updated) {
      res.json({ message: `Usuario actualizado a ${role} con éxito.` });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado.' });
    }
  } catch (error) {
    console.error('Error al actualizar rol de usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};