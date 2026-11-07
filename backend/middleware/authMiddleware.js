const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../config/logger');

// Simple JWT Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    // 1. Get header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Auth failed: No token provided in authorization header');
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // 2. Extract token
    const token = authHeader.split(' ')[1];

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find user by id
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'username', 'email']
    });

    if (!user) {
      logger.warn(`Auth failed: User id ${decoded.id} not found`);
      return res.status(401).json({ message: 'Invalid token: User not found.' });
    }

    // 5. Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    logger.error(`Auth Middleware Error: ${error.message}`);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;
