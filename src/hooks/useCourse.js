import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import {
  getHomepageCoursesApi,
  getPublicCoursesApi,
  getCoursesCategoriesApi,
  getCourseBySlugApi,
  getAllCoursesApi,
  createCourseApi,
  updateCourseApi,
  deleteCourseApi,
  toggleCoursePublishApi,
  toggleCourseTrendingApi,
  updateCourseOrderApi,
} from "../api/courseApi.js";
import toast from "react-hot-toast";

// ============================================
// UTILITY HOOK - DEBOUNCE (shared pattern)
// ============================================
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// ============================================
// HELPER: CONVERT COURSE DATA → FORMDATA
// Mirrors convertToFormData from useService.js
// ============================================
const convertCourseToFormData = (courseData) => {
  const formData = new FormData();

  // ─── String fields ─────────────────────────────────────────
  const stringFields = [
    "title", "slug", "subtitle", "shortDescription",
    "description", "level", "duration", "location",
  ];
  stringFields.forEach((field) => {
    if (courseData[field] !== undefined && courseData[field] !== null) {
      formData.append(field, courseData[field]);
    }
  });

  // ─── Number fields ─────────────────────────────────────────
  if (courseData.totalHours !== undefined)
    formData.append("totalHours", String(courseData.totalHours));
  if (courseData.seatsTotal !== undefined)
    formData.append("seatsTotal", String(courseData.seatsTotal));
  if (courseData.seatsAvailable !== undefined)
    formData.append("seatsAvailable", String(courseData.seatsAvailable));
  formData.append("displayOrder", String(courseData.displayOrder || 0));

  // ─── Boolean fields ─────────────────────────────────────────
  formData.append("isPublished", courseData.isPublished ? "true" : "false");
  formData.append("isTrending", courseData.isTrending ? "true" : "false");
  formData.append("showOnHomepage", courseData.showOnHomepage ? "true" : "false");

  // ─── Status field ─────────────────────────────────────────
  if (courseData.status) formData.append("status", courseData.status);

  // ─── JSON array fields ────────────────────────────────────
  const arrayFields = [
    "category", "tags", "highlights", "targetAudience",
    "learningOutcomes", "prerequisites", "courseSyllabus",
  ];
  arrayFields.forEach((field) => {
    if (courseData[field] !== undefined) {
      formData.append(
        field,
        Array.isArray(courseData[field])
          ? JSON.stringify(courseData[field])
          : courseData[field]
      );
    }
  });

  // ─── JSON object fields ───────────────────────────────────
  const objectFields = ["pricing", "schedule", "seo"];
  objectFields.forEach((field) => {
    if (courseData[field] !== undefined) {
      formData.append(
        field,
        typeof courseData[field] === "string"
          ? courseData[field]
          : JSON.stringify(courseData[field])
      );
    }
  });

  // ─── File field ───────────────────────────────────────────
  if (courseData.heroImage instanceof File) {
    formData.append("heroImage", courseData.heroImage);
  }

  return formData;
};

// ============================================
// PUBLIC HOOKS
// ============================================

/**
 * Homepage course widget — aggressive caching (1 hr on server, 30min client)
 * courses rarely change so we can cache for a long time
 */
export const useHomepageCourses = ({ category } = {}) => {
  return useQuery({
    queryKey: ["courses", "homepage", { category: category || "all" }],
    queryFn: () => getHomepageCoursesApi({ category }),

    staleTime: 30 * 60 * 1000,   // 30 min client-side cache
    gcTime: 60 * 60 * 1000,      // 1 hr GC

    retry: (failureCount, error) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),

    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,

    select: (data) => data?.data?.courses || [],
  });
};

/**
 * Full /courses page — supports all tabs (All / Trending / Upcoming) + filters + search
 */
export const usePublicCourses = ({
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
} = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [
      "courses", "public",
      { page, limit, category, level, mode, status, isTrending, upcoming, search, sortBy },
    ],
    queryFn: ({ signal }) =>
      getPublicCoursesApi(
        { page, limit, category, level, mode, status, isTrending, upcoming, search, sortBy },
        signal
      ),

    placeholderData: keepPreviousData,

    staleTime: 15 * 60 * 1000,  // 15 min
    gcTime: 30 * 60 * 1000,

    retry: (failureCount, error) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },

    refetchOnWindowFocus: false,
    refetchOnMount: false,

    select: (data) => data?.data || { courses: [], pagination: {} },
  });

  // Auto-prefetch next page
  const { currentPage, totalPages } = query.data?.pagination || {};
  useEffect(() => {
    if (currentPage && currentPage < totalPages && !search) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: [
          "courses", "public",
          { page: nextPage, limit, category, level, mode, status, isTrending, upcoming, search, sortBy },
        ],
        queryFn: ({ signal }) =>
          getPublicCoursesApi(
            { page: nextPage, limit, category, level, mode, status, isTrending, upcoming, search, sortBy },
            signal
          ),
        staleTime: 15 * 60 * 1000,
      });
    }
  }, [currentPage, totalPages, search, limit, category, level, mode, status, isTrending, upcoming, sortBy, queryClient]);

  return query;
};

/**
 * Course categories for filter tabs — very long cache (rarely changes)
 */
export const useCourseCategories = () => {
  return useQuery({
    queryKey: ["courses", "categories"],
    queryFn: getCoursesCategoriesApi,

    staleTime: 60 * 60 * 1000,   // 1 hr — categories almost never change
    gcTime: 2 * 60 * 60 * 1000,

    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,

    select: (data) => data?.data?.categories || [],
  });
};

/**
 * Single course by slug — for detail page
 */
export const useCourseBySlug = (slug) => {
  return useQuery({
    queryKey: ["course", "slug", slug],
    queryFn: () => getCourseBySlugApi(slug),

    enabled: !!slug,

    staleTime: 20 * 60 * 1000,   // 20 min
    gcTime: 60 * 60 * 1000,

    retry: (failureCount, error) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },

    placeholderData: (previousData) => previousData,

    refetchOnWindowFocus: true,
    refetchOnMount: "always",

    select: (data) => data?.data?.course || null,
  });
};

/**
 * Prefetch course detail on hover
 */
export const usePrefetchCourse = () => {
  const queryClient = useQueryClient();

  return (slug) => {
    queryClient.prefetchQuery({
      queryKey: ["course", "slug", slug],
      queryFn: () => getCourseBySlugApi(slug),
      staleTime: 20 * 60 * 1000,
    });
  };
};

// ============================================
// ADMIN HOOKS
// ============================================

/**
 * All courses for admin dashboard with full filtering
 */
export const useAllCourses = ({
  page = 1,
  limit = 6,
  status = "",
  search = "",
  category = "",
  level = "",
  isPublished,
  isTrending,
  showOnHomepage,
  sortBy = "displayOrder",
} = {}) => {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [
      "courses", "all",
      { page, limit, status, search, category, level, isPublished, isTrending, showOnHomepage, sortBy },
    ],
    queryFn: ({ signal }) =>
      getAllCoursesApi(
        { page, limit, status, search, category, level, isPublished, isTrending, showOnHomepage, sortBy },
        signal
      ),

    placeholderData: keepPreviousData,

    staleTime: 2 * 60 * 1000,   // 2 min admin cache
    gcTime: 5 * 60 * 1000,

    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,

    enabled: user?.role === "admin" || user?.role === "super_admin",

    select: (data) => data.data,
  });

  // Auto-prefetch next page (only when no active filters)
  const { currentPage, totalPages } = query.data?.pagination || {};
  useEffect(() => {
    if (currentPage && currentPage < totalPages && !search && !status && !category && !level) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: [
          "courses", "all",
          { page: nextPage, limit, status: "", search: "", category: "", level: "", isPublished, isTrending, showOnHomepage, sortBy },
        ],
        queryFn: ({ signal }) =>
          getAllCoursesApi(
            { page: nextPage, limit, status: "", search: "", category: "", level: "", isPublished, isTrending, showOnHomepage, sortBy },
            signal
          ),
        staleTime: 2 * 60 * 1000,
      });
    }
  }, [currentPage, totalPages, search, status, category, level, limit, isPublished, isTrending, showOnHomepage, sortBy, queryClient]);

  return query;
};

// ============================================
// MUTATION HOOKS WITH OPTIMISTIC UPDATES
// ============================================

/**
 * CREATE COURSE
 */
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseData) => {
      const formData = convertCourseToFormData(courseData);
      return createCourseApi(formData);
    },

    onMutate: async (courseData) => {
      toast.loading("Creating course...", { id: "create-course" });
      await queryClient.cancelQueries({ queryKey: ["courses"] });

      const previousCourses = queryClient.getQueryData(["courses", "all"]);

      // Optimistic temp course
      const tempCourse = {
        _id: `temp-${Date.now()}`,
        title: courseData.title || "",
        slug: courseData.slug || "",
        subtitle: courseData.subtitle || "",
        shortDescription: courseData.shortDescription || "",
        description: courseData.description || "",
        heroImage: {
          url:
            courseData.heroImage instanceof File
              ? URL.createObjectURL(courseData.heroImage)
              : "/course/default.webp",
        },
        category: courseData.category || [],
        tags: courseData.tags || [],
        level: courseData.level || "Beginner",
        pricing: courseData.pricing || { regularPrice: 0, currency: "NPR" },
        schedule: courseData.schedule || {},
        duration: courseData.duration || "",
        status: courseData.status || "Coming Soon",
        isPublished: !!courseData.isPublished,
        isTrending: !!courseData.isTrending,
        showOnHomepage: !!courseData.showOnHomepage,
        displayOrder: parseInt(courseData.displayOrder || 0),
        seatsTotal: parseInt(courseData.seatsTotal || 30),
        seatsAvailable: parseInt(courseData.seatsAvailable || 30),
        rating: { average: 0, count: 0 },
        enrollmentCount: 0,
        createdAt: new Date().toISOString(),
        __optimistic: true,
      };

      queryClient.setQueryData(["courses", "all"], (oldData) => {
        if (!oldData?.data?.courses) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            courses: [tempCourse, ...oldData.data.courses],
            pagination: {
              ...oldData.data.pagination,
              totalCourses: (oldData.data.pagination.totalCourses || 0) + 1,
            },
          },
        };
      });

      return { previousCourses };
    },

    onError: (error, _variables, context) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create course";
      toast.error(msg, { id: "create-course" });

      if (context?.previousCourses) {
        queryClient.setQueryData(["courses", "all"], context.previousCourses);
      }
    },

    onSuccess: () => {
      toast.success("Course created successfully!", { id: "create-course" });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

/**
 * UPDATE COURSE
 */
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, courseData }) => {
      const formData = convertCourseToFormData(courseData);
      return updateCourseApi({ courseId, formData });
    },

    onMutate: async ({ courseId, courseData }) => {
      toast.loading("Updating course...", { id: "update-course" });
      await queryClient.cancelQueries({ queryKey: ["courses"] });

      const previousCourses = queryClient.getQueriesData({ queryKey: ["courses", "all"] });
      const previousCourse = queryClient.getQueryData(["course", "slug", courseData.slug]);

      const updates = {
        ...courseData,
        heroImage: {
          url:
            courseData.heroImage instanceof File
              ? URL.createObjectURL(courseData.heroImage)
              : courseData.heroImage?.url || "/course/default.webp",
        },
        __optimistic: true,
      };

      // Update all-courses list cache
      queryClient.setQueriesData(
        { queryKey: ["courses", "all"] },
        (oldData) => {
          if (!oldData?.data?.courses) return oldData;
          return {
            ...oldData,
            data: {
              ...oldData.data,
              courses: oldData.data.courses.map((c) =>
                c._id === courseId ? { ...c, ...updates } : c
              ),
            },
          };
        }
      );

      // Update single course slug cache
      queryClient.setQueryData(
        ["course", "slug", courseData.slug],
        (oldData) => {
          if (!oldData?.data?.course || oldData.data.course._id !== courseId)
            return oldData;
          return {
            ...oldData,
            data: { course: { ...oldData.data.course, ...updates } },
          };
        }
      );

      return { previousCourses, previousCourse };
    },

    onError: (error, _variables, context) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update course";
      toast.error(msg, { id: "update-course" });

      if (context?.previousCourses) {
        context.previousCourses.forEach(([key, data]) =>
          queryClient.setQueryData(key, data)
        );
      }
    },

    onSuccess: () => {
      toast.success("Course updated successfully!", { id: "update-course" });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

/**
 * DELETE COURSE
 */
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCourseApi,

    onMutate: async (courseId) => {
      toast.loading("Deleting course...", { id: "delete-course" });
      await queryClient.cancelQueries({ queryKey: ["courses"] });

      const previousCourses = queryClient.getQueriesData({
        queryKey: ["courses", "all"],
      });

      queryClient.setQueriesData(
        { queryKey: ["courses", "all"] },
        (oldData) => {
          if (!oldData?.data?.courses) return oldData;
          return {
            ...oldData,
            data: {
              ...oldData.data,
              courses: oldData.data.courses.filter((c) => c._id !== courseId),
              pagination: {
                ...oldData.data.pagination,
                totalCourses: Math.max(
                  0,
                  oldData.data.pagination.totalCourses - 1
                ),
              },
            },
          };
        }
      );

      return { previousCourses };
    },

    onError: (error, _variables, context) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete course";
      toast.error(msg, { id: "delete-course" });

      if (context?.previousCourses) {
        context.previousCourses.forEach(([key, data]) =>
          queryClient.setQueryData(key, data)
        );
      }
    },

    onSuccess: () => {
      toast.success("Course deleted successfully!", { id: "delete-course" });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

/**
 * TOGGLE PUBLISH STATUS
 */
export const useToggleCoursePublish = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleCoursePublishApi,

    onMutate: async ({ courseId, isPublished }) => {
      await queryClient.cancelQueries({ queryKey: ["courses"] });

      const previousCourses = queryClient.getQueriesData({
        queryKey: ["courses", "all"],
      });

      queryClient.setQueriesData(
        { queryKey: ["courses", "all"] },
        (oldData) => {
          if (!oldData?.data?.courses) return oldData;
          return {
            ...oldData,
            data: {
              ...oldData.data,
              courses: oldData.data.courses.map((c) =>
                c._id === courseId
                  ? { ...c, isPublished, __optimistic: true }
                  : c
              ),
            },
          };
        }
      );

      return { previousCourses };
    },

    onError: (error, _variables, context) => {
      toast.error(
        error?.response?.data?.message || "Failed to update publish status"
      );
      if (context?.previousCourses) {
        context.previousCourses.forEach(([key, data]) =>
          queryClient.setQueryData(key, data)
        );
      }
    },

    onSuccess: (_data, { isPublished }) => {
      toast.success(isPublished ? "Course published!" : "Course unpublished!");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

/**
 * TOGGLE TRENDING STATUS
 */
export const useToggleCourseTrending = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleCourseTrendingApi,

    onMutate: async ({ courseId, isTrending }) => {
      await queryClient.cancelQueries({ queryKey: ["courses"] });

      const previousCourses = queryClient.getQueriesData({
        queryKey: ["courses", "all"],
      });

      queryClient.setQueriesData(
        { queryKey: ["courses", "all"] },
        (oldData) => {
          if (!oldData?.data?.courses) return oldData;
          return {
            ...oldData,
            data: {
              ...oldData.data,
              courses: oldData.data.courses.map((c) =>
                c._id === courseId
                  ? { ...c, isTrending, __optimistic: true }
                  : c
              ),
            },
          };
        }
      );

      return { previousCourses };
    },

    onError: (error, _variables, context) => {
      toast.error(
        error?.response?.data?.message || "Failed to update trending status"
      );
      if (context?.previousCourses) {
        context.previousCourses.forEach(([key, data]) =>
          queryClient.setQueryData(key, data)
        );
      }
    },

    onSuccess: (_data, { isTrending }) => {
      toast.success(
        isTrending ? "Marked as trending!" : "Removed from trending!"
      );
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

/**
 * REORDER COURSES (Drag & Drop)
 */
export const useReorderCourses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCourseOrderApi,

    onMutate: async (orderData) => {
      await queryClient.cancelQueries({ queryKey: ["courses"] });

      const previousCourses = queryClient.getQueriesData({
        queryKey: ["courses", "all"],
      });

      queryClient.setQueriesData(
        { queryKey: ["courses", "all"] },
        (oldData) => {
          if (!oldData?.data?.courses) return oldData;

          const courseMap = new Map(
            oldData.data.courses.map((c) => [c._id, c])
          );

          orderData.forEach(({ courseId, displayOrder }) => {
            const course = courseMap.get(courseId);
            if (course) course.displayOrder = displayOrder;
          });

          return {
            ...oldData,
            data: {
              ...oldData.data,
              courses: Array.from(courseMap.values()).sort(
                (a, b) => a.displayOrder - b.displayOrder
              ),
            },
          };
        }
      );

      return { previousCourses };
    },

    onError: (error, _variables, context) => {
      toast.error(
        error?.response?.data?.message || "Failed to reorder courses"
      );
      if (context?.previousCourses) {
        context.previousCourses.forEach(([key, data]) =>
          queryClient.setQueryData(key, data)
        );
      }
    },

    onSuccess: () => {
      toast.success("Courses reordered!");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};