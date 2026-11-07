import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { leaveGroup, deleteGroup } from '../features/groups/groupSlice';
import MemberListModal from './MemberListModal';
import { Button, Tooltip, Popconfirm, Dropdown, message, Tag } from 'antd';
import {
  ArrowLeftOutlined,
  CopyOutlined,
  TeamOutlined,
  MoreOutlined,
  LogoutOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const ChatHeader = ({ group, members, currentUser }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [membersModalOpen, setMembersModalOpen] = useState(false);

  const isCreator = group?.created_by === currentUser?.id;

  const handleCopyCode = () => {
    if (group?.invite_code) {
      navigator.clipboard.writeText(group.invite_code);
      message.success(`Invite code copied: ${group.invite_code}`);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await dispatch(leaveGroup(group.id)).unwrap();
      message.success('You have left the group.');
      navigate('/');
    } catch (err) {
      message.error(err || 'Failed to leave group');
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await dispatch(deleteGroup(group.id)).unwrap();
      message.success('Group deleted successfully.');
      navigate('/');
    } catch (err) {
      message.error(err || 'Failed to delete group');
    }
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        {/* Left: Back button + Group Info */}
        <div className="flex items-center gap-3">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-800"
          />

          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            {group?.name ? group.name[0].toUpperCase() : 'G'}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-900 m-0 leading-tight">
                {group?.name}
              </h2>
              {isCreator && (
                <Tag color="blue" className="text-xs rounded-full px-2">
                  Admin
                </Tag>
              )}
            </div>

            {/* Invite code display */}
            <Tooltip title="Click to copy invite code">
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 font-mono mt-0.5"
              >
                <span>Code: {group?.invite_code}</span>
                <CopyOutlined className="text-xs" />
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Members button */}
          <Button
            icon={<TeamOutlined />}
            onClick={() => setMembersModalOpen(true)}
            className="flex items-center text-xs sm:text-sm font-medium"
          >
            <span className="hidden sm:inline">Members</span> ({members?.length || 0})
          </Button>

          {/* Leave group (if not creator) */}
          {!isCreator && (
            <Popconfirm
              title="Leave Group"
              description="Are you sure you want to leave this group?"
              onConfirm={handleLeaveGroup}
              okText="Yes, Leave"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<LogoutOutlined />} className="text-xs sm:text-sm">
                <span className="hidden sm:inline">Leave</span>
              </Button>
            </Popconfirm>
          )}

          {/* Delete group (only if creator) */}
          {isCreator && (
            <Popconfirm
              title="Delete Group"
              description="Are you sure you want to delete this group? All messages and memberships will be removed permanently."
              onConfirm={handleDeleteGroup}
              okText="Yes, Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<DeleteOutlined />} className="text-xs sm:text-sm">
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </Popconfirm>
          )}
        </div>
      </div>

      {/* Member list modal */}
      <MemberListModal
        open={membersModalOpen}
        onCancel={() => setMembersModalOpen(false)}
        members={members}
        groupName={group?.name}
      />
    </>
  );
};

export default ChatHeader;
