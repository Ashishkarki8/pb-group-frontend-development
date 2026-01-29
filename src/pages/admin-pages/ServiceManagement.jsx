// import React, { useState } from 'react';
// import { useModal } from '../../hooks/useModal.js';
// import { useConfirm } from '../../hooks/useConfirm.js';
// import {
//   useAllServices,
//   useCreateService,
//   useUpdateService,
//   useDeleteService,
// } from '../../hooks/useService.js';
// import {
//   LayoutGrid, Plus, Search, Edit2, Trash2, Eye, EyeOff,
//   Loader2,
//   BarChart3,
//   Smartphone,
//   TrendingUp,
//   Monitor,
//   Grid3x3,
//   GraduationCap
// } from 'lucide-react';
// import CreateServiceForm from '../../components/forms/CreateServiceForm.jsx';

// // Icon mapping helper
// const getIconComponent = (iconName) => {
//   const icons = {
//     BarChart3: BarChart3,
//     Smartphone: Smartphone,
//     TrendingUp: TrendingUp,
//     Monitor: Monitor,
//     Grid3x3: Grid3x3,
//     GraduationCap: GraduationCap
//   };
//   return icons[iconName] || BarChart3;
// };

// const ServiceManagement = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [page, setPage] = useState(1);
//   const limit = 6;
  
//   const { openModal, closeModal } = useModal();
//   const { confirm } = useConfirm();

//   // ============================================
//   // REACT QUERY HOOKS
//   // ============================================
  
//   // Fetch all services with filters
//   const { data: servicesData, isLoading, isError, error } = useAllServices({ page, limit, status: statusFilter, search: searchTerm });

//   // Mutations
//   const createMutation = useCreateService();
//   const updateMutation = useUpdateService();
//   const deleteMutation = useDeleteService();

//   // Extract data
//   const services = servicesData?.services || [];
//   const pagination = servicesData?.pagination || {};

//   // ============================================
//   // HANDLERS
//   // ============================================

//   const handleCreateService = () => {
//     openModal(
//       <CreateServiceForm 
//         onClose={closeModal}
//         onSubmit={handleServiceCreate}
//       />,
//       'Create New Service',
//       'lg'
//     );
//   };

//   const handleEditService = (service) => {
//     openModal(
//       <CreateServiceForm 
//         onClose={closeModal}
//         onSubmit={handleServiceUpdate}
//         editingService={service}
//       />,
//       'Edit Service',
//       'lg'
//     );
//   };

// const handleServiceCreate = async (data) => {
//   try {
//     await createMutation.mutateAsync(data); // plain object
//     closeModal();
//   } catch (error) {
//     console.error(error);
//   }
// };


// const handleServiceUpdate = async (serviceId, data) => {
//   try {
//     await updateMutation.mutateAsync({ serviceId, serviceData: data });
//     closeModal();
//   } catch (error) {
//     console.error(error);
//   }
// };


//   const handleDeleteService = async (serviceId) => {
//     const result = await confirm({
//       title: 'Delete Service?',
//       message: 'This action cannot be undone. The service will be permanently deleted.',
//       confirmText: 'Delete',
//       cancelText: 'Cancel',
//       type: 'danger',
//     });

//     if (result) {
//       try {
//         await deleteMutation.mutateAsync(serviceId);
//       } catch (error) {
//         console.error('Failed to delete service:', error);
//       }
//     }
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   // Reset to page 1 when search/filter changes
//   const handleSearchChange = (value) => {
//     setSearchTerm(value);
//     setPage(1);
//   };

//   const handleFilterChange = (value) => {
//     setStatusFilter(value);
//     setPage(1);
//   };

//   // ============================================
//   // LOADING STATE
//   // ============================================
  
//   if (isLoading && page === 1) {
//     return (
//       <div className="space-y-6">
//         <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-xl p-6 text-white shadow-lg">
//           <div className="flex items-center space-x-3">
//             <LayoutGrid size={28} />
//             <div>
//               <h2 className="text-2xl font-bold">Service Management</h2>
//               <p className="text-blue-100">Loading services...</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="flex items-center justify-center py-20">
//           <div className="text-center">
//             <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
//             <p className="text-gray-600">Loading services...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ============================================
//   // ERROR STATE
//   // ============================================
  
//   if (isError) {
//     return (
//       <div className="space-y-6">
//         <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-xl p-6 text-white shadow-lg">
//           <div className="flex items-center space-x-3">
//             <LayoutGrid size={28} />
//             <div>
//               <h2 className="text-2xl font-bold">Service Management</h2>
//               <p className="text-blue-100">Error loading services</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
//           <p className="text-red-800 font-medium">Failed to load services</p>
//           <p className="text-red-600 text-sm mt-2">{error?.message || 'Please try again later'}</p>
//         </div>
//       </div>
//     );
//   }

