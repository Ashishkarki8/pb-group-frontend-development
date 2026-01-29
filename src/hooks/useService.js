// import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
// import useAuthStore from '../store/authStore';
// import {
//   getActiveServicesApi,
//   getServiceBySlugApi,
//   getAllServicesApi,
//   createServiceApi,
//   updateServiceApi,
//   deleteServiceApi,
//   toggleServicePublishApi,
//   updateServiceOrderApi,
// } from '../api/serviceApi.js';
// import toast from 'react-hot-toast';

// // ============================================
// // QUERY HOOKS (GET REQUESTS)
// // ============================================

// /**
//  * Get active services for homepage (PUBLIC)
//  * ✅ AGGRESSIVE CACHING - Homepage services rarely change
//  */
// export const useActiveServices = ({ showOnHomepage = true } = {}) => {
//   return useQuery({
//     queryKey: ['services', 'active', { showOnHomepage }],
//     queryFn: () => getActiveServicesApi({ showOnHomepage }),
    
//     // ✅ Cache for 30 minutes
//     staleTime: 30 * 60 * 1000,
//     gcTime: 60 * 60 * 1000,
    
//     // ✅ Fast failure
//     retry: 1,
//     retryDelay: 500,
    
//     // ✅ No unnecessary refetches
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//     refetchOnReconnect: false,
    
//     // ✅ Extract services array directly
//     select: (data) => data?.data?.services || [],
//   });
// };

// /**
//  * Get single service by slug (PUBLIC)
//  * ✅ Individual service caching
//  */
// export const useServiceBySlug = (slug) => {
//   return useQuery({
//     queryKey: ['service', 'slug', slug],
//     queryFn: () => getServiceBySlugApi(slug),
    
//     enabled: !!slug, // Only run if slug exists
    
//     staleTime: 15 * 60 * 1000, // 15 minutes
//     gcTime: 30 * 60 * 1000,
    
//     retry: 2,
    
//     select: (data) => data?.data?.service || null,
//   });
// };

// /**
//  * Get all services with search, filters & pagination (ADMIN)
//  * ✅ Advanced filtering + Auto prefetch next page
//  */
// export const useAllServices = ({ 
//   page = 1, 
//   limit = 6, 
//   status = '', 
//   search = '',
//   showOnHomepage 
// } = {}) => { 
//   const user = useAuthStore((s) => s.user);
//   const queryClient = useQueryClient();
  
//   const query = useQuery({
//     queryKey: ['services', 'all', { page, limit, status, search, showOnHomepage }],
//     queryFn: () => getAllServicesApi({ page, limit, status, search, showOnHomepage }),
    
//     placeholderData: keepPreviousData, // ✅ Smooth pagination transitions
    
//     staleTime: 2 * 60 * 1000, // 2 minutes
//     gcTime: 5 * 60 * 1000,
    
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//     refetchOnReconnect: true,
    
//     // ✅ Only admins can fetch all services
//     enabled: user?.role === 'admin' || user?.role === 'super_admin',
    
//     select: (data) => data.data,
//   });

//   // ✅ Auto-prefetch next page for instant pagination
//   const { currentPage, totalPages } = query.data?.pagination || {};
  
//   if (currentPage && currentPage < totalPages && !search) {
//     const nextPage = currentPage + 1;
//     queryClient.prefetchQuery({
//       queryKey: ['services', 'all', { page: nextPage, limit, status, search, showOnHomepage }],
//       queryFn: () => getAllServicesApi({ page: nextPage, limit, status, search, showOnHomepage }),
//       staleTime: 2 * 60 * 1000,
//     });
//   }

//   return query;
// };

// // ============================================
// // MUTATION HOOKS WITH OPTIMISTIC UPDATES
// // ============================================

// /**
//  * ✅ CREATE SERVICE with optimistic UI
//  * Shows instant preview while uploading to server
//  */
// export const useCreateService = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (serviceData) => {
//       let uploadedImageUrl = serviceData.heroImageUrl;


