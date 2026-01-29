// ============================================
// SERVICE API CALLS
// ============================================

import axiosInstance from "./axiosInstance";

/**
 * Get active/published services for homepage (PUBLIC - no auth required)
 * @param {Object} params - { showOnHomepage }
 */
export const getActiveServicesApi = async ({ showOnHomepage = true } = {}) => {
  const params = new URLSearchParams();
  
  if (showOnHomepage !== undefined) {
    params.append('showOnHomepage', showOnHomepage.toString());
  }
  
  const response = await axiosInstance.get(`/api/services/active?${params.toString()}`);
  return response.data;
};

/**
 * Get single service by slug (PUBLIC)
 * @param {string} slug - Service slug
 */
export const getServiceBySlugApi = async (slug) => {
  const response = await axiosInstance.get(`/api/services/slug/${slug}`);
  return response.data;
};

/**
 * Get all services with pagination, search & filters (ADMIN)
 * ✅ Now supports abort signals to cancel requests
 * @param {Object} params - { page, limit, status, search, showOnHomepage }
 * @param {AbortSignal} signal - Optional abort signal for request cancellation
 */
export const getAllServicesApi = async ({ 
  page = 1, 
  limit = 10, 
  status, 
  search = '',
  showOnHomepage 
} = {}, signal = null) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  // Add optional filters
  if (status) {
    params.append('status', status); // 'active' | 'inactive'
  }
  
  if (search && search.trim()) {
    params.append('search', search.trim()); // Search by title, slug, description
  }
  
  if (showOnHomepage !== undefined) {
    params.append('showOnHomepage', showOnHomepage.toString());
  }
  
  const response = await axiosInstance.get(`/api/services?${params.toString()}`, {
    signal, // ✅ Pass abort signal to axios
  });
  return response.data;
};

/**
 * Create new service (ADMIN)
 * @param {FormData} formData - Contains all service data + heroImage file
 */
export const createServiceApi = async (formData) => {
  const response = await axiosInstance.post('/api/services', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Update existing service (ADMIN)
 * @param {Object} params
 * @param {string} params.serviceId - Service ID
 * @param {FormData} params.formData - Updated service data + optional new heroImage
 */
export const updateServiceApi = async ({ serviceId, formData }) => {
  const response = await axiosInstance.put(`/api/services/${serviceId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Delete service (ADMIN)
 * @param {string} serviceId - Service ID
 */
export const deleteServiceApi = async (serviceId) => {
  const response = await axiosInstance.delete(`/api/services/${serviceId}`);
  return response.data;
};

/**
 * Bulk update display order (ADMIN)
 * @param {Array} orderData - [{ serviceId, displayOrder }, ...]
 */
export const updateServiceOrderApi = async (orderData) => {
  const response = await axiosInstance.patch('/api/services/reorder', { orderData });
  return response.data;
};

/**
 * Toggle service publish status (ADMIN)
 * @param {string} serviceId
 * @param {boolean} isPublished
 */
export const toggleServicePublishApi = async ({ serviceId, isPublished }) => {
  const response = await axiosInstance.patch(`/api/services/${serviceId}/publish`, {
    isPublished,
  });
  return response.data;
};