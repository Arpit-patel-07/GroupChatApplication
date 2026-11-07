import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import { Empty } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

const MessageList = ({ messages, currentUserId, systemNotification }) => {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom whenever messages array changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, systemNotification]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-gray-500">
                <p className="font-semibold text-gray-700 m-0">No messages yet</p>
                <p className="text-xs m-0">Say hello and start the conversation!</p>
              </div>
            }
          />
        </div>
      ) : (
        <div>
          {messages.map((msg) => {
            const isMe = String(msg.user_id) === String(currentUserId);
            return <MessageItem key={msg.id} message={msg} isMe={isMe} />;
          })}
        </div>
      )}

      {/* System join notification banner */}
      {systemNotification && (
        <div className="text-center my-3">
          <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm">
            {systemNotification}
          </span>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
