import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyGroups } from '../features/groups/groupSlice';
import Navbar from '../components/Navbar';
import GroupCard from '../components/GroupCard';
import CreateGroupModal from '../components/CreateGroupModal';
import JoinGroupModal from '../components/JoinGroupModal';
import { Button, Spin, Empty, Typography } from 'antd';
import { PlusOutlined, KeyOutlined, TeamOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { groups, loading } = useSelector((state) => state.groups);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMyGroups());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Welcome Header & Action Buttons */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold mb-2">
              <TeamOutlined /> Group Chat Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight m-0">
              Welcome, {user?.username || 'Friend'}! 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1 m-0">
              Create a custom chat room or join your team with a unique invite code.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button
              size="large"
              icon={<KeyOutlined />}
              onClick={() => setJoinModalOpen(true)}
              className="rounded-xl font-medium"
            >
              Join with Code
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => setCreateModalOpen(true)}
              className="rounded-xl bg-blue-600 font-medium"
            >
              Create Group
            </Button>
          </div>
        </div>

        {/* Groups Grid Section */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 m-0">
            My Groups ({groups.length})
          </h2>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Spin size="large" tip="Loading your groups..." />
          </div>
        ) : groups.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="text-gray-500 max-w-md mx-auto">
                  <p className="font-bold text-gray-800 text-base m-0 mb-1">
                    You haven't joined any groups yet
                  </p>
                  <p className="text-sm m-0">
                    Create your own chat group to get a shareable code, or enter an invite code from a friend!
                  </p>
                </div>
              }
            >
              <div className="flex justify-center gap-3 mt-4">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setCreateModalOpen(true)}
                  className="bg-blue-600 rounded-xl"
                >
                  Create Your First Group
                </Button>
                <Button
                  icon={<KeyOutlined />}
                  onClick={() => setJoinModalOpen(true)}
                  className="rounded-xl"
                >
                  Join Group
                </Button>
              </div>
            </Empty>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                currentUserId={user?.id}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <CreateGroupModal
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
      />
      <JoinGroupModal
        open={joinModalOpen}
        onCancel={() => setJoinModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
