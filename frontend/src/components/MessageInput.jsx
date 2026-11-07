import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';

const MessageInput = ({ onSendMessage }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-3 sm:p-4">
      <div className="flex items-center gap-2 max-w-4xl mx-auto">
        <Input
          size="large"
          placeholder="Type your message... (Press Enter to send)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="rounded-xl bg-gray-50 focus:bg-white"
        />
        <Button
          type="primary"
          size="large"
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={!text.trim()}
          className="rounded-xl bg-blue-600 flex items-center justify-center px-5 font-medium"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
