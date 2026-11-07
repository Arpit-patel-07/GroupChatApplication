const { sequelize } = require('../config/db');
const User = require('./User');
const Group = require('./Group');
const GroupMember = require('./GroupMember');
const Message = require('./Message');

// User created Groups
User.hasMany(Group, { foreignKey: 'created_by', as: 'createdGroups' });
Group.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Group membership
User.belongsToMany(Group, { through: GroupMember, foreignKey: 'user_id', as: 'groups' });
Group.belongsToMany(User, { through: GroupMember, foreignKey: 'group_id', as: 'members' });

User.hasMany(GroupMember, { foreignKey: 'user_id', as: 'memberships' });
GroupMember.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Group.hasMany(GroupMember, { foreignKey: 'group_id', as: 'groupMembers' });
GroupMember.belongsTo(Group, { foreignKey: 'group_id', as: 'group' });

// Messages
Group.hasMany(Message, { foreignKey: 'group_id', as: 'messages' });
Message.belongsTo(Group, { foreignKey: 'group_id', as: 'group' });

User.hasMany(Message, { foreignKey: 'user_id', as: 'messages' });
Message.belongsTo(User, { foreignKey: 'user_id', as: 'sender' });

module.exports = {
  sequelize,
  User,
  Group,
  GroupMember,
  Message
};
