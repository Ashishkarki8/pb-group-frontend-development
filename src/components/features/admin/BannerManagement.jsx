import {
  Edit,
  ExternalLink,
  Image,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X
} from "lucide-react";
import { useState } from "react";
import {
  useAllBanners,
  useCreateBanner,
  useDeleteBanner,
  useUpdateBanner,
} from "../../../hooks/useBanners.js";
import LoadingFallback from "../../LoadingFallback.jsx";
// import { useQueryClient } from "@tanstack/react-query";
// import { useEffect } from "react";
// import { getAllBannersApi } from "../../../api/bannerApi.js";


const BannerCard = ({ banner, onEdit, onDelete }) => {
  // Check if this is an optimistic update
  const isOptimistic = banner.__optimistic;
  const isUploadingImage = banner.__uploadingImage;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all ${
      isOptimistic ? 'opacity-75 ring-2 ring-blue-400' : ''
    }`}>
      {/* Image Container */}
      <div className="relative h-48 bg-gray-100">
        {isUploadingImage && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10">
            <div className="text-center text-white">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p className="text-sm font-medium">Uploading image...</p>
            </div>
          </div>
        )}
        
        {banner.imageUrl ? (
          <img
            src={banner.imageUrl}
            alt={banner.altText || 'Banner'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              banner.isActive
                ? 'bg-green-500 text-white'
                : 'bg-gray-500 text-white'
            }`}
          >
            {banner.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Optimistic Update Indicator */}
        {isOptimistic && !isUploadingImage && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500 text-white flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Saving...
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Alt Text */}
        <p className="text-sm text-gray-700 mb-2 line-clamp-2">
          {banner.altText || 'No description'}
        </p>

        {/* Link */}
        {banner.link && (
          <a
            href={banner.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-3"
          >
            <ExternalLink size={14} />
            View Link
          </a>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-200">
          <button
            onClick={() => onEdit(banner)}
            disabled={isOptimistic}
            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={() => onDelete(banner._id)}
            disabled={isOptimistic}
            className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};










// Banner Form Modal
const BannerFormModal = ({ banner, onClose, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    link: banner?.link || "",
    altText: banner?.altText || "",
    isActive: banner?.isActive || false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(banner?.imageUrl || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    if (imageFile) formDataToSend.append("image", imageFile);
    formDataToSend.append("link", formData.link);
    formDataToSend.append("altText", formData.altText);
    formDataToSend.append("isActive", formData.isActive);

    onSubmit(formDataToSend);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            {banner ? "Edit Banner" : "Create New Banner"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Image {!banner && <span className="text-red-500">*</span>}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(banner?.imageUrl || null);
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center cursor-pointer">
                  <Upload size={48} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Click to upload image
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    PNG, JPG, WebP (Max 5MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    required={!banner}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link (Optional)
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              placeholder="https://example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Alt Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alt Text
            </label>
            <input
              type="text"
              value={formData.altText}
              onChange={(e) =>
                setFormData({ ...formData, altText: e.target.value })
              }
              placeholder="Describe the banner"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700"
            >
              Set as Active Banner
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : banner ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Banner Management Component
export default function BannerManagement() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  const { data, isLoading, isError, error } = useAllBanners({
    //here the first fetch all upto 1oth cards is called
    page,
    limit: 10,
    status: statusFilter,
  });



  const createMutation = useCreateBanner();
  const updateMutation = useUpdateBanner();
  const deleteMutation = useDeleteBanner();

  const handleCreate = () => {
    setEditingBanner(null);
    setShowModal(true);
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setShowModal(true);
  };

  const handleSubmit = async (formData) => {
    if (editingBanner) {
      await updateMutation.mutateAsync({
        bannerId: editingBanner._id,
        formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setShowModal(false);
    setEditingBanner(null);
  };

  const handleDelete = async (bannerId) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      await deleteMutation.mutateAsync(bannerId);
    }
  };

  if (isLoading) return <LoadingFallback />;

  if (isError) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image size={28} />
            <div>
              <h2 className="text-2xl font-bold">Banner Management</h2>
              <p className="text-purple-100">
                Manage call-to-action banners for your website
              </p>
            </div>
          </div>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus size={20} />
            Create Banner
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex gap-4 items-center">
          <label className="text-sm font-medium text-gray-700">
            Filter by status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);  // yedi page two mah gayera active select garyo bhani dekhaudaina thyo tesailey it sets to page 1 where it gets shown
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Banner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.banners?.map((banner) => (
          <BannerCard
            key={banner._id}
            banner={banner}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Empty State */}
      {data?.banners?.length === 0 && (
        <div className="text-center py-12">
          <Image size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No banners found
          </h3>
          <p className="text-gray-600 mb-4">
            Create your first banner to get started
          </p>
          <button
            onClick={handleCreate}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Banner
          </button>
        </div>
      )}

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {page} of {data.pagination.totalPages}
          </span>
          <button
            onClick={() =>
              setPage((p) => Math.min(data.pagination.totalPages, p + 1))
            }
            disabled={page === data.pagination.totalPages}
            className="px-4 py-2 border colorred border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <BannerFormModal
          banner={editingBanner}
          onClose={() => {
            setShowModal(false);
            setEditingBanner(null);
          }}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
}
