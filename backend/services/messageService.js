const { Message, GroupMember, User } = require('../models');
const logger = require('../config/logger');

// 1. SAVE NEW MESSAGE SERVICE (used by Socket.io & REST)
const saveMessage = async ({ groupId, userId, messageText }) => {
  if (!groupId || !userId || !messageText || messageText.trim() === '') {
    throw new Error('Group ID, user ID, and message text are required.');
  }

  // Save to database
  const saved = await Message.create({
    group_id: groupId,
    user_id: userId,
    message_text: messageText.trim()
  });

  // Fetch with sender username
  const fullMessage = await Message.findByPk(saved.id, {
    include: [
      {
        model: User,
        as: 'sender',
        attributes: ['id', 'username']
      }
    ]
  });

  logger.info(`MessageService: Saved message ID ${saved.id} for group ${groupId}`);

  return fullMessage;
};

// 2. GET MESSAGES FOR A GROUP SERVICE
const getGroupMessages = async ({ groupId, userId }) => {
  // Check membership
  const isMember = await GroupMember.findOne({
    where: { group_id: groupId, user_id: userId }
  });

  if (!isMember) {
    const error = new Error('Access denied. You are not a member of this group.');
    error.statusCode = 403;
    throw error;
  }

  // Fetch messages in chronological order
  const messages = await Message.findAll({
    where: { group_id: groupId },
    include: [
      {
        model: User,
        as: 'sender',
        attributes: ['id', 'username']
      }
    ],
    order: [['created_at', 'ASC']]
  });

  return messages;
};

module.exports = {
  saveMessage,
  getGroupMessages
};
