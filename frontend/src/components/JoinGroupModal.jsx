import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { joinGroupByCode } from '../features/groups/groupSlice';
import { Modal, Form, Input, Button, message } from 'antd';
import { KeyOutlined } from '@ant-design/icons';

const JoinGroupModal = ({ open, onCancel }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const group = await dispatch(joinGroupByCode(values.invite_code.trim())).unwrap();
      message.success(`Joined "${group.name}" successfully!`);
      form.resetFields();
      onCancel();
    } catch (err) {
      message.error(err || 'Failed to join group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-lg">
          <KeyOutlined className="text-blue-600" />
          <span>Join Group by Code</span>
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
          name="invite_code"
          label="Invite Code"
          rules={[
            { required: true, message: 'Please paste or enter the invite code' }
          ]}
        >
          <Input
            placeholder="e.g. CHAT-EA645B"
            size="large"
            autoFocus
            style={{ textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}
          />
        </Form.Item>

        <p className="text-xs text-gray-500 mb-4">
          Ask a group member or admin to share their group invite code with you.
        </p>

        <div className="flex justify-end gap-2">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading} className="bg-blue-600">
            Join Group
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default JoinGroupModal;
