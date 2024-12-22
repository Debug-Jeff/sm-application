require('dotenv').config();

module.exports = {
  // Database
  databaseUrl: process.env.DATABASE_URL,
  
  // Authentication
  jwtSecret: process.env.JWT_SECRET,
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,
  
  // Server
  port: parseInt(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Security
  sessionSecret: process.env.SESSION_SECRET,
  
  // Socket
  socketPort: parseInt(process.env.SOCKET_PORT) || 3001,
  
  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },
  
  // Encryption
  encryptionKey: process.env.ENCRYPTION_KEY
};
