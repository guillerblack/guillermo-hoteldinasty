const { getReviewsByRoom, createReview } = require('../models/review');

    exports.getReviewsByRoom = async (req, res) => {
      try {
        const reviews = await getReviewsByRoom(req.params.roomId);
        res.json(reviews);
      } catch (error) {
        console.error('Error getting reviews:', error);
        res.status(500).json({ message: 'Error getting reviews' });
      }
    };

    exports.createReview = async (req, res) => {
      try {
        const reviewId = await createReview({ ...req.body, user_id: req.user.userId, room_id: req.params.roomId });
        res.status(201).json({ message: 'Review created successfully', reviewId });
      } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Error creating review' });
      }
    };
