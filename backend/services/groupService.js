const crypto = require('crypto');
const { Group, GroupMember, User } = require('../models');
const logger = require('../config/logger');

const generateInviteCode = () => {
  const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `CHAT-${randomHex}`;
};

// 1. CREATE GROUP SERVICE
const createGroup = async ({ name, userId, username }) => {
  if (!name || name.trim() === '') {
    throw new Error('Group name is required.');
  }

  // Generate unique invite code
  let invite_code = generateInviteCode();
  let exists = await Group.findOne({ where: { invite_code } });
  while (exists) {
    invite_code = generateInviteCode();
    exists = await Group.findOne({ where: { invite_code } });
  }

  // 1. Create group
  const group = await Group.create({
    name: name.trim(),
    invite_code,
    created_by: userId
  });

  // 2. Add creator as admin member
  await GroupMember.create({
    group_id: group.id,
    user_id: userId,
    role: 'admin'
  });

  logger.info(`GroupService: Created group "${group.name}" [${group.invite_code}] by user ${username || userId}`);

  return group;
};

// 2. JOIN GROUP BY INVITE CODE SERVICE
const joinGroupByCode = async ({ inviteCode, userId, username }) => {
  if (!inviteCode || inviteCode.trim() === '') {
    throw new Error('Invite code is required.');
  }

  const formattedCode = inviteCode.trim().toUpperCase();
  const group = await Group.findOne({ where: { invite_code: formattedCode } });

  if (!group) {
    const error = new Error('Invalid invite code. Group not found.');
    error.statusCode = 404;
    throw error;
  }

  const existingMembership = await GroupMember.findOne({
    where: { group_id: group.id, user_id: userId }
  });

  if (existingMembership) {
    const error = new Error('You have already joined this group.');
    error.statusCode = 400;
    throw error;
  }

  await GroupMember.create({
    group_id: group.id,
    user_id: userId,
    role: 'member'
  });

  logger.info(`GroupService: User ${username || userId} joined group "${group.name}"`);

  return group;
};

// 3. GET GROUPS FOR A USER SERVICE
const getUserGroups = async (userId) => {
  const memberships = await GroupMember.findAll({
    where: { user_id: userId }
  });

  const groupIds = memberships.map(m => m.group_id);

  if (groupIds.length === 0) {
    return [];
  }

  const groups = await Group.findAll({
    where: { id: groupIds },
    order: [['created_at', 'DESC']]
  });

  return groups;
};

// 4. GET GROUP DETAILS & MEMBERS SERVICE
const getGroupDetails = async ({ groupId, userId }) => {
  const group = await Group.findByPk(groupId);
  if (!group) {
    const error = new Error('Group not found.');
    error.statusCode = 404;
    throw error;
  }

  const isMember = await GroupMember.findOne({
    where: { group_id: groupId, user_id: userId }
  });

  if (!isMember) {
    const error = new Error('Access denied. You are not a member of this group.');
    error.statusCode = 403;
    throw error;
  }

  const members = await GroupMember.findAll({
    where: { group_id: groupId },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email']
      }
    ]
  });

  return { group, members };
};

// 5. LEAVE / CANCEL GROUP MEMBERSHIP SERVICE
const leaveGroup = async ({ groupId, userId, username }) => {
  const group = await Group.findByPk(groupId);
  if (!group) {
    const error = new Error('Group not found.');
    error.statusCode = 404;
    throw error;
  }

  // Find membership
  const membership = await GroupMember.findOne({
    where: { group_id: groupId, user_id: userId }
  });

  if (!membership) {
    const error = new Error('You are not a member of this group.');
    error.statusCode = 400;
    throw error;
  }

  // If user is creator, they should delete the group instead of leaving
  if (group.created_by === userId) {
    const error = new Error('As the creator, you cannot leave the group. You can delete the group instead.');
    error.statusCode = 400;
    throw error;
  }

  // Destroy membership
  await membership.destroy();

  logger.info(`GroupService: User ${username || userId} left group "${group.name}"`);

  return { message: 'Successfully left the group', groupId: Number(groupId) };
};

// 6. DELETE GROUP SERVICE (Admin / Creator Only)
const deleteGroup = async ({ groupId, userId, username }) => {
  const group = await Group.findByPk(groupId);
  if (!group) {
    const error = new Error('Group not found.');
    error.statusCode = 404;
    throw error;
  }

  // Check if requesting user is the creator or an admin
  const isAdminMember = await GroupMember.findOne({
    where: { group_id: groupId, user_id: userId, role: 'admin' }
  });

  if (group.created_by !== userId && !isAdminMember) {
    const error = new Error('Permission denied. Only group admins can delete the group.');
    error.statusCode = 403;
    throw error;
  }

  const groupName = group.name;
  // Cascades and deletes messages and group_members
  await group.destroy();

  logger.info(`GroupService: Group "${groupName}" (ID: ${groupId}) was deleted by user ${username || userId}`);

  return { message: `Group "${groupName}" deleted successfully`, groupId: Number(groupId) };
};

module.exports = {
  createGroup,
  joinGroupByCode,
  getUserGroups,
  getGroupDetails,
  leaveGroup,
  deleteGroup
};
