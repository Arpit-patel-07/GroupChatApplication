import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { Button, Avatar, Dropdown, Space, Typography } from 'antd';
import { UserOutlined, LogoutOutlined, WechatWorkOutlined } from '@ant-design/icons';

const { Text } = Typography;

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    {
      key: 'user-info',
      label: (
        <div className="px-2 py-1">
          <p className="font-semibold text-gray-800 m-0">{user?.username}</p>
          <p className="text-xs text-gray-500 m-0">{user?.email}</p>
        </div>
      )
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      danger: true,
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-40">
      {/* Brand Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xl shadow-md">
          <WechatWorkOutlined />
        </div>
        <div>
          <span className="font-bold text-lg text-gray-900 tracking-tight block leading-tight">
            GroupChat
          </span>
          <span className="text-xs text-gray-400 font-medium">Real-Time Rooms</span>
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
          <div className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <Avatar
              style={{ backgroundColor: '#2563eb' }}
              icon={<UserOutlined />}
            >
              {user?.username ? user.username[0].toUpperCase() : 'U'}
            </Avatar>
            <span className="hidden sm:inline font-medium text-gray-700 text-sm">
              {user?.username || 'User'}
            </span>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default Navbar;
