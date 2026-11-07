import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroupDetails, clearActiveGroup } from '../features/groups/groupSlice';
import { fetchMessages, receiveMessage, clearMessages } from '../features/chat/chatSlice';
import { getSocket } from '../services/socket';
import ChatHeader from '../components/ChatHeader';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import { Spin } from 'antd';

const ChatRoom = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { activeGroup, members, loading: groupLoading } = useSelector((state) => state.groups);
  const { messages, loading: messagesLoading } = useSelector((state) => state.chat);

  const [systemNotification, setSystemNotification] = useState('');

  // 1. Fetch initial group details and past message history
  useEffect(() => {
    if (groupId) {
      dispatch(fetchGroupDetails(groupId))
        .unwrap()
        .catch(() => {
          navigate('/');
        });
      dispatch(fetchMessages(groupId));
    }

    return () => {
      dispatch(clearMessages());
      dispatch(clearActiveGroup());
    };
  }, [groupId, dispatch, navigate]);

  // 2. Real-time Socket.io Connection & Event Listeners
  useEffect(() => {
    if (!groupId || !user) return;

    const socket = getSocket();

    // Join group room
    socket.emit('join_room', {
      groupId: Number(groupId),
      username: user.username
    });

    // Listen for incoming messages
    const handleReceiveMessage = (newMessage) => {
      // Ensure message belongs to current room
      if (Number(newMessage.group_id) === Number(groupId)) {
        dispatch(receiveMessage(newMessage));
      }
    };

    // Listen for member join announcements
    const handleUserJoined = (data) => {
      setSystemNotification(data.message);
      // Auto-clear notification after 4 seconds
      setTimeout(() => setSystemNotification(''), 4000);
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_joined', handleUserJoined);

    // Cleanup on unmount or room change
    return () => {
      socket.emit('leave_room', { groupId: Number(groupId) });
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_joined', handleUserJoined);
    };
  }, [groupId, user, dispatch]);

  // 3. Send message via Socket.io
  const handleSendMessage = (messageText) => {
    if (!groupId || !user || !messageText.trim()) return;

    const socket = getSocket();
    socket.emit('send_message', {
      groupId: Number(groupId),
      userId: user.id,
      messageText: messageText.trim()
    });
  };

  if (groupLoading && !activeGroup) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Spin size="large" tip="Loading chat room..." />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* Group Chat Header */}
      <ChatHeader
        group={activeGroup}
        members={members}
        currentUser={user}
      />

      {/* Real-time Message Stream */}
      <MessageList
        messages={messages}
        currentUserId={user?.id}
        systemNotification={systemNotification}
      />

      {/* Message Input Box */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatRoom;
