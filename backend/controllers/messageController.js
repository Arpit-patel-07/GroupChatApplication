const messageService = require('../services/messageService');
const logger = require('../config/logger');

// GET GROUP MESSAGES
const getGroupMessages = async (req, res) => {
  try {
    const messages = await messageService.getGroupMessages({
      groupId: req.params.groupId,
      userId: req.user.id
    });

    return res.status(200).json({ messages });
  } catch (error) {
    logger.error(`GetMessages Controller Error: ${error.message}`);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message });
  }
};

module.exports = {
  getGroupMessages
};