//       // Send API request with JSON payload
//       return createServiceApi({
//         ...serviceData,
//         heroImageUrl: uploadedImageUrl,
//       });
//     },

//     onMutate: async (serviceData) => {
//       toast.loading('Creating service...', { id: 'create-service' });
//       await queryClient.cancelQueries({ queryKey: ['services'] });

//       // Snapshot previous services for rollback
//       const previousServices = queryClient.getQueryData(['services', 'all']);

//       // Optimistic temporary service
//       const tempService = {
//         _id: `temp-${Date.now()}`,
//         title: serviceData.title || '',
//         slug: serviceData.slug || '',
//         subtitle: serviceData.subtitle || '',
//         shortDescription: serviceData.shortDescription || '',
//         description: serviceData.description || '',
//         iconName: serviceData.iconName || 'BarChart3',
//         heroImageUrl: serviceData.heroImageFile
//           ? URL.createObjectURL(serviceData.heroImageFile)
//           : serviceData.heroImageUrl || '/service/default.webp',
//         researchTypes: serviceData.researchTypes || [],
//         isPublished: !!serviceData.isPublished,
//         showOnHomepage: !!serviceData.showOnHomepage,
//         displayOrder: parseInt(serviceData.displayOrder || 0),
//         seo: serviceData.seo || {},
//         createdAt: new Date().toISOString(),
//         __optimistic: true,
//       };

//       // Update cache optimistically
//       queryClient.setQueryData(['services', 'all'], (oldData) => {
//         if (!oldData?.data?.services) return oldData;
//         return {
//           ...oldData,
//           data: {
//             ...oldData.data,
//             services: [tempService, ...oldData.data.services],
//             pagination: {
//               ...oldData.data.pagination,
//               totalServices: (oldData.data.pagination.totalServices || 0) + 1,
//             },
//           },
//         };
//       });

//       return { previousServices };
//     },

//     onError: (error, variables, context) => {
//       toast.error(error?.message || 'Failed to create service', { id: 'create-service' });

//       // Rollback on failure
//       if (context?.previousServices) {
//         queryClient.setQueryData(['services', 'all'], context.previousServices);
//       }
//     },

//     onSuccess: () => {
//       toast.success('Service created successfully!', { id: 'create-service' });
//       queryClient.invalidateQueries(['services']);
//     },
//   });
// };


// export const useUpdateService = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({ serviceId, serviceData }) => {
//       let uploadedImageUrl = serviceData.heroImageUrl;

  
//       // Call API with JSON payload
//       return updateServiceApi(serviceId, {
//         ...serviceData,
//         heroImageUrl: uploadedImageUrl,
//       });
//     },

//     onMutate: async ({ serviceId, serviceData }) => {
//       toast.loading('Updating service...', { id: 'update-service' });

//       await queryClient.cancelQueries({ queryKey: ['services'] });

//       // Snapshot previous cache for rollback
//       const previousServices = queryClient.getQueryData(['services', 'all']);
//       const previousService = queryClient.getQueryData(['service', 'slug']);

//       // Prepare optimistic updates
//       const updates = {
//         ...serviceData,
//         heroImageUrl: serviceData.heroImageFile
//           ? URL.createObjectURL(serviceData.heroImageFile)
//           : serviceData.heroImageUrl || previousService?.data?.service?.heroImageUrl,
//         __optimistic: true,
//       };

//       // Update services list cache optimistically
//       queryClient.setQueryData(['services', 'all'], (oldData) => {
//         if (!oldData?.data?.services) return oldData;
//         return {
//           ...oldData,
//           data: {
//             ...oldData.data,
//             services: oldData.data.services.map((service) =>
//               service._id === serviceId ? { ...service, ...updates } : service
//             ),
//           },
//         };
//       });

