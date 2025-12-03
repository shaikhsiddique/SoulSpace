const { userModel } = require('../models/user.model.js');
const redisClient = require('../service/redis.service.js');
const { verifyToken } = require('../utils/jwt.js');

/**
 * Socket.IO authentication middleware
 * Authenticates socket connections using JWT token
 */
const socketAuth = async (socket, next) => {
  try {
    // Get token from handshake auth or query
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    // Check if token is blacklisted
    const isBlacklisted = await redisClient.get(token);
    if (isBlacklisted) {
      return next(new Error("Authentication error: Invalid or expired token"));
    }

    // Verify token
    const decoded = await verifyToken(token);
    
    // Get user from database
    const user = await userModel.findById(decoded.id).select('-password');
    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    // Attach user to socket for later use
    socket.user = user;
    socket.token = token;
    
    next();
  } catch (error) {
    next(new Error(`Authentication error: ${error.message}`));
  }
};

module.exports = socketAuth;






