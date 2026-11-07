import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../features/auth/authSlice';
import { Card, Form, Input, Button, message, Typography } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, WechatWorkOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await dispatch(registerUser(values)).unwrap();
      message.success('Account created successfully! Welcome!');
      navigate('/');
    } catch (err) {
      message.error(err || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl border-0 p-2 sm:p-4">
        {/* Logo and Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-3xl shadow-md mx-auto mb-3">
            <WechatWorkOutlined />
          </div>
          <Title level={3} className="m-0 tracking-tight text-gray-900">
            Create an Account
          </Title>
          <Text type="secondary" className="text-sm">
            Join groups, share codes & chat in real-time
          </Text>
        </div>

        {/* Register Form */}
        <Form
          name="register_form"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          size="large"
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: 'Please enter a username' },
              { min: 3, message: 'Username must be at least 3 characters' }
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400 mr-1" />}
              placeholder="e.g. alex99"
              className="rounded-xl"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400 mr-1" />}
              placeholder="you@example.com"
              className="rounded-xl"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400 mr-1" />}
              placeholder="At least 6 characters"
              className="rounded-xl"
            />
          </Form.Item>

          <Form.Item className="mt-6 mb-3">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="rounded-xl bg-blue-600 font-semibold h-11"
            >
              Sign Up
            </Button>
          </Form.Item>

          <div className="text-center mt-4">
            <Text type="secondary" className="text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                Sign in
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
