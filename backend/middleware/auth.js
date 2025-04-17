const jwt = require('jsonwebtoken');

    // Secret key (should match the one used in authController)
    const JWT_SECRET = 'your-secret-key';

    module.exports = (req, res, next) => {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
      }

      const token = authHeader.split(' ')[1];

      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        req.user = decoded; // Add user info to request object (e.g., userId, role)
        next(); // Proceed to the next middleware or route handler
      });
    };
