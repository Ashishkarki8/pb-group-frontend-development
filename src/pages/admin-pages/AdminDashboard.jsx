import React from 'react';
import {
  Users,
  BookOpen,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  Shield,
  Activity,
  UserCheck,
  Settings as SettingsIcon
} from 'lucide-react';

import useAuthStore from '../../store/authStore';
import { Link } from 'react-router-dom';
import { useAdminDashboard, useSuperAdminDashboard } from '../../api/useDashboard';
import LoadingFallback from '../../components/LoadingFallback';

// Mock data for charts



// Stat Card Component
const StatCard = ({ title, value, change, icon: Icon, trend }) => {
  const isPositive = trend === 'up';
  
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <div className={`flex items-center mt-2 text-sm ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="ml-1 font-medium">{change}</span>
            <span className="text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
        <div className="p-4 bg-blue-50 rounded-xl">
          <Icon size={24} className="text-blue-600" />
        </div>
      </div>
    </div>
  );
};

// SuperAdmin Dashboard View
const SuperAdminDashboard = ({ user }) => {
   const { data, isLoading, isError, error, refetch } = useSuperAdminDashboard();
     // Show loading spinner
  if (isLoading) {
    return <LoadingFallback/>;
  }

  // Handle errors
  if (isError) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }
   return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center space-x-3 mb-2">
          <Shield size={28} />
          <h2 className="text-2xl font-bold">Super Admin Dashboard</h2>
        </div>
        <p className="text-blue-100">
          Welcome back, {user?.username}! You have full system access.
        </p>
         <Link to={"/admin/testing"}>click here</Link>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Admin"
          value={data.totalAdmins}
          change="+12%"
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Active Courses"
          value="24"
          change="+8%"
          icon={BookOpen}
          trend="up"
        />
        <StatCard
          title="Total Revenue"
          value="₹1,25,000"
          change="+15%"
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Active Teachers"
          value="18"
          change="+2"
          icon={UserCheck}
          trend="up"
        />
      </div>
         <div className="card">
        <h2>All Admins ({data.admins.count})</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {data.admins.list.map((admin) => (
              <tr key={admin._id}>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>{admin.status}</td>
                <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <Activity size={24} className="text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">System Health</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Server Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Storage Used</span>
              <span className="text-gray-900 font-medium">65%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <Users size={24} className="text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">User Management</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Users</span>
              <span className="text-gray-900 font-medium">1,283</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active Today</span>
              <span className="text-gray-900 font-medium">847</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">New This Week</span>
              <span className="text-gray-900 font-medium">42</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <SettingsIcon size={24} className="text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
          </div>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-left">
              Manage Admins
            </button>
            <button className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-left">
              System Settings
            </button>
            <button className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-left">
              View Logs
            </button>
          </div>
        </div>
      </div>

    
    </div>
  );
};

// Regular Admin Dashboard View
const RegularAdminDashboard = ({ user }) => {
  const { data, isLoading, isError, error } = useAdminDashboard();
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center space-x-3 mb-2">
          <UserCheck size={28} />
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        </div>
        <p className="text-indigo-100">
          Welcome back, {user?.username}! Here's your overview.
        </p>
        <Link to={"/admin/testing"}>click here</Link>
      </div>
     
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value="1,247"
          change="+12%"
          icon={Users}
        />
        <StatCard
          title="Active Courses"
          value="24"
          change="+8%"
          icon={BookOpen}
          trend="up"
        />
        <StatCard
          title="Revenue"
          value="₹1,25,000"
          change="+15%"
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="This Month"
          value="225"
          change="-3%"
          icon={Calendar}
          trend="down"
        />
      </div>
      
       {/* Total Admins Card */}
      <div className="card">
        <h2>Total Admins</h2>
        <p className="text-4xl">{data.totalAdmins}</p>
      </div>
      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { user: 'Aashish Sharma', action: 'completed Data Science Module 3', time: '2 hours ago' },
              { user: 'Priya Thapa', action: 'enrolled in Statistics Course', time: '4 hours ago' },
              { user: 'Rajesh Gurung', action: 'submitted assignment for Research Methods', time: '6 hours ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {activity.user.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">
                    <span className="text-blue-600">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-gray-500 text-sm">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function AdminDashboard() {
  const { user } = useAuthStore();

  console.log('👤 AdminDashboard: Current user:', user);
  
  // Render based on role
  if (user?.role === 'super_admin') {
    return <SuperAdminDashboard user={user} />;
  }

  return <RegularAdminDashboard user={user} />;
}