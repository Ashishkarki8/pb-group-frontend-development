// ============================================
// BANNER API CALLS
// ============================================

import axiosInstance from "./axiosInstance";

/**
 * Get active banner (PUBLIC - no auth required)
 */
export const getActiveBannerApi = async () => {
  const response = await axiosInstance.get('/api/banners/active');
  return response.data;
};

/**
 * Get all banners with pagination (ADMIN)
 * @param {Object} params - { page, limit, status }
 */
export const getAllBannersApi = async ({ page = 1, limit = 10, status }) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (status) {
    params.append('status', status);
  }
  
  const response = await axiosInstance.get(`/api/banners?${params.toString()}`);
  return response.data;
};

/**
 * Create new banner (ADMIN)
 * @param {FormData} formData - Contains image, link, altText, isActive
 */
export const createBannerApi = async (formData) => {
  const response = await axiosInstance.post('/api/banners', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Update existing banner (ADMIN)
 * @param {string} bannerId
 * @param {FormData} formData - Contains image, link, altText, isActive
 */
export const updateBannerApi = async ({ bannerId, formData }) => {
  const response = await axiosInstance.put(`/api/banners/${bannerId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Delete banner (ADMIN)
 * @param {string} bannerId
 */
export const deleteBannerApi = async (bannerId) => {
  const response = await axiosInstance.delete(`/api/banners/${bannerId}`);
  return response.data;
};