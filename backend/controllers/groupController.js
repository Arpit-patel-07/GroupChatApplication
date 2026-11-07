const groupService = require('../services/groupService');
const logger = require('../config/logger');

// 1. CREATE GROUP
const createGroup = async (req, res) => {
  try {
    const group = await groupService.createGroup({
      name: req.body.name,
      userId: req.user.id,
      username: req.user.username
    });

    return res.status(201).json({
      message: 'Group created successfully',
      group
    });
  } catch (error) {
    logger.error(`CreateGroup Controller Error: ${error.message}`);
    const status = error.statusCode || 400;
    return res.status(status).json({ message: error.message });
  }
};

// 2. JOIN GROUP BY INVITE CODE
const joinGroupByCode = async (req, res) => {
  try {
    const group = await groupService.joinGroupByCode({
      inviteCode: req.body.invite_code,
      userId: req.user.id,
      username: req.user.username
    });

    return res.status(200).json({
      message: 'Joined group successfully',
      group
    });
  } catch (error) {
    logger.error(`JoinGroup Controller Error: ${error.message}`);
    const status = error.statusCode || 400;
    return res.status(status).json({ message: error.message });
  }
};

// 3. GET MY GROUPS
const getMyGroups = async (req, res) => {
  try {
    const groups = await groupService.getUserGroups(req.user.id);
    return res.status(200).json({ groups });
  } catch (error) {
    logger.error(`GetMyGroups Controller Error: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

// 4. GET GROUP DETAILS & MEMBERS
const getGroupDetails = async (req, res) => {
  try {
    const data = await groupService.getGroupDetails({
      groupId: req.params.groupId,
      userId: req.user.id
    });

    return res.status(200).json(data);
  } catch (error) {
    logger.error(`GetGroupDetails Controller Error: ${error.message}`);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message });
  }
};

// 5. LEAVE / CANCEL MEMBERSHIP IN GROUP
const leaveGroup = async (req, res) => {
  try {
    const result = await groupService.leaveGroup({
      groupId: req.params.groupId,
      userId: req.user.id,
      username: req.user.username
    });

    return res.status(200).json(result);
  } catch (error) {
    logger.error(`LeaveGroup Controller Error: ${error.message}`);
    const status = error.statusCode || 400;
    return res.status(status).json({ message: error.message });
  }
};

// 6. DELETE GROUP
const deleteGroup = async (req, res) => {
  try {
    const result = await groupService.deleteGroup({
      groupId: req.params.groupId,
      userId: req.user.id,
      username: req.user.username
    });

    return res.status(200).json(result);
  } catch (error) {
    logger.error(`DeleteGroup Controller Error: ${error.message}`);
    const status = error.statusCode || 400;
    return res.status(status).json({ message: error.message });
  }
};

module.exports = {
  createGroup,
  joinGroupByCode,
  getMyGroups,
  getGroupDetails,
  leaveGroup,
  deleteGroup
};
