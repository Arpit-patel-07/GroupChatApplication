import React from 'react';
import { Modal, List, Avatar, Tag } from 'antd';
import { UserOutlined, CrownOutlined } from '@ant-design/icons';

const MemberListModal = ({ open, onCancel, members, groupName }) => {
  return (
    <Modal
      title={
        <div>
          <span className="text-base font-semibold">{groupName} — Members</span>
          <span className="text-xs text-gray-500 block font-normal">
            Total {members?.length || 0} members
          </span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <List
        itemLayout="horizontal"
        dataSource={members || []}
        className="max-h-96 overflow-y-auto"
        renderItem={(item) => {
          const isAdmin = item.role === 'admin';
          const username = item.user?.username || 'Member';
          const email = item.user?.email || '';

          return (
            <List.Item className="px-2 py-3">
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{ backgroundColor: isAdmin ? '#f59e0b' : '#3b82f6' }}
                    icon={<UserOutlined />}
                  >
                    {username[0].toUpperCase()}
                  </Avatar>
                }
                title={
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{username}</span>
                    {isAdmin && (
                      <Tag color="gold" icon={<CrownOutlined />} className="text-xs">
                        Admin
                      </Tag>
                    )}
                  </div>
                }
                description={<span className="text-xs text-gray-400">{email}</span>}
              />
            </List.Item>
          );
        }}
      />
    </Modal>
  );
};

export default MemberListModal;
