// ========================================
// ADMIN PROFILE PAGE
// ========================================

import { User, Shield, Calendar, Activity } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';

const AdminProfile = () => {
  const { user, isLoadingProfile } = useAuth();

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No profile data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">View your account information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12">
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-blue-600 uppercase">
              {user.username?.slice(0, 2)}
            </div>
            
            {/* Name & Role */}
            <div className="text-white">
              <h2 className="text-3xl font-bold">
                {user.username}
              </h2>
              <p className="text-blue-100 mt-1 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                {user.role === ROLES.SUPER_ADMIN ? 'Super Administrator' : 'Administrator'}
              </p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <InfoItem
              icon={User}
              label="Username"
              value={user.username}
            />

            {/* Role */}
            <InfoItem
              icon={Shield}
              label="Role"
              value={user.role === ROLES.SUPER_ADMIN ? 'Super Admin' : 'Normal Admin'}
            />

            {/* Status */}
            <InfoItem
              icon={Activity}
              label="Account Status"
              value={
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    user.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              }
            />

            {/* Created At */}
            <InfoItem
              icon={Calendar}
              label="Account Created"
              value={new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            />

            {/* Last Login */}
            <InfoItem
              icon={Calendar}
              label="Last Login"
              value={
                user.lastLogin
                  ? new Date(user.lastLogin).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Never'
              }
            />
          </div>
        </div>
      </div>

      {/* Security Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Security Information</h3>
        <ul className="text-blue-800 space-y-2 text-sm">
          <li>• Your password is encrypted and cannot be viewed</li>
          <li>• Your account is protected with secure authentication</li>
          <li>• Contact Super Admin if you need to reset your password</li>
        </ul>
      </div>
    </div>
  );
};

// ========================================
// INFO ITEM COMPONENT
// ========================================
const InfoItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base font-semibold text-gray-900 mt-1 break-words">{value}</p>
      </div>
    </div>
  );
};

export default AdminProfile;