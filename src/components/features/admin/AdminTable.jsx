// ========================================
// ADMIN TABLE COMPONENT
// ========================================

import { useState } from 'react';
import { MoreVertical, Shield, User } from 'lucide-react';
import { ROLES } from '../../../utils/constants';
import useAdminManagement from '../../../hooks/useAdmin';

const AdminTable = ({ admins }) => {
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const {
    deactivateAdmin,
    reactivateAdmin,
    resetPassword,
    deleteAdmin,
    isDeactivating,
    isReactivating,
    isDeleting,
  } = useAdminManagement();

  // ========================================
  // HANDLERS
  // ========================================
  const handleDeactivate = (id) => {
    if (window.confirm('Are you sure you want to deactivate this admin?')) {
      deactivateAdmin({ id, reason: 'Admin deactivated by Super Admin' });
      setActionMenuOpen(null);
    }
  };

  const handleReactivate = (id) => {
    if (window.confirm('Are you sure you want to reactivate this admin?')) {
      reactivateAdmin(id);
      setActionMenuOpen(null);
    }
  };

  const handleResetPassword = (id) => {
    const newPassword = prompt('Enter new password (min 8 characters):');
    if (newPassword && newPassword.length >= 8) {
      resetPassword({ id, newPassword });
      setActionMenuOpen(null);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('⚠️ PERMANENT ACTION: Delete this admin? This cannot be undone!')) {
      deleteAdmin(id);
      setActionMenuOpen(null);
    }
  };

  // ========================================
  // RENDER
  // ========================================
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Admin
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Login
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {admins.map((admin) => {
            const initials = admin.username?.slice(0, 2)?.toUpperCase() || 'AD';
            const isLocked = admin.isLocked;

            return (
              <tr key={admin._id} className="hover:bg-gray-50">
              {/* Admin Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600 uppercase">
                      {initials}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {admin.username}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {admin._id}
                      </div>
                    </div>
                  </div>
                </td>

              {/* Role */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    admin.role === ROLES.SUPER_ADMIN
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {admin.role === ROLES.SUPER_ADMIN ? (
                    <><Shield className="w-3 h-3 mr-1" /> Super Admin</>
                  ) : (
                    <><User className="w-3 h-3 mr-1" /> Normal Admin</>
                  )}
                </span>
              </td>

              {/* Status */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    isLocked
                      ? 'bg-red-100 text-red-800'
                      : admin.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {isLocked ? 'Locked' : admin.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>

              {/* Last Login */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {admin.lastLogin
                      ? new Date(admin.lastLogin).toLocaleDateString()
                      : 'Never'}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {admin.role !== ROLES.SUPER_ADMIN && (
                  <div className="relative">
                    <button
                      onClick={() => setActionMenuOpen(actionMenuOpen === admin._id ? null : admin._id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {/* Action Menu */}
                    {actionMenuOpen === admin._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <button
                          onClick={() => handleResetPassword(admin._id)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Reset Password
                        </button>
                        {admin.isActive ? (
                          <button
                            onClick={() => handleDeactivate(admin._id)}
                            className="block w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50"
                            disabled={isDeactivating}
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReactivate(admin._id)}
                            className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                            disabled={isReactivating}
                          >
                            Reactivate
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(admin._id)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100"
                          disabled={isDeleting || admin.isActive}
                        >
                          Delete (must deactivate first)
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </td>
            </tr>
          );
        })} 
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;