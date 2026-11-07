const express = require('express');
const router = express.Router();
const {
  createGroup,
  joinGroupByCode,
  getMyGroups,
  getGroupDetails,
  leaveGroup,
  deleteGroup
} = require('../controllers/groupController');
const authMiddleware = require('../middleware/authMiddleware');

// All group routes are protected with JWT
router.use(authMiddleware);

router.post('/create', createGroup);
router.post('/join', joinGroupByCode);
router.get('/my-groups', getMyGroups);
router.get('/:groupId/details', getGroupDetails);
router.post('/:groupId/leave', leaveGroup);
router.delete('/:groupId', deleteGroup);

module.exports = router;
