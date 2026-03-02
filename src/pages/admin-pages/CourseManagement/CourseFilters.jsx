// c:\Users\ashis\Downloads\Pb_Group-monorepo\frontend\src\pages\admin-pages\CourseManagement\CourseFilters.jsx

import React from "react";
import { Search, Filter, ChevronDown, Loader2 } from "lucide-react";

const CourseFilters = ({
  searchInput,
  setSearchInput,
  debouncedSearch,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  levelFilter,
  setLevelFilter,
  publishedFilter,
  setPublishedFilter,
  trendingFilter,
  setTrendingFilter,
  showFilters,
  setShowFilters,
  clearFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {searchInput !== debouncedSearch && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 size={16} className="text-gray-400 animate-spin" />
            </div>
          )}
        </div>

        {/* Filter toggle button */}
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
            hasActiveFilters
              ? "bg-indigo-600 text-white border-indigo-600"
              : "border-gray-300 text-gray-700 hover:border-indigo-300"
          }`}
        >
          <Filter size={16} />
          Filters
          {hasActiveFilters && (
            <span className="bg-white text-indigo-600 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {
                [statusFilter, categoryFilter, levelFilter, publishedFilter, trendingFilter].filter(Boolean).length
              }
            </span>
          )}
          <ChevronDown
            size={16}
            className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
          />
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2 border-t border-gray-100">
          {/* Status */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All</option>
              <option value="Coming Soon">Coming Soon</option>
              <option value="Enrolling Now">Enrolling Now</option>
              <option value="Full">Full</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Level */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Level
            </label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Beginner to Advanced">Beginner to Advanced</option>
            </select>
          </div>

          {/* Published */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Published
            </label>
            <select
              value={publishedFilter}
              onChange={(e) => setPublishedFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All</option>
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>
          </div>

          {/* Trending */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Trending
            </label>
            <select
              value={trendingFilter}
              onChange={(e) => setTrendingFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All</option>
              <option value="true">Trending</option>
              <option value="false">Not Trending</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Category
            </label>
            <input
              type="text"
              placeholder="e.g. Analysis"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(CourseFilters);