//       // Update individual service cache
//       queryClient.setQueryData(['service', 'slug'], (oldData) => {
//         if (!oldData?.data?.service || oldData.data.service._id !== serviceId) {
//           return oldData;
//         }
//         return {
//           ...oldData,
//           data: {
//             service: { ...oldData.data.service, ...updates },
//           },
//         };
//       });

//       return { previousServices, previousService };
//     },

//     onError: (error, variables, context) => {
//       toast.error(error?.response?.data?.message || 'Failed to update service', {
//         id: 'update-service',
//       });

//       // Rollback previous caches
//       if (context?.previousServices) {
//         queryClient.setQueryData(['services', 'all'], context.previousServices);
//       }
//       if (context?.previousService) {
//         queryClient.setQueryData(['service', 'slug'], context.previousService);
//       }

//       console.error('❌ Update service error:', error);
//     },

//     onSuccess: () => {
//       toast.success('Service updated successfully!', { id: 'update-service' });
//       queryClient.invalidateQueries(['services']);
//       queryClient.invalidateQueries(['service', 'slug']);
//     },
//   });
// };


// /**
//  * ✅ DELETE SERVICE with instant removal
//  */
// export const useDeleteService = () => {
//   const queryClient = useQueryClient();
  
//   return useMutation({
//     mutationFn: deleteServiceApi,
    
//     onMutate: async (serviceId) => {
//       toast.loading('Deleting service...', { id: 'delete-service' });
      
//       await queryClient.cancelQueries({ queryKey: ['services'] });
      
//       // Snapshot
//       const previousServices = queryClient.getQueriesData({ queryKey: ['services', 'all'] });
      
//       // Remove service from all list queries instantly
//       queryClient.setQueriesData(
//         { queryKey: ['services', 'all'] },
//         (oldData) => {
//           if (!oldData?.data?.services) return oldData;
          
//           return {
//             ...oldData,
//             data: {
//               ...oldData.data,
//               services: oldData.data.services.filter(s => s._id !== serviceId),
//               pagination: {
//                 ...oldData.data.pagination,
//                 totalServices: oldData.data.pagination.totalServices - 1,
//               },
//             },
//           };
//         }
//       );
      
//       return { previousServices };
//     },
    
//     onError: (error, variables, context) => {
//       toast.error(error?.response?.data?.message || 'Failed to delete service', { 
//         id: 'delete-service' 
//       });
      
//       // Rollback
//       if (context?.previousServices) {
//         context.previousServices.forEach(([queryKey, data]) => {
//           queryClient.setQueryData(queryKey, data);
//         });
//       }
      
//       console.error('❌ Delete service error:', error);
//     },
    
//     onSuccess: () => {
//       toast.success('Service deleted successfully!', { id: 'delete-service' });
      
//       queryClient.invalidateQueries({ queryKey: ['services'] });
//     },
//   });
// };

// /**
//  * ✅ TOGGLE PUBLISH STATUS (Quick action)
//  */
// export const useToggleServicePublish = () => {
//   const queryClient = useQueryClient();
  
//   return useMutation({
//     mutationFn: toggleServicePublishApi,
    
//     onMutate: async ({ serviceId, isPublished }) => {
//       await queryClient.cancelQueries({ queryKey: ['services'] });
      
//       const previousServices = queryClient.getQueriesData({ queryKey: ['services', 'all'] });
      
//       // Update status instantly
//       queryClient.setQueriesData(
//         { queryKey: ['services', 'all'] },
//         (oldData) => {
//           if (!oldData?.data?.services) return oldData;
          
//           return {
//             ...oldData,
//             data: {
//               ...oldData.data,
//               services: oldData.data.services.map(service =>
//                 service._id === serviceId
//                   ? { ...service, isPublished, __optimistic: true }
//                   : service
//               ),
//             },
//           };
//         }
//       );
      
//       return { previousServices };
//     },
    
