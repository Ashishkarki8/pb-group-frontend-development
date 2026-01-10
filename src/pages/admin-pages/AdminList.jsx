//  ADMIN LIST PAGE (Super Admin Only)
// ========================================

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useAdminList } from '../../hooks/useAdmin';
import AdminTable from '../../components/features/admin/AdminTable';
import CreateAdminModal from '../../components/features/admin/CreateAdminModal';

const AdminList = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    role: '',
    status: '',
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch admins with filters
  const { data, isLoading, isError } = useAdminList(filters);

  const admins = data?.admins ?? [];
  const total = data?.total ?? 0;
  const currentPage = data?.page ?? filters.page;
  const limit = data?.limit ?? filters.limit;
  const fallbackTotalPages = Math.ceil(total / limit) || 1;
  const totalPages = data?.totalPages ?? fallbackTotalPages;
  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  // ========================================
  // HANDLERS
  // ========================================
  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleRoleFilter = (e) => {
    setFilters((prev) => ({ ...prev, role: e.target.value, page: 1 }));
  };

  const handleStatusFilter = (e) => {
    setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  // ========================================
  // RENDER
  // ========================================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
          <p className="text-gray-600 mt-2">Create and manage admin users</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Admin
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by username..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <select
            value={filters.role}
            onChange={handleRoleFilter}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="normal_admin">Normal Admin</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={handleStatusFilter}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="locked">Locked</option>
          </select>
        </div>
      </div>

      {/* Admin Table */}
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load admins</p>
          </div>
        ) : admins.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No admins found</p>
          </div>
        ) : (
          <>
            <AdminTable admins={admins} />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * limit + 1} to{' '}
                    {Math.min(currentPage * limit, total)} of {total} results
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!hasPrevPage}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!hasNextPage}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Admin Modal */}
      <CreateAdminModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default AdminList;