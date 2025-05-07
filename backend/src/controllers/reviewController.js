const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');

exports.createReview = async (req, res) => {
  try {
    const { roomId, rating, comment } = req.body;
    const userId = req.user.id;

    // Verificar que el usuario haya reservado esta habitación
    const userBookings = await Booking.getByUserId(userId);
    const hasBookedRoom = userBookings.some(booking => 
      booking.room_id === parseInt(roomId) && booking.status === 'confirmed'
    );

    if (!hasBookedRoom) {
      return res.status(403).json({ 
        message: 'Solo puedes dejar reseñas para habitaciones que hayas reservado' 
      });
    }

    // Crear reseña
    const reviewId = await Review.create({
      userId,
      roomId,
      rating,
      comment
    });

    res.status(201).json({
      message: 'Reseña creada exitosamente',
      reviewId
    });
  } catch (error) {
    console.error('Error al crear reseña:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.getRoomReviews = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const reviews = await Review.getByRoomId(roomId);
    
    res.json({ reviews });
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};