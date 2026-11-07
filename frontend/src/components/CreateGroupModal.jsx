import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createGroup } from '../features/groups/groupSlice';
import { Modal, Form, Input, Button, message } from 'antd';
import { TeamOutlined } from '@ant-design/icons';

const CreateGroupModal = ({ open, onCancel }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await dispatch(createGroup(values.name)).unwrap();
      message.success('Group created successfully with a unique invite code!');
      form.resetFields();
      onCancel();
    } catch (err) {
      message.error(err || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-lg">
          <TeamOutlined className="text-blue-600" />
          <span>Create New Group</span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        <Form.Item
          name="name"
          label="Group Name"
          rules={[
            { required: true, message: 'Please enter a group name' },
            { min: 2, message: 'Group name must be at least 2 characters' }
          ]}
        >
          <Input
            placeholder="e.g. Frontend Developers, College Friends"
            size="large"
            autoFocus
          />
        </Form.Item>

        <p className="text-xs text-gray-500 mb-4">
          A unique 6-character invite code (e.g. <code>CHAT-XXXXXX</code>) will be generated automatically for you to share with others.
        </p>

        <div className="flex justify-end gap-2">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading} className="bg-blue-600">
            Create Group
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateGroupModal;
