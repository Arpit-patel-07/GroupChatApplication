const express = require('express');
const router = express.Router();
const { getGroupMessages } = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected message history route
router.use(authMiddleware);
router.get('/:groupId', getGroupMessages);

module.exports = router;
