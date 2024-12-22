const jwt = require('jsonwebtoken');
const config = require('../config');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({
      error: 'Access denied. No token provided.'
    });
  }

  try {
    // Remove 'Bearer ' from token string
    const token = authHeader.replace('Bearer ', '');
    const verified = jwt.verify(token, config.jwtSecret);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(403).json({
      error: 'Invalid token.',
      details: config.nodeEnv === 'development' ? err.message : undefined
    });
  }
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({
        error: 'Access denied. Insufficient permissions.'
      });
    }
    next();
  };
};

module.exports = {
  authenticateJWT,
  requireRole
};