//     onError: (error, variables, context) => {
//       toast.error('Failed to update publish status');
      
//       if (context?.previousServices) {
//         context.previousServices.forEach(([queryKey, data]) => {
//           queryClient.setQueryData(queryKey, data);
//         });
//       }
//     },
    
//     onSuccess: (data, { isPublished }) => {
//       toast.success(isPublished ? 'Service published!' : 'Service unpublished!');
//       queryClient.invalidateQueries({ queryKey: ['services'] });
//     },
//   });
// };

// /**
//  * ✅ REORDER SERVICES (Drag & drop)
//  */
// export const useReorderServices = () => {
//   const queryClient = useQueryClient();
  
//   return useMutation({
//     mutationFn: updateServiceOrderApi,
    
//     onMutate: async (orderData) => {
//       await queryClient.cancelQueries({ queryKey: ['services'] });
      
//       const previousServices = queryClient.getQueriesData({ queryKey: ['services', 'all'] });
      
//       // Update order instantly
//       queryClient.setQueriesData(
//         { queryKey: ['services', 'all'] },
//         (oldData) => {
//           if (!oldData?.data?.services) return oldData;
          
//           const serviceMap = new Map(oldData.data.services.map(s => [s._id, s]));
          
//           orderData.forEach(({ serviceId, displayOrder }) => {
//             const service = serviceMap.get(serviceId);
//             if (service) {
//               service.displayOrder = displayOrder;
//             }
//           });
          
//           return {
//             ...oldData,
//             data: {
//               ...oldData.data,
//               services: Array.from(serviceMap.values())
//                 .sort((a, b) => a.displayOrder - b.displayOrder),
//             },
//           };
//         }
//       );
      
//       return { previousServices };
//     },
    
//     onError: (error, variables, context) => {
//       toast.error('Failed to reorder services');
      
//       if (context?.previousServices) {
//         context.previousServices.forEach(([queryKey, data]) => {
//           queryClient.setQueryData(queryKey, data);
//         });
//       }
//     },
    
//     onSuccess: () => {
//       toast.success('Services reordered!');
//       queryClient.invalidateQueries({ queryKey: ['services'] });
//     },
//   });
// };




import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import {
  getActiveServicesApi,
  getServiceBySlugApi,
  getAllServicesApi,
  createServiceApi,
  updateServiceApi,
  deleteServiceApi,
  toggleServicePublishApi,
  updateServiceOrderApi,
} from '../api/serviceApi.js';
import toast from 'react-hot-toast';

// ============================================
// UTILITY HOOK - DEBOUNCE
// ============================================

/**
 * Custom debounce hook to delay state updates
 * Useful for search inputs to prevent excessive API calls
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500ms)
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup timeout if value changes before delay completes
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// ============================================
// QUERY HOOKS (GET REQUESTS)
// ============================================

/**
 * Get active services for homepage (PUBLIC)
 * ✅ AGGRESSIVE CACHING - Homepage services rarely change
 */
export const useActiveServices = ({ showOnHomepage = true } = {}) => {
  return useQuery({
    queryKey: ['services', 'active', { showOnHomepage }],
    queryFn: () => getActiveServicesApi({ showOnHomepage }),
    
    // ✅ Cache for 30 minutes
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    
    // ✅ Fast failure
    retry: 1,
    retryDelay: 500,
    
    // ✅ No unnecessary refetches
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    
    // ✅ Extract services array directly
    select: (data) => data?.data?.services || [],
  });
};

/**
 * Get single service by slug (PUBLIC)
 * ✅ Individual service caching
 */
export const useServiceBySlug = (slug) => {
  return useQuery({
    queryKey: ['service', 'slug', slug],
    queryFn: () => getServiceBySlugApi(slug),
    
    enabled: !!slug, // Only run if slug exists
    
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000,
    
    retry: 2,
    
    select: (data) => data?.data?.service || null,
  });
};

/**
 * Get all services with search, filters & pagination (ADMIN)
 * ✅ Advanced filtering + Auto prefetch next page + Abort signals
 */
export const useAllServices = ({ 
  page = 1, 
  limit = 6, 
  status = '', 
  search = '',
  showOnHomepage 
} = {}) => { 
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['services', 'all', { page, limit, status, search, showOnHomepage }],
    queryFn: ({ signal }) => getAllServicesApi({ page, limit, status, search, showOnHomepage }, signal),
    
    placeholderData: keepPreviousData, // ✅ Smooth pagination transitions
    
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
    
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    
    // ✅ Only admins can fetch all services
    enabled: user?.role === 'admin' || user?.role === 'super_admin',
    
    select: (data) => data.data,
  });

  // ✅ Auto-prefetch next page for instant pagination (only when not searching/filtering)
  const { currentPage, totalPages } = query.data?.pagination || {};
  
  useEffect(() => {
    if (currentPage && currentPage < totalPages && !search && !status) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: ['services', 'all', { page: nextPage, limit, status: '', search: '', showOnHomepage }],
        queryFn: ({ signal }) => getAllServicesApi({ page: nextPage, limit, status: '', search: '', showOnHomepage }, signal),
        staleTime: 2 * 60 * 1000,
      });
    }
  }, [currentPage, totalPages, search, status, limit, showOnHomepage, queryClient]);

  return query;
};

// ============================================
// HELPER FUNCTION - Convert Data to FormData
// ============================================

/**
 * Convert service data object to FormData for multipart upload
 * @param {Object} serviceData - The service data object
 * @returns {FormData} - FormData ready for API submission
 */
const convertToFormData = (serviceData) => {
  const formData = new FormData();
  
  // Append text fields
  if (serviceData.title) formData.append('title', serviceData.title);
  if (serviceData.slug) formData.append('slug', serviceData.slug);
  if (serviceData.subtitle) formData.append('subtitle', serviceData.subtitle || '');
  if (serviceData.shortDescription) formData.append('shortDescription', serviceData.shortDescription);
  if (serviceData.description) formData.append('description', serviceData.description);
  if (serviceData.iconName) formData.append('iconName', serviceData.iconName);
  
  // Append boolean fields
  formData.append('isPublished', serviceData.isPublished ? 'true' : 'false');
  formData.append('showOnHomepage', serviceData.showOnHomepage ? 'true' : 'false');
  
  // Append number fields
  formData.append('displayOrder', String(serviceData.displayOrder || 0));
  
  // Append arrays as JSON strings
  if (serviceData.researchTypes && Array.isArray(serviceData.researchTypes)) {
    formData.append('researchTypes', JSON.stringify(serviceData.researchTypes));
  }
  
  // Append SEO object as JSON string
  if (serviceData.seo) {
    formData.append('seo', JSON.stringify(serviceData.seo));
  }
  
  // Append file if exists (heroImage is the file from input, not heroImageUrl string)
  if (serviceData.heroImage instanceof File) {
    formData.append('heroImage', serviceData.heroImage);
  }
  
  return formData;
};

// ============================================
// MUTATION HOOKS WITH OPTIMISTIC UPDATES
// ============================================

/**
 * ✅ CREATE SERVICE with optimistic UI and proper FormData
 */
export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceData) => {
      // ✅ Convert to FormData for multipart upload
      const formData = convertToFormData(serviceData);
      return createServiceApi(formData);
    },

    onMutate: async (serviceData) => {
      toast.loading('Creating service...', { id: 'create-service' });
      await queryClient.cancelQueries({ queryKey: ['services'] });

      // Snapshot previous services for rollback
      const previousServices = queryClient.getQueryData(['services', 'all']);

      // Optimistic temporary service
      const tempService = {
        _id: `temp-${Date.now()}`,
        title: serviceData.title || '',
        slug: serviceData.slug || '',
        subtitle: serviceData.subtitle || '',
        shortDescription: serviceData.shortDescription || '',
        description: serviceData.description || '',
        iconName: serviceData.iconName || 'BarChart3',
        heroImage: {
          url: serviceData.heroImage instanceof File
            ? URL.createObjectURL(serviceData.heroImage)
            : '/service/default.webp'
        },
        researchTypes: serviceData.researchTypes || [],
        isPublished: !!serviceData.isPublished,
        showOnHomepage: !!serviceData.showOnHomepage,
        displayOrder: parseInt(serviceData.displayOrder || 0),
        seo: serviceData.seo || {},
        createdAt: new Date().toISOString(),
        __optimistic: true,
      };

      // Update cache optimistically
      queryClient.setQueryData(['services', 'all'], (oldData) => {
        if (!oldData?.data?.services) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            services: [tempService, ...oldData.data.services],
            pagination: {
              ...oldData.data.pagination,
              totalServices: (oldData.data.pagination.totalServices || 0) + 1,
            },
          },
        };
      });

      return { previousServices };
    },

    onError: (error, variables, context) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create service';
      toast.error(errorMessage, { id: 'create-service' });

      // Rollback on failure
      if (context?.previousServices) {
        queryClient.setQueryData(['services', 'all'], context.previousServices);
      }
      
      console.error('❌ Create service error:', error);
    },

    onSuccess: (data) => {
      toast.success('Service created successfully!', { id: 'create-service' });
      queryClient.invalidateQueries({ queryKey: ['services'] });
      return data;
    },
  });
};

/**
 * ✅ UPDATE SERVICE with optimistic UI and proper FormData
 */
export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceId, serviceData }) => {
      // ✅ Convert to FormData for multipart upload
      const formData = convertToFormData(serviceData);
      
      // ✅ Call API with correct signature: { serviceId, formData }
      return updateServiceApi({ serviceId, formData });
    },

    onMutate: async ({ serviceId, serviceData }) => {
      toast.loading('Updating service...', { id: 'update-service' });

      await queryClient.cancelQueries({ queryKey: ['services'] });

      // Snapshot previous cache for rollback
      const previousServices = queryClient.getQueryData(['services', 'all']);
      const previousService = queryClient.getQueryData(['service', 'slug']);

      // Prepare optimistic updates
      const updates = {
        ...serviceData,
        heroImage: {
          url: serviceData.heroImage instanceof File
            ? URL.createObjectURL(serviceData.heroImage)
            : serviceData.heroImage?.url || previousService?.heroImage?.url || '/service/default.webp'
        },
        __optimistic: true,
      };

      // Update services list cache optimistically
      queryClient.setQueryData(['services', 'all'], (oldData) => {
        if (!oldData?.data?.services) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            services: oldData.data.services.map((service) =>
              service._id === serviceId ? { ...service, ...updates } : service
            ),
          },
        };
      });

      // Update individual service cache
      queryClient.setQueryData(['service', 'slug'], (oldData) => {
        if (!oldData?.data?.service || oldData.data.service._id !== serviceId) {
          return oldData;
        }
        return {
          ...oldData,
          data: {
            service: { ...oldData.data.service, ...updates },
          },
        };
      });

      return { previousServices, previousService };
    },

    onError: (error, variables, context) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update service';
      toast.error(errorMessage, { id: 'update-service' });

      // Rollback previous caches
      if (context?.previousServices) {
        queryClient.setQueryData(['services', 'all'], context.previousServices);
      }
      if (context?.previousService) {
        queryClient.setQueryData(['service', 'slug'], context.previousService);
      }

      console.error('❌ Update service error:', error);
    },

    onSuccess: (data) => {
      toast.success('Service updated successfully!', { id: 'update-service' });
      queryClient.invalidateQueries({ queryKey: ['services'] });
      return data;
    },
  });
};

/**
 * ✅ DELETE SERVICE with instant removal
 */
export const useDeleteService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteServiceApi,
    
    onMutate: async (serviceId) => {
      toast.loading('Deleting service...', { id: 'delete-service' });
      
      await queryClient.cancelQueries({ queryKey: ['services'] });
      
      // Snapshot all services queries
      const previousServices = queryClient.getQueriesData({ queryKey: ['services', 'all'] });
      
      // Remove service from all list queries instantly
      queryClient.setQueriesData(
        { queryKey: ['services', 'all'] },
        (oldData) => {
          if (!oldData?.data?.services) return oldData;
          
          return {
            ...oldData,
            data: {
              ...oldData.data,
              services: oldData.data.services.filter(s => s._id !== serviceId),
              pagination: {
                ...oldData.data.pagination,
                totalServices: Math.max(0, oldData.data.pagination.totalServices - 1),
              },
            },
          };
        }
      );
      
      return { previousServices };
    },
    
    onError: (error, variables, context) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete service';
      toast.error(errorMessage, { id: 'delete-service' });
      
      // Rollback all queries
      if (context?.previousServices) {
        context.previousServices.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      
      console.error('❌ Delete service error:', error);
    },
    
    onSuccess: () => {
      toast.success('Service deleted successfully!', { id: 'delete-service' });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

/**
 * ✅ TOGGLE PUBLISH STATUS (Quick action)
 */
export const useToggleServicePublish = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: toggleServicePublishApi,
    
    onMutate: async ({ serviceId, isPublished }) => {
      await queryClient.cancelQueries({ queryKey: ['services'] });
      
      const previousServices = queryClient.getQueriesData({ queryKey: ['services', 'all'] });
      
      // Update status instantly
      queryClient.setQueriesData(
        { queryKey: ['services', 'all'] },
        (oldData) => {
          if (!oldData?.data?.services) return oldData;
          
          return {
            ...oldData,
            data: {
              ...oldData.data,
              services: oldData.data.services.map(service =>
                service._id === serviceId
                  ? { ...service, isPublished, __optimistic: true }
                  : service
              ),
            },
          };
        }
      );
      
      return { previousServices };
    },
    
    onError: (error, variables, context) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update publish status';
      toast.error(errorMessage);
      
      if (context?.previousServices) {
        context.previousServices.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      
      console.error('❌ Toggle publish error:', error);
    },
    
    onSuccess: (data, { isPublished }) => {
      toast.success(isPublished ? 'Service published!' : 'Service unpublished!');
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

/**
 * ✅ REORDER SERVICES (Drag & drop)
 */
export const useReorderServices = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateServiceOrderApi,
    
    onMutate: async (orderData) => {
      await queryClient.cancelQueries({ queryKey: ['services'] });
      
      const previousServices = queryClient.getQueriesData({ queryKey: ['services', 'all'] });
      
      // Update order instantly
      queryClient.setQueriesData(
        { queryKey: ['services', 'all'] },
        (oldData) => {
          if (!oldData?.data?.services) return oldData;
          
          const serviceMap = new Map(oldData.data.services.map(s => [s._id, s]));
          
          orderData.forEach(({ serviceId, displayOrder }) => {
            const service = serviceMap.get(serviceId);
            if (service) {
              service.displayOrder = displayOrder;
            }
          });
          
          return {
            ...oldData,
            data: {
              ...oldData.data,
              services: Array.from(serviceMap.values())
                .sort((a, b) => a.displayOrder - b.displayOrder),
            },
          };
        }
      );
      
      return { previousServices };
    },
    
    onError: (error, variables, context) => {
      const errorMessage = error?.response?.data?.message || 'Failed to reorder services';
      toast.error(errorMessage);
      
      if (context?.previousServices) {
        context.previousServices.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      
      console.error('❌ Reorder services error:', error);
    },
    
    onSuccess: () => {
      toast.success('Services reordered!');
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};