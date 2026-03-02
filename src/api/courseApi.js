// ============================================
// COURSE API CALLS
// ============================================

import axiosInstance from "./axiosInstance";

// ─── PUBLIC ROUTES ───────────────────────────────────────────────────────────

/**
 * Get courses for homepage widget (PUBLIC)
 * @param {Object} params - { category }
 */
export const getHomepageCoursesApi = async ({ category } = {}) => {
  const params = new URLSearchParams();
  if (category && category !== "All") {
    params.append("category", category);
  }
  const response = await axiosInstance.get(
    `/api/courses/homepage?${params.toString()}`
  );
  return response.data;
};

/**
 * Get all published courses with full filtering (PUBLIC - /courses page)
 * @param {Object} params
 * @param {AbortSignal} signal - Optional abort signal
 */
export const getPublicCoursesApi = async (
  {
    page = 1,
    limit = 12,
    category,
    level,
    mode,
    status,
    isTrending,
    upcoming,
    search = "",
    sortBy = "displayOrder",
  } = {},
  signal = null
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
  });

  if (category && category !== "All") params.append("category", category);
  if (level) params.append("level", level);
  if (mode) params.append("mode", mode);
  if (status) params.append("status", status);
  if (isTrending) params.append("isTrending", isTrending.toString());
  if (upcoming) params.append("upcoming", upcoming.toString());
  if (search && search.trim()) params.append("search", search.trim());

  const response = await axiosInstance.get(
    `/api/courses/public?${params.toString()}`,
    { signal }
  );
  return response.data;
};

/**
 * Get all distinct course categories (PUBLIC)
 */
export const getCoursesCategoriesApi = async () => {
  const response = await axiosInstance.get("/api/courses/categories");
  return response.data;
};

/**
 * Get single course by slug (PUBLIC)
 * @param {string} slug
 */
export const getCourseBySlugApi = async (slug) => {
  const response = await axiosInstance.get(`/api/courses/slug/${slug}`);
  return response.data;
};

// ─── ADMIN ROUTES ─────────────────────────────────────────────────────────────

/**
 * Get all courses with full admin filters (ADMIN)
 * @param {Object} params
 * @param {AbortSignal} signal
 */
export const getAllCoursesApi = async (
  {
    page = 1,
    limit = 10,
    status,
    search = "",
    category,
    level,
    isPublished,
    isTrending,
    showOnHomepage,
    sortBy = "displayOrder",
  } = {},
  signal = null
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
  });

  if (status) params.append("status", status);
  if (search && search.trim()) params.append("search", search.trim());
  if (category) params.append("category", category);
  if (level) params.append("level", level);
  if (isPublished !== undefined) params.append("isPublished", isPublished.toString());
  if (isTrending !== undefined) params.append("isTrending", isTrending.toString());
  if (showOnHomepage !== undefined)
    params.append("showOnHomepage", showOnHomepage.toString());

  const response = await axiosInstance.get(
    `/api/courses?${params.toString()}`,
    { signal }
  );
  return response.data;
};

/**
 * Create new course (ADMIN)
 * @param {FormData} formData - All course data + heroImage file
 */
export const createCourseApi = async (formData) => {
  const response = await axiosInstance.post("/api/courses", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * Update existing course (ADMIN)
 * @param {Object} params
 * @param {string} params.courseId
 * @param {FormData} params.formData
 */
export const updateCourseApi = async ({ courseId, formData }) => {
  const response = await axiosInstance.put(
    `/api/courses/${courseId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

/**
 * Delete course (ADMIN)
 * @param {string} courseId
 */
export const deleteCourseApi = async (courseId) => {
  const response = await axiosInstance.delete(`/api/courses/${courseId}`);
  return response.data;
};

/**
 * Toggle course published status (ADMIN)
 * @param {Object} params - { courseId, isPublished }
 */
export const toggleCoursePublishApi = async ({ courseId, isPublished }) => {
  const response = await axiosInstance.patch(
    `/api/courses/${courseId}/publish`,
    { isPublished }
  );
  return response.data;
};

/**
 * Toggle course trending status (ADMIN)
 * @param {Object} params - { courseId, isTrending }
 */
export const toggleCourseTrendingApi = async ({ courseId, isTrending }) => {
  const response = await axiosInstance.patch(
    `/api/courses/${courseId}/trending`,
    { isTrending }
  );
  return response.data;
};

/**
 * Bulk update display order (ADMIN)
 * @param {Array} orderData - [{ courseId, displayOrder }, ...]
 */
export const updateCourseOrderApi = async (orderData) => {
  const response = await axiosInstance.patch("/api/courses/reorder", {
    orderData,
  });
  return response.data;
};