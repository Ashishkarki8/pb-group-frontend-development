// src/pages/admin/ServiceManagement.jsx

import React, { useState, useEffect } from 'react';
import { useModal } from '../../hooks/useModal.js';
import { useConfirm } from '../../hooks/useConfirm.js';
import {
  useAllServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
  useDebounce,
} from '../../hooks/useService.js';
import {
  LayoutGrid, Plus, Search, Edit2, Trash2,
  Loader2,
  BarChart3,
  Smartphone,
  TrendingUp,
  Monitor,
  Grid3x3,
  GraduationCap
} from 'lucide-react';
import CreateServiceForm from '../../components/forms/CreateServiceForm.jsx';
import Pagination from '../../components/common/Pagination.jsx'; // ✅ Import reusable component

// Icon mapping helper
const getIconComponent = (iconName) => {
  const icons = {
    BarChart3: BarChart3,
    Smartphone: Smartphone,
    TrendingUp: TrendingUp,
    Monitor: Monitor,
    Grid3x3: Grid3x3,
    GraduationCap: GraduationCap
  };
  return icons[iconName] || BarChart3;
};

// Helper function to format text with line breaks
const formatTextWithLineBreaks = (text) => {
  if (!text) return null;
  const lines = text.split(/\r\n|\n/);
  return lines.map((line, index) => (
    <span key={index}>
      {line}
      {index < lines.length - 1 && <br />}
    </span>
  ));
};

const ServiceManagement = () => {
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 6;
  
  const debouncedSearch = useDebounce(searchInput, 500);
  
  const { openModal, closeModal } = useModal();
  const { confirm } = useConfirm();

  // 1️⃣ FETCH DATA - API returns services and pagination info
  const { data: servicesData, isLoading, isError, error } = useAllServices({ 
    page, 
    limit, 
    status: statusFilter, 
    search: debouncedSearch
  });
  console.log("servicesData",servicesData)

  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  // 2️⃣ EXTRACT DATA - Get services array and pagination object
  const services = servicesData?.services || [];
  const pagination = servicesData?.pagination || {};

  /*
  📦 Example API Response Structure:
  {
    services: [
      { _id: '1', title: 'Web Development', isPublished: true, ... },
      { _id: '2', title: 'Mobile App', isPublished: false, ... },
      // ... 6 services per page
    ],
    pagination: {
      currentPage: 1,
      totalPages: 4,
      totalServices: 23,
      limit: 6,
      hasNextPage: true,
      hasPrevPage: false
    }
  }
  */

  // 3️⃣ RESET TO PAGE 1 - When search or filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const handleCreateService = () => {
    openModal(
      <CreateServiceForm 
        onClose={closeModal}
        onSubmit={handleServiceCreate}
      />,
      'Create New Service',
      'lg'
    );
  };

  const handleEditService = (service) => {
    openModal(
      <CreateServiceForm 
        onClose={closeModal}
        onSubmit={handleServiceUpdate}
        editingService={service}
      />,
      'Edit Service',
      'lg'
    );
  };

  const handleServiceCreate = async (serviceData) => {
    try {
      await createMutation.mutateAsync(serviceData);
      closeModal();
    } catch (error) {
      console.error('Create service error:', error);
    }
  };

  const handleServiceUpdate = async (serviceId, serviceData) => {
    try {
      await updateMutation.mutateAsync({ serviceId, serviceData });
      closeModal();
    } catch (error) {
      console.error('Update service error:', error);
    }
  };

  const handleDeleteService = async (serviceId) => {
    const result = await confirm({
      title: 'Delete Service?',
      message: 'This action cannot be undone. The service will be permanently deleted.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
    });

    if (result) {
      try {
        await deleteMutation.mutateAsync(serviceId);
      } catch (error) {
        console.error('Delete service error:', error);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  // 4️⃣ PAGE CHANGE HANDLER - Updates page state and scrolls to top
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading && page === 1) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center space-x-3">
            <LayoutGrid size={28} />
            <div>
              <h2 className="text-2xl font-bold">Service Management</h2>
              <p className="text-blue-100">Loading services...</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center space-x-3">
            <LayoutGrid size={28} />
            <div>
              <h2 className="text-2xl font-bold">Service Management</h2>
              <p className="text-blue-100">Error loading services</p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-800 font-medium">Failed to load services</p>
          <p className="text-red-600 text-sm mt-2">{error?.message || 'Please try again later'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <LayoutGrid size={28} />
            <div>
              <h2 className="text-2xl font-bold">Service Management</h2>
              <p className="text-blue-100">Manage services and offerings for your website</p>
            </div>
          </div>
          <button
            onClick={handleCreateService}
            disabled={createMutation.isPending}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Plus size={20} />
            )}
            Create Service
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2 w-full sm:max-w-2xl flex-1">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchInput !== debouncedSearch && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 size={16} className="text-gray-400 animate-spin" />
                </div>
              )}
            </div>
          </form>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Service Grid - 3 columns */}
      {isLoading && page > 1 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => {
            const IconComponent = getIconComponent(service.iconName);
            const isDeleting = deleteMutation.isPending && deleteMutation.variables === service._id;
            
            return (
              <div 
                key={service._id} 
                className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col ${
                  isDeleting ? 'opacity-50' : ''
                } ${service.__optimistic ? 'ring-2 ring-blue-400' : ''}`}
              >
                {/* Image Section */}
                <div className="h-52 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center relative">
                  {service.heroImage?.url ? (
                    <img 
                      src={service.heroImage.url} 
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                      <IconComponent size={40} className="text-white" />
                    </div>
                  )}
                  
                  {/* Position Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded-full font-medium">
                      Position: {service.displayOrder || 'N/A'}
                    </span>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    {service.isPublished ? (
                      <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                        Active
                      </span>
                    ) : (
                      <span className="bg-gray-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                        Inactive
                      </span>
                    )}
                  </div>

                  {service.__optimistic && (
                    <div className="absolute bottom-3 right-3 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                      Uploading...
                    </div>
                  )}
                </div>

                {/* Card Description Only */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                  </div>

                  <div className="text-gray-700 text-sm leading-relaxed mb-4 flex-1 overflow-y-auto max-h-44 break-words">
                    {formatTextWithLineBreaks(service.cardDescription)}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => handleEditService(service)}
                      disabled={isDeleting || service.__optimistic}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteService(service._id)}
                      disabled={isDeleting || service.__optimistic}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete"
                    >
                      {isDeleting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {services.length === 0 && !isLoading && (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
          <LayoutGrid size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No services found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchInput || statusFilter ? 'Try adjusting your filters' : 'Create your first service to get started'}
          </p>
          {!searchInput && !statusFilter && (
            <button
              onClick={handleCreateService}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Create Service
            </button>
          )}
        </div>
      )}

      {/* ✅ REUSABLE PAGINATION COMPONENT - Replaces old code */}
      <Pagination
        currentPage={page}
        totalPages={pagination.totalPages || 1}
        onPageChange={handlePageChange}
        totalItems={pagination.totalServices}
        currentItems={services.length}
        isLoading={isLoading}
        itemLabel="services"
      />
    </div>
  );
};

export default ServiceManagement;



