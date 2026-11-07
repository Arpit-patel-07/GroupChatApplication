import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Tag, Button, Tooltip, message } from 'antd';
import { CopyOutlined, MessageOutlined, TeamOutlined } from '@ant-design/icons';

const GroupCard = ({ group, currentUserId }) => {
  const navigate = useNavigate();
  const isCreator = group.created_by === currentUserId;

  const handleCopyCode = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(group.invite_code);
    message.success(`Copied invite code: ${group.invite_code}`);
  };

  return (
    <Card
      hoverable
      className="border border-gray-200 rounded-2xl shadow-sm transition-all hover:shadow-md hover:border-blue-300"
      onClick={() => navigate(`/chat/${group.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold">
          {group.name ? group.name[0].toUpperCase() : 'G'}
        </div>
        {isCreator && (
          <Tag color="blue" className="rounded-full px-2.5 font-medium m-0">
            Admin
          </Tag>
        )}
      </div>

      <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
        {group.name}
      </h3>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        {/* Copy Invite Code Tag */}
        <Tooltip title="Click to copy invite code">
          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 text-xs font-mono font-medium bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-700 px-2.5 py-1 rounded-md transition-colors border border-gray-200"
          >
            <span>{group.invite_code}</span>
            <CopyOutlined className="text-xs" />
          </button>
        </Tooltip>

        <Button
          type="primary"
          size="small"
          icon={<MessageOutlined />}
          className="bg-blue-600 rounded-lg text-xs font-medium"
        >
          Chat
        </Button>
      </div>
    </Card>
  );
};

export default GroupCard;
