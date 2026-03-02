// src/components/common/Pagination.jsx

import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  showItemCount = true,
  totalItems,
  currentItems,
  itemLabel = "items",
  variant = "dashboard", // "dashboard" | "public"
}) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && !isLoading) {
      onPageChange(newPage);
    }
  };

  // Render pagination numbers with ellipsis
  const renderPagination = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push("ellipsis");
      }
    }

    // Remove duplicate ellipsis
    return pages.filter((page, index, arr) => {
      if (page !== "ellipsis") return true;
      return arr[index - 1] !== "ellipsis";
    });
  };

  // ==========================================
  // PUBLIC VARIANT (Home page - centered, enhanced styling)
  // ==========================================
  if (variant === "public") {
    return (
      <div className="flex items-center justify-center space-x-2 sm:space-x-3">
        <button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <ChevronLeft size={16} className="mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </button>

        {renderPagination().map((page, index) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 sm:px-4 py-2 sm:py-3 text-gray-400 font-medium text-xs sm:text-sm"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 shadow-sm hover:shadow-md ${
                currentPage === page
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110"
                  : "text-gray-700 bg-white border-2 border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() =>
            handlePageChange(Math.min(currentPage + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="flex items-center px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <span className="hidden sm:inline">Next</span>
          <span className="sm:hidden">Next</span>
          <ChevronRight size={16} className="ml-1 sm:ml-2" />
        </button>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD VARIANT (Admin - with item count)
  // ==========================================
  return (
    <div
      className={`flex ${
        showItemCount ? "items-center justify-between" : "justify-center"
      } bg-white rounded-xl p-4 shadow-sm border border-gray-200`}
    >
      {/* Left side - Item count (optional) */}
      {showItemCount &&
        totalItems !== undefined &&
        currentItems !== undefined && (
          <div className="text-sm text-gray-600">
            Showing {currentItems} of {totalItems} {itemLabel}
          </div>
        )}

      {/* Center/Right - Pagination controls */}
      <div className="flex gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex gap-1">
          {renderPagination().map((page, index) =>
            page === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 py-2 text-gray-500"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;