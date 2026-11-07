import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const MessageItem = ({ message, isMe }) => {
  const senderName = message.sender?.username || 'Member';
  const time = dayjs(message.createdAt || message.created_at).format('h:mm A');

  if (isMe) {
    return (
      <div className="flex justify-end mb-3">
        <div className="max-w-[75%] sm:max-w-[65%]">
          <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm">
            <p className="text-sm leading-relaxed m-0 break-words whitespace-pre-wrap">
              {message.message_text}
            </p>
          </div>
          <div className="text-right mt-1">
            <span className="text-[11px] text-gray-400 font-medium">{time}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5 mb-3">
      <Avatar
        size={32}
        style={{ backgroundColor: '#475569' }}
        icon={<UserOutlined />}
        className="flex-shrink-0 mt-1"
      >
        {senderName[0].toUpperCase()}
      </Avatar>

      <div className="max-w-[75%] sm:max-w-[65%]">
        <span className="text-xs font-semibold text-gray-600 block mb-0.5 ml-1">
          {senderName}
        </span>
        <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm">
          <p className="text-sm leading-relaxed m-0 break-words whitespace-pre-wrap">
            {message.message_text}
          </p>
        </div>
        <div className="text-left mt-1 ml-1">
          <span className="text-[11px] text-gray-400 font-medium">{time}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
