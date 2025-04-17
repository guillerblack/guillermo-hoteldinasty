const {
      getAllRooms,
      createRoom,
      getRoomById,
      updateRoom,
      deleteRoom,
    } = require('../models/room'); // Import model functions

    exports.getAllRooms = async (req, res) => {
      try {
        const rooms = await getAllRooms();
        res.json(rooms);
      } catch (error) {
        console.error('Error getting all rooms:', error);
        res.status(500).json({ message: 'Error getting rooms' });
      }
    };

    exports.createRoom = async (req, res) => {
      try {
        const roomId = await createRoom(req.body);
        res.status(201).json({ message: 'Room created successfully', roomId });
      } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ message: 'Error creating room' });
      }
    };

    exports.getRoomById = async (req, res) => {
      try {
        const room = await getRoomById(req.params.id);
        if (!room) {
          return res.status(404).json({ message: 'Room not found' });
        }
        res.json(room);
      } catch (error) {
        console.error('Error getting room by ID:', error);
        res.status(500).json({ message: 'Error getting room' });
      }
    };

    exports.updateRoom = async (req, res) => {
      try {
        await updateRoom(req.params.id, req.body);
        res.json({ message: 'Room updated successfully' });
      } catch (error) {
        console.error('Error updating room:', error);
        res.status(500).json({ message: 'Error updating room' });
      }
    };

    exports.deleteRoom = async (req, res) => {
      try {
        await deleteRoom(req.params.id);
        res.json({ message: 'Room deleted successfully' });
      } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500).json({ message: 'Error deleting room' });
      }
    };
