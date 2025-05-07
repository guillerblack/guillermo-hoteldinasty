const Booking = require('../models/bookingModel');
const Room = require('../models/roomModel');
// Obtener todas las reservas (solo admin)
exports.getAllBookings = async (req, res) => {
  try {
    // Puedes expandir esto para incluir información de usuario y habitación si lo deseas
    const bookings = await Booking.getAll();
    res.json({ bookings });
  } catch (error) {
    console.error('Error al obtener todas las reservas:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Crear una nueva reserva
exports.createBooking = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate, numAdults, numChildren, totalPrice } = req.body;
    const userId = req.user.id;

    // Verificar disponibilidad
    const isAvailable = await Room.checkAvailability(roomId, checkInDate, checkOutDate);
    if (!isAvailable) {
      return res.status(400).json({ message: 'La habitación no está disponible para las fechas seleccionadas' });
    }

    // Crear reserva
    const bookingId = await Booking.create({
      userId,
      roomId,
      checkInDate,
      checkOutDate,
      numAdults,
      numChildren,
      totalPrice
    });

    const booking = await Booking.getById(bookingId);
    
    res.status(201).json({
      message: 'Reserva creada exitosamente',
      booking
    });
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener reservas del usuario autenticado
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.getByUserId(userId);
    
    res.json({ bookings });
  } catch (error) {
    console.error('Error al obtener reservas del usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Cancelar una reserva (usuario dueño o admin pueden cancelar)
exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    // Verificar que la reserva exista
    const booking = await Booking.getById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }
    
    // Permitir cancelar si es el dueño de la reserva o si es administrador
    if (booking.user_id !== userId && !isAdmin) {
      return res.status(403).json({ message: 'No tienes permiso para cancelar esta reserva' });
    }
    
    // Actualizar estado de la reserva a 'cancelled'
    const updated = await Booking.updateStatus(bookingId, 'cancelled');
    
    if (updated) {
      res.json({ message: 'Reserva cancelada exitosamente' });
    } else {
      res.status(500).json({ message: 'Error al cancelar la reserva' });
    }
  } catch (error) {
    console.error('Error al cancelar reserva:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Eliminar una reserva (solo admin)
exports.deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    
    // Verificar que el usuario sea administrador
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
    }
    
    // Eliminar la reserva
    const deleted = await Booking.delete(bookingId);
    
    if (deleted) {
      res.json({ message: 'Reserva eliminada exitosamente' });
    } else {
      res.status(404).json({ message: 'Reserva no encontrada' });
    }
  } catch (error) {
    console.error('Error al eliminar reserva:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};


// Actualizar una reserva (solo admin)
exports.updateBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    // Asegúrate de que los nombres de los campos coincidan con lo que envía el frontend
    const { check_in_date, check_out_date, num_adults, num_children } = req.body;
    
    // Verificar que el usuario sea administrador
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
    }
    
    // Obtener la reserva actual
    const booking = await Booking.getById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }
    
    // Verificar disponibilidad si cambian las fechas
    if (check_in_date !== booking.check_in_date || check_out_date !== booking.check_out_date) {
      const isAvailable = await Room.checkAvailability(
        booking.room_id, 
        check_in_date, 
        check_out_date, 
        bookingId // Pasar el ID de la reserva actual para excluirla de la verificación
      );
      if (!isAvailable) {
        return res.status(400).json({ message: 'La habitación no está disponible para las fechas seleccionadas' });
      }
    }
    
    // Actualizar la reserva
    const updateData = {
      check_in_date: check_in_date || booking.check_in_date,
      check_out_date: check_out_date || booking.check_out_date,
      num_adults: num_adults || booking.num_adults,
      num_children: num_children !== undefined ? num_children : booking.num_children
    };
    
    // Añadir logs para depuración
    console.log('Datos recibidos para actualizar:', req.body);
    console.log('Datos que se actualizarán:', updateData);
    
    const updated = await Booking.update(bookingId, updateData);
    
    if (updated) {
      // Obtener la reserva actualizada
      const updatedBooking = await Booking.getById(bookingId);
      res.json({ 
        message: 'Reserva actualizada exitosamente',
        booking: updatedBooking
      });
    } else {
      res.status(500).json({ message: 'Error al actualizar la reserva' });
    }
  } catch (error) {
    console.error('Error al actualizar reserva:', error);
    res.status(500).json({ message: 'Error en el servidor: ' + error.message });
  }
};