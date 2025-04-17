const { findUserById, updateUser } = require('../models/user'); // Import model functions

    exports.getProfile = async (req, res) => {
      try {
        const user = await findUserById(req.user.userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        // Remove sensitive data (like password) before sending
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      } catch (error) {
        console.error('Error getting profile:', error);
        res.status(500).json({ message: 'Error getting profile' });
      }
    };

    exports.updateProfile = async (req, res) => {
      try {
        await updateUser(req.user.userId, req.body);
        res.json({ message: 'Profile updated successfully' });
      } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile' });
      }
    };
