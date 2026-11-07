const messageService = require('../services/messageService');
const logger = require('../config/logger');

// Socket.io handlers using messageService
const setupChatSocket = (io) => {
  io.on('connection', (socket) => {
    logger.info(`Client connected to socket: ${socket.id}`);

    // 1. Join Group Room
    socket.on('join_room', (data) => {
      const { groupId, username } = data;
      if (!groupId) return;

      const roomName = `group_${groupId}`;
      socket.join(roomName);
      logger.info(`User [${username || 'Anonymous'}] (Socket ${socket.id}) joined ${roomName}`);

      socket.to(roomName).emit('user_joined', {
        message: `${username || 'A member'} has joined the chat.`
      });
    });

    // 2. Send Message
    socket.on('send_message', async (data) => {
      try {
        const { groupId, userId, messageText } = data;

        // Use messageService to save and populate sender
        const fullMessage = await messageService.saveMessage({
          groupId,
          userId,
          messageText
        });

        const roomName = `group_${groupId}`;
        // Broadcast message to everyone in the group room
        io.to(roomName).emit('receive_message', fullMessage);

        logger.info(`Message delivered to ${roomName} from user ID ${userId}`);
      } catch (error) {
        logger.error(`Socket send_message error: ${error.message}`);
        socket.emit('error_message', { message: error.message });
      }
    });

    // 3. Leave Room
    socket.on('leave_room', (data) => {
      const { groupId } = data;
      if (groupId) {
        const roomName = `group_${groupId}`;
        socket.leave(roomName);
        logger.info(`Socket ${socket.id} left ${roomName}`);
      }
    });

    // 4. Disconnect
    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = setupChatSocket;
