import axiosInstance from "./axiosInstance";

export const getSuperAdminDashboardApi = async () => {
  console.log('📡 [API] Fetching Super Admin Dashboard...');
  const response = await axiosInstance.get('/api/dashboard/super-admin');
  console.log('✅ [API] Super Admin Dashboard received:', response.data);
  return response.data; // { success, role, data: { admins, totalAdmins, ... } }
};

/**
 * Fetch Regular Admin Dashboard
 * GET /api/dashboard/admin
 */

export const getAdminDashboardApi = async () => {
  console.log('📡 [API] Fetching Admin Dashboard...');
  const response = await axiosInstance.get('/api/dashboard/admin');
  console.log('✅ [API] Admin Dashboard received:', response.data);
  return response.data;
};