//   // ============================================
//   // MAIN RENDER
//   // ============================================

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-xl p-6 text-white shadow-lg">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <LayoutGrid size={28} />
//             <div>
//               <h2 className="text-2xl font-bold">Service Management</h2>
//               <p className="text-blue-100">
//                 Manage services and offerings for your website
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={handleCreateService}
//             disabled={createMutation.isPending}
//             className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {createMutation.isPending ? (
//               <Loader2 size={20} className="animate-spin" />
//             ) : (
//               <Plus size={20} />
//             )}
//             Create Service
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1">
//             <div className="relative">
//               <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search services..."
//                 value={searchTerm}
//                 onChange={(e) => handleSearchChange(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
//               Status:
//             </label>
//             <select
//               value={statusFilter}
//               onChange={(e) => handleFilterChange(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Service Grid */}
//       {isLoading && page > 1 ? (
//         <div className="flex items-center justify-center py-12">
//           <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {services.map(service => {
//             const IconComponent = getIconComponent(service.iconName);
//             const isDeleting = deleteMutation.isPending && deleteMutation.variables === service._id;
            
//             return (
//               <div 
//                 key={service._id} 
//                 className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow ${
//                   isDeleting ? 'opacity-50' : ''
//                 } ${service.__optimistic ? 'ring-2 ring-blue-400' : ''}`}
//               >
//                 <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center relative">
//                   {service.heroImage?.url ? (
//                     <img 
//                       src={service.heroImage.url} 
//                       alt={service.title}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
//                       <IconComponent size={40} className="text-white" />
//                     </div>
//                   )}
//                   {service.__optimistic && (
//                     <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
//                       Uploading...
//                     </div>
//                   )}
//                 </div>
//                 <div className="p-5">
//                   <div className="flex items-start justify-between mb-3">
//                     <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
//                     <div className="flex items-center gap-1">
//                       {service.isPublished ? (
//                         <Eye size={18} className="text-green-600" />
//                       ) : (
//                         <EyeOff size={18} className="text-gray-400" />
//                       )}
//                     </div>
//                   </div>
//                   <p className="text-gray-600 text-sm mb-4 line-clamp-3">
//                     {service.shortDescription}
//                   </p>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleEditService(service)}
//                       disabled={isDeleting || service.__optimistic}
//                       className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <Edit2 size={16} />
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDeleteService(service._id)}
//                       disabled={isDeleting || service.__optimistic}
//                       className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {isDeleting ? (
//                         <Loader2 size={16} className="animate-spin" />
//                       ) : (
//                         <Trash2 size={16} />
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Empty State */}
//       {services.length === 0 && !isLoading && (
//         <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
//           <LayoutGrid size={64} className="mx-auto text-gray-400 mb-4" />
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">
//             No services found
//           </h3>
//           <p className="text-gray-600 mb-4">
//             {searchTerm || statusFilter ? 'Try adjusting your filters' : 'Create your first service to get started'}
//           </p>
//           {!searchTerm && !statusFilter && (
//             <button
//               onClick={handleCreateService}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
//             >
//               <Plus size={20} />
//               Create Service
//             </button>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
//       {pagination.totalPages > 1 && (
//         <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-200">
//           <div className="text-sm text-gray-600">
//             Showing {services.length} of {pagination.totalServices} services
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => handlePageChange(page - 1)}
//               disabled={page === 1 || isLoading}
//               className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Previous
//             </button>
            
//             <div className="flex gap-1">
//               {[...Array(pagination.totalPages)].map((_, idx) => {
//                 const pageNum = idx + 1;
//                 // Show first, last, current, and adjacent pages
//                 if (
//                   pageNum === 1 ||
//                   pageNum === pagination.totalPages ||
//                   (pageNum >= page - 1 && pageNum <= page + 1)
//                 ) {
//                   return (
//                     <button
//                       key={pageNum}
//                       onClick={() => handlePageChange(pageNum)}
//                       disabled={isLoading}
//                       className={`px-4 py-2 rounded-lg transition-colors ${
//                         page === pageNum
//                           ? 'bg-blue-600 text-white'
//                           : 'border border-gray-300 hover:bg-gray-50'
//                       } disabled:opacity-50 disabled:cursor-not-allowed`}
//                     >
//                       {pageNum}
//                     </button>
//                   );
//                 } else if (pageNum === page - 2 || pageNum === page + 2) {
//                   return <span key={pageNum} className="px-2 py-2">...</span>;
//                 }
//                 return null;
//               })}
//             </div>

//             <button
//               onClick={() => handlePageChange(page + 1)}
//               disabled={page === pagination.totalPages || isLoading}
//               className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ServiceManagement;




import React, { useState, useEffect } from 'react';
import { useModal } from '../../hooks/useModal.js';
import { useConfirm } from '../../hooks/useConfirm.js';
import {
  useAllServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
  useDebounce, // ✅ Import debounce hook
} from '../../hooks/useService.js';
import {
  LayoutGrid, Plus, Search, Edit2, Trash2, Eye, EyeOff,
  Loader2,
  BarChart3,
  Smartphone,
  TrendingUp,
  Monitor,
  Grid3x3,
  GraduationCap
} from 'lucide-react';
import CreateServiceForm from '../../components/forms/CreateServiceForm.jsx';

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

const ServiceManagement = () => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  const [searchInput, setSearchInput] = useState(''); // ✅ Raw input state
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 6;
  
  // ✅ Debounced search value (500ms delay)
  const debouncedSearch = useDebounce(searchInput, 500);
  
  const { openModal, closeModal } = useModal();
  const { confirm } = useConfirm();

  // ============================================
  // REACT QUERY HOOKS
  // ============================================
  
  // Fetch all services with debounced search
  const { data: servicesData, isLoading, isError, error } = useAllServices({ 
    page, 
    limit, 
    status: statusFilter, 
    search: debouncedSearch // ✅ Use debounced value
  });

  // Mutations
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  // Extract data
  const services = servicesData?.services || [];
  const pagination = servicesData?.pagination || {};

  // ============================================
  // EFFECTS - Auto reset page when filters change
  // ============================================
  
  // ✅ Reset to page 1 when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  // ============================================
  // HANDLERS
  // ============================================

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

  /**
   * ✅ Create handler - receives service data
   */
  const handleServiceCreate = async (serviceData) => {
    try {
      await createMutation.mutateAsync(serviceData);
      closeModal();
    } catch (error) {
      // Error already handled by mutation
      console.error('Create service error:', error);
    }
  };

  /**
   * ✅ Update handler - receives service ID and data
   */
  const handleServiceUpdate = async (serviceId, serviceData) => {
    try {
      await updateMutation.mutateAsync({ serviceId, serviceData });
      closeModal();
    } catch (error) {
      // Error already handled by mutation
      console.error('Update service error:', error);
    }
  };

  /**
   * Delete handler with confirmation
   */
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
        // Error already handled by mutation
        console.error('Delete service error:', error);
      }
    }
  };

  /**
   * Pagination handler
   */
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============================================
  // LOADING STATE
  // ============================================
  
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

  // ============================================
  // ERROR STATE
  // ============================================
  
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

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <LayoutGrid size={28} />
            <div>
              <h2 className="text-2xl font-bold">Service Management</h2>
              <p className="text-blue-100">
                Manage services and offerings for your website
              </p>
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
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchInput} // ✅ Use raw input state
                onChange={(e) => setSearchInput(e.target.value)} // ✅ Update immediately for UX
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {/* ✅ Show loading indicator when debouncing */}
              {searchInput !== debouncedSearch && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 size={16} className="text-gray-400 animate-spin" />
                </div>
              )}
            </div>
          </div>
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

      {/* Service Grid */}
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
                className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow ${
                  isDeleting ? 'opacity-50' : ''
                } ${service.__optimistic ? 'ring-2 ring-blue-400' : ''}`}
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center relative">
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
                  {service.__optimistic && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Uploading...
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                    <div className="flex items-center gap-1">
                      {service.isPublished ? (
                        <Eye size={18} className="text-green-600" />
                      ) : (
                        <EyeOff size={18} className="text-gray-400" />
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {service.shortDescription}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditService(service)}
                      disabled={isDeleting || service.__optimistic}
                      className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteService(service._id)}
                      disabled={isDeleting || service.__optimistic}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {services.length} of {pagination.totalServices} services
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex gap-1">
              {[...Array(pagination.totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                // Show first, last, current, and adjacent pages
                if (
                  pageNum === 1 ||
                  pageNum === pagination.totalPages ||
                  (pageNum >= page - 1 && pageNum <= page + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isLoading}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (pageNum === page - 2 || pageNum === page + 2) {
                  return <span key={pageNum} className="px-2 py-2">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pagination.totalPages || isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;