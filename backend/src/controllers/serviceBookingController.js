const ServiceBooking = require('../models/ServiceBooking');
const Service = require('../models/Service');

exports.getAllServiceBookings = async (req, res) => {
  try {
    const bookings = await ServiceBooking.getAll();
    res.json(bookings);
  } catch (error) {
    console.error('Error al obtener reservas de servicios:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.getServiceBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await ServiceBooking.getById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Reserva de servicio no encontrada' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Error al obtener reserva de servicio:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.getServiceBookingsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await ServiceBooking.getByUserId(userId);
    res.json(bookings);
  } catch (error) {
    console.error('Error al obtener reservas de servicios del usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.createServiceBooking = async (req, res) => {
  try {
    const { service_id, booking_date, booking_time, quantity, special_requests } = req.body;
    const userId = req.user.id;
    
    // Verificar que el servicio existe
    const service = await Service.getById(service_id);
    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    
    // Crear la reserva
    const bookingData = {
      user_id: userId,
      service_id,
      booking_date,
      booking_time,
      quantity: quantity || 1,
      special_requests: special_requests || '',
      status: 'pending',
      total_price: service.price * (quantity || 1)
    };
    
    const newBooking = await ServiceBooking.create(bookingData);
    res.status(201).json({
      message: 'Reserva de servicio creada exitosamente',
      booking: newBooking
    });
  } catch (error) {
    console.error('Error al crear reserva de servicio:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.updateServiceBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;
    
    // Verificar que la reserva existe y pertenece al usuario
    const booking = await ServiceBooking.getById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Reserva de servicio no encontrada' });
    }
    
    if (booking.user_id !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para modificar esta reserva' });
    }
    
    // Actualizar solo los campos permitidos
    const allowedUpdates = ['booking_date', 'booking_time', 'quantity', 'special_requests'];
    const updateData = {};
    
    for (const field of allowedUpdates) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }
    
    // Si cambia la cantidad, recalcular el precio total
    if (updateData.quantity) {
      const service = await Service.getById(booking.service_id);
      updateData.total_price = service.price * updateData.quantity;
    }
    
    const updatedBooking = await ServiceBooking.update(bookingId, updateData);
    res.json({
      message: 'Reserva de servicio actualizada exitosamente',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Error al actualizar reserva de servicio:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.cancelServiceBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    // Verificar que la reserva existe
    const booking = await ServiceBooking.getById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Reserva de servicio no encontrada' });
    }
    
    // Permitir cancelar si es el dueño de la reserva o si es administrador
    if (booking.user_id !== userId && !isAdmin) {
      return res.status(403).json({ message: 'No tienes permiso para cancelar esta reserva' });
    }
    
    const updated = await ServiceBooking.updateStatus(bookingId, 'cancelled');
    if (updated) {
      res.json({ message: 'Reserva de servicio cancelada exitosamente' });
    } else {
      res.status(400).json({ message: 'No se pudo cancelar la reserva' });
    }
  } catch (error) {
    console.error('Error al cancelar reserva de servicio:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.completeServiceBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    
    const updated = await ServiceBooking.updateStatus(bookingId, 'completed');
    if (updated) {
      res.json({ message: 'Reserva de servicio marcada como completada' });
    } else {
      res.status(400).json({ message: 'No se pudo actualizar el estado de la reserva' });
    }
  } catch (error) {
    console.error('Error al completar reserva de servicio:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.deleteServiceBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    
    await ServiceBooking.delete(bookingId);
    res.json({ message: 'Reserva de servicio eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar reserva de servicio:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};