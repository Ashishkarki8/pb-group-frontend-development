

// c:\Users\ashis\Downloads\Pb_Group-monorepo\frontend\src\pages\admin-pages\CourseManagement\CourseManagement.jsx

import React, { useState, useEffect, useCallback } from "react";
import {
  useAllCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
  useToggleCoursePublish,
  useToggleCourseTrending,
  useDebounce,
} from "../../../hooks/useCourse";
import { useModal } from "../../../hooks/useModal";
import { useConfirm } from "../../../hooks/useConfirm";
import { BookOpen, Plus, Loader2, AlertCircle } from "lucide-react";

import CourseFilters from "./CourseFilters";
import CourseGrid from "./CourseGrid";
import Pagination from "../../../components/common/Pagination";
import CreateCourseForm from "../../../components/forms/admin/CreateCourseForm";
import LoadingFallback from "../../../components/common/LoadingFallback";

const CourseManagement = () => {
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [publishedFilter, setPublishedFilter] = useState("");
  const [trendingFilter, setTrendingFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 6;

  const debouncedSearch = useDebounce(searchInput, 500);

  const { openModal, closeModal } = useModal();
  const { confirm } = useConfirm();

  // ─── Fetch ────────────────────────────────────────────────
  const {
    data: coursesData,
    isLoading,
    isError,
    error,
  } = useAllCourses({
    page,
    limit,
    status: statusFilter,
    search: debouncedSearch,
    category: categoryFilter,
    level: levelFilter,
    isPublished: publishedFilter || undefined,
    isTrending: trendingFilter || undefined,
  });

  const courses = coursesData?.courses || [];
  const pagination = coursesData?.pagination || {};

  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();
  const deleteMutation = useDeleteCourse();
  const togglePublishMutation = useToggleCoursePublish();
  const toggleTrendingMutation = useToggleCourseTrending();

  // Reset page on filter/search change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, categoryFilter, levelFilter, publishedFilter, trendingFilter]);

  // ─── Handlers ────────────────────────────────────────────
  const handleCreateCourse = () => {
    openModal(
      <CreateCourseForm
        onClose={closeModal}
        onSubmit={handleCourseCreate}
      />,
      "Create New Course",
      "lg"
    );
  };

  const handleEditCourse = useCallback((course) => {
    openModal(
      <CreateCourseForm
        onClose={closeModal}
        onSubmit={(courseId, courseData) => handleCourseUpdate(courseId, courseData, course.slug)}
        editingCourse={course}
      />,
      "Edit Course",
      "lg"
    );
  }, [openModal, closeModal]);

  const handleCourseCreate = async (courseData) => {
    try {
      await createMutation.mutateAsync(courseData);
      closeModal();
    } catch (err) {
      console.error("Create course error:", err);
    }
  };

  const handleCourseUpdate = async (courseId, courseData, existingSlug) => {
    // The isDirty check is now handled inside CreateCourseForm before onSubmit is called.
    try {
      await updateMutation.mutateAsync({ courseId, courseData, existingSlug });
      closeModal();
    } catch (err) {
      console.error("Update course error:", err);
    }
  };

  const handleDeleteCourse = useCallback(async (courseId) => {
    const result = await confirm({
      title: "Delete Course?",
      message:
        "This action cannot be undone. The course and its image will be permanently deleted.",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
    });

    if (result) {
      try {
        await deleteMutation.mutateAsync(courseId);
      } catch (err) {
        console.error("Delete course error:", err);
      }
    }
  }, [confirm, deleteMutation]);

  const handleTogglePublish = useCallback(({ courseId, isPublished }) => {
    togglePublishMutation.mutate({ courseId, isPublished });
  }, [togglePublishMutation]);

  const handleToggleTrending = useCallback(({ courseId, isTrending }) => {
    toggleTrendingMutation.mutate({ courseId, isTrending });
  }, [toggleTrendingMutation]);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const clearFilters = useCallback(() => {
    setStatusFilter("");
    setCategoryFilter("");
    setLevelFilter("");
    setPublishedFilter("");
    setTrendingFilter("");
    setSearchInput("");
  }, []);

  const hasActiveFilters =
    statusFilter || categoryFilter || levelFilter || publishedFilter || trendingFilter || searchInput;

  // ─── Loading state ────────────────────────────────────────
  if (isLoading && page === 1) {
    return (
      <LoadingFallback props="Loading Courses"></LoadingFallback>
    );
  }

  // ─── Error state ──────────────────────────────────────────
  if (isError) {
    return (
      <div className="space-y-6">
        <HeaderSection />
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-red-800 font-medium">Failed to load courses</p>
          <p className="text-red-600 text-sm mt-1">
            {error?.message || "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-indigo-700 to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen size={28} />
            <div>
              <h2 className="text-2xl font-bold">Course Management</h2>
              <p className="text-indigo-100">
                {pagination.totalCourses ?? 0} courses total
              </p>
            </div>
          </div>
          <button
            onClick={handleCreateCourse}
            disabled={createMutation.isPending}
            className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Plus size={20} />
            )}
            Create Course
          </button>
        </div>
      </div>

      {/* ── Search + Filters ────────────────────────────── */}
      <CourseFilters
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        debouncedSearch={debouncedSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        levelFilter={levelFilter}
        setLevelFilter={setLevelFilter}
        publishedFilter={publishedFilter}
        setPublishedFilter={setPublishedFilter}
        trendingFilter={trendingFilter}
        setTrendingFilter={setTrendingFilter}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        clearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* ── Course Grid ──────────────────────────────────── */}
      {isLoading && page > 1 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
          <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No courses found
          </h3>
          <p className="text-gray-600 mb-4">
            {hasActiveFilters
              ? "Try adjusting your filters"
              : "Create your first course to get started"}
          </p>
          {!hasActiveFilters && (
            <button
              onClick={handleCreateCourse}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Create Course
            </button>
          )}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <CourseGrid
          courses={courses}
          deleteMutation={deleteMutation}
          togglePublishMutation={togglePublishMutation}
          toggleTrendingMutation={toggleTrendingMutation}
          handlers={{
            onEdit: handleEditCourse,
            onDelete: handleDeleteCourse,
            onTogglePublish: handleTogglePublish,
            onToggleTrending: handleToggleTrending,
          }}
        />
      )}

      {/* ── Pagination ───────────────────────────────────── */}
      <Pagination
        currentPage={page}
        totalPages={pagination.totalPages || 1}
        onPageChange={handlePageChange}
        totalItems={pagination.totalCourses}
        currentItems={courses.length}
        isLoading={isLoading}
        itemLabel="courses"
      />
    </div>
  );
};

const HeaderSection = () => (
  <div className="bg-gradient-to-r from-indigo-700 to-blue-600 rounded-xl p-6 text-white shadow-lg">
    <div className="flex items-center gap-3">
      <BookOpen size={28} />
      <div>
        <h2 className="text-2xl font-bold">Course Management</h2>
        <p className="text-indigo-100">Loading courses...</p>
      </div>
    </div>
  </div>
);

export default CourseManagement;
