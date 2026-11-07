const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

// Logger & DB
const logger = require('./config/logger');
const { sequelize } = require('./models');

// Routes
const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Sockets
const setupChatSocket = require('./sockets/chatSocket');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: '*', // Allow connections from frontend
    methods: ['GET', 'POST']
  }
});

// Setup Real-time Sockets
setupChatSocket(io);

// Express Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware using Winston
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/messages', messageRoutes);

// Health Check route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Group Chat Application Backend is running' });
});

// Global 404 Route
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error(`Unhandled Error: ${err.message}`, { stack: err.stack });
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;

// Start Server & Sync Database
const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('MySQL Database connected successfully!');

    // Sync database tables (creates tables if they don't exist)
    await sequelize.sync();
    logger.info('All Sequelize models synchronized with MySQL.');

    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} (http://localhost:${PORT})`);
      logger.info('Socket.io ready for real-time chat.');
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
