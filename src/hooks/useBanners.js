import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import useAuthStore from '../store/authStore';
import {
  getActiveBannerApi,
  getAllBannersApi,
  createBannerApi,
  updateBannerApi,
  deleteBannerApi,
} from '../api/bannerApi.js';
import toast from 'react-hot-toast';

// ============================================
// QUERY HOOKS (GET REQUESTS)
// ============================================

/**
 * Get active banner for public display
 */
// export const useActiveBanner = () => {
//   return useQuery({
//     queryKey: ['banner', 'active'],
//     queryFn: getActiveBannerApi,
    
//     staleTime: 5 * 60 * 1000,
//     gcTime: 10 * 60 * 1000,
    
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//     refetchOnReconnect: true,
//     select: (data) => data.data?.banner,
//   });
// };


export const useActiveBanner = () => {
  return useQuery({
    queryKey: ['banner', 'active'],
    queryFn: getActiveBannerApi,
    
    // ✅ AGGRESSIVE CACHING: Cache for 30 minutes
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    
    // ✅ FAST FAILURE: Fail fast if no banner
    retry: 1,
    retryDelay: 500,
    
    // ✅ NO UNNECESSARY REFETCHES
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    
    // ✅ EXTRACT BANNER DATA DIRECTLY
    select: (data) => data?.data?.banner || null,
    
    // ✅ PLACEHOLDER DATA: Show nothing while loading
    placeholderData: null,
  });
};


/**
 * Get all banners with automatic next-page prefetching
 */
export const useAllBanners = ({ page = 1, limit = 6, status } = {}) => { 
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['banners', 'all', { page, limit, status }],
    queryFn: () => getAllBannersApi({ page, limit, status }),
    placeholderData: keepPreviousData, // ✅ Modern TanStack Query v5 syntax
    
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    
    enabled: user?.role === 'admin' || user?.role === 'super_admin',
    
    select: (data) => data.data,
  });

  // ✅ Prefetch next page automatically when data loads
  const { currentPage, totalPages } = query.data?.pagination || {};
  
  if (currentPage && currentPage < totalPages) {
    const nextPage = currentPage + 1;
    queryClient.prefetchQuery({
      queryKey: ['banners', 'all', { page: nextPage, limit, status }],
      queryFn: () => getAllBannersApi({ page: nextPage, limit, status }),
      staleTime: 2 * 60 * 1000,
    });
  }

  return query;
};

// ============================================
// MUTATION HOOKS WITH OPTIMISTIC UPDATES
// ============================================

/**
 * ✅ CREATE with optimistic UI update
 * Note: Image preview shown immediately, but actual upload still takes time
 */
export const useCreateBanner = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createBannerApi,
    
    onMutate: async (formData) => {
      // Show loading toast
      toast.loading('Creating banner...', { id: 'create-banner' });
      
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['banners'] });
      
      // Snapshot previous data
      const previousBanners = queryClient.getQueriesData({ queryKey: ['banners', 'all'] });
      
      // Optimistically add new banner with temporary data
      const tempBanner = {
        _id: `temp-${Date.now()}`, // Temporary ID
        imageUrl: formData.get('image') ? URL.createObjectURL(formData.get('image')) : '',
        link: formData.get('link') || '',
        altText: formData.get('altText') || '',
        isActive: formData.get('isActive') === 'true',
        createdAt: new Date().toISOString(),
        __optimistic: true, // Flag to show loading state
      };
      
      // Update all banner list queries
      queryClient.setQueriesData(
        { queryKey: ['banners', 'all'] },
        (oldData) => {
          if (!oldData?.data?.banners) return oldData;
          
          return {
            ...oldData,
            data: {
              ...oldData.data,
              banners: [tempBanner, ...oldData.data.banners], // Add to top
              pagination: {
                ...oldData.data.pagination,
                totalBanners: oldData.data.pagination.totalBanners + 1,
              },
            },
          };
        }
      );
      
      return { previousBanners };
    },
    
    onError: (error, variables, context) => {
      toast.error('Failed to create banner', { id: 'create-banner' });
      
      // Rollback to previous data
      if (context?.previousBanners) {
        context.previousBanners.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      
      console.error('❌ Create banner error:', error);
    },
    
    onSuccess: () => {
      toast.success('Banner created successfully!', { id: 'create-banner' });
      
      // Invalidate to fetch real data from server
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      queryClient.invalidateQueries({ queryKey: ['banner', 'active'] });
    },
  });
};

/**
 * ✅ UPDATE with instant UI feedback
 */
export const useUpdateBanner = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateBannerApi,
    
    // onMutate: async ({ bannerId, formData }) => {
    //   toast.loading('Updating banner...', { id: 'update-banner' });
      
    //   await queryClient.cancelQueries({ queryKey: ['banners'] });
      
    //   // Snapshot all banner queries
    //   const previousBanners = queryClient.getQueriesData({ queryKey: ['banners', 'all'] });
      
    //   // Extract form data
    //   const updates = {
    //     link: formData.get('link'),
    //     altText: formData.get('altText'),
    //     isActive: formData.get('isActive') === 'true',
    //   };
      
    //   // If new image, create preview URL
    //   const newImage = formData.get('image');
    //   if (newImage) {
    //     updates.imageUrl = URL.createObjectURL(newImage);
    //     updates.__uploadingImage = true; // Flag for loading indicator
    //   }
      
    //   // Update all matching banner list queries
    //   queryClient.setQueriesData(
    //     { queryKey: ['banners', 'all'] },
    //     (oldData) => {
    //       if (!oldData?.data?.banners) return oldData;
          
    //       return {
    //         ...oldData,
    //         data: {
    //           ...oldData.data,
    //           banners: oldData.data.banners.map(banner =>
    //             banner._id === bannerId
    //               ? { ...banner, ...updates, __optimistic: true }
    //               : banner
    //           ),
    //         },
    //       };
    //     }
    //   );
      
    //   // Update active banner if this is the active one
    //   if (updates.isActive) {
    //     queryClient.setQueryData(['banner', 'active'], (old) => ({
    //       ...old,
    //       data: { banner: { ...old?.data?.banner, ...updates } },
    //     }));
    //   }
      
    //   return { previousBanners };
    // },
    


    onMutate: async ({ serviceId, formData, serviceSlug }) => {
  if (!(formData instanceof FormData)) {
    throw new Error('useUpdateService expects FormData');
  }

  toast.loading('Updating service...', { id: 'update-service' });

  // const queryClient = useQueryClient();
  await queryClient.cancelQueries({ queryKey: ['services'] });

  // Snapshot all service list queries
  const previousServices = queryClient.getQueriesData({ queryKey: ['services', 'all'] });

  // Snapshot the individual service cache by specific slug
  const previousService = serviceSlug
    ? queryClient.getQueryData(['service', 'slug', serviceSlug])
    : null;

  // Extract updates from FormData
  const updates = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    subtitle: formData.get('subtitle'),
    cardDescription: formData.get('cardDescription'),
    description: formData.get('description'),
    iconName: formData.get('iconName'),
    researchTypes: JSON.parse(formData.get('researchTypes') || '[]'),
    isPublished: formData.get('isPublished') === 'true',
    showOnHomepage: formData.get('showOnHomepage') === 'true',
    displayOrder: parseInt(formData.get('displayOrder') || '0'),
    seo: JSON.parse(formData.get('seo') || '{}'),
  };

  // Handle heroImage safely if a File is uploaded
  const heroImageFile = formData.get('heroImage');
  if (heroImageFile instanceof File && heroImageFile.size > 0) {
    updates.heroImageUrl = URL.createObjectURL(heroImageFile);
    updates.__uploadingImage = true;
  }

  // Optimistically update all service list queries
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
              ? { ...service, ...updates, __optimistic: true }
              : service
          ),
        },
      };
    }
  );

  // Optimistically update individual service cache if exists
  if (previousService) {
    queryClient.setQueryData(
      ['service', 'slug', serviceSlug],
      (oldData) => ({
        ...oldData,
        data: {
          service: { ...oldData.data.service, ...updates, __optimistic: true },
        },
      })
    );
  }

  return { previousServices, previousService };
},
    onError: (error, variables, context) => {
      toast.error('Failed to update banner', { id: 'update-banner' });
      
      // Rollback
      if (context?.previousBanners) {
        context.previousBanners.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      
      console.error('❌ Update banner error:', error);
    },
    
    onSuccess: () => {
      toast.success('Banner updated successfully!', { id: 'update-banner' });
      
      // Fetch fresh data from server
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      queryClient.invalidateQueries({ queryKey: ['banner', 'active'] });
    },
  });
};

/**
 * ✅ DELETE with instant removal
 */
export const useDeleteBanner = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteBannerApi,
    
    onMutate: async (bannerId) => {
      toast.loading('Deleting banner...', { id: 'delete-banner' });
      
      await queryClient.cancelQueries({ queryKey: ['banners'] });
      
      // Snapshot
      const previousBanners = queryClient.getQueriesData({ queryKey: ['banners', 'all'] });
      
      // Remove banner from all list queries
      queryClient.setQueriesData(
        { queryKey: ['banners', 'all'] },
        (oldData) => {
          if (!oldData?.data?.banners) return oldData;
          
          return {
            ...oldData,
            data: {
              ...oldData.data,
              banners: oldData.data.banners.filter(b => b._id !== bannerId),
              pagination: {
                ...oldData.data.pagination,
                totalBanners: oldData.data.pagination.totalBanners - 1,
              },
            },
          };
        }
      );
      
      return { previousBanners };
    },
    
    onError: (error, variables, context) => {
      toast.error('Failed to delete banner', { id: 'delete-banner' });
      
      // Rollback
      if (context?.previousBanners) {
        context.previousBanners.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      
      console.error('❌ Delete banner error:', error);
    },
    
    onSuccess: () => {
      toast.success('Banner deleted successfully!', { id: 'delete-banner' });
      
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      queryClient.invalidateQueries({ queryKey: ['banner', 'active'] });
    },
  });
};





// import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
// import useAuthStore from '../store/authStore';
// import {
//   getActiveBannerApi,
//   getAllBannersApi,
//   createBannerApi,
//   updateBannerApi,
//   deleteBannerApi,
// } from '../api/bannerApi.js';
// import toast from 'react-hot-toast';

// // ============================================
// // QUERY HOOKS (GET REQUESTS)
// // ============================================

// /**
//  * Get active banner for public display
//  */
// export const useActiveBanner = () => {
//   return useQuery({
//     queryKey: ['banner', 'active'],
//     queryFn: getActiveBannerApi,
    
//     staleTime: 5 * 60 * 1000,
//     gcTime: 10 * 60 * 1000,
    
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//     refetchOnReconnect: true,
//     select: (data) => data.data?.banner,
//   });
// };

// /**
//  * Get all banners with automatic next-page prefetching
//  */
// export const useAllBanners = ({ page = 1, limit = 10, status } = {}) => { 
//   const user = useAuthStore((s) => s.user);
//   const queryClient = useQueryClient();
  
//   const query = useQuery({
//     queryKey: ['banners', 'all', { page, limit, status }],
//     queryFn: () => getAllBannersApi({ page, limit, status }),
//     placeholderData: keepPreviousData, // ✅ Modern TanStack Query v5 syntax
    
//     staleTime: 2 * 60 * 1000,
//     gcTime: 5 * 60 * 1000,
    
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//     refetchOnReconnect: true,
    
//     enabled: user?.role === 'admin' || user?.role === 'super_admin',
    
//     select: (data) => data.data,
//   });

//   // ✅ Prefetch next page automatically when data loads
//   const { currentPage, totalPages } = query.data?.pagination || {};
  
//   if (currentPage && currentPage < totalPages) {
//     const nextPage = currentPage + 1;
//     queryClient.prefetchQuery({
//       queryKey: ['banners', 'all', { page: nextPage, limit, status }],
//       queryFn: () => getAllBannersApi({ page: nextPage, limit, status }),
//       staleTime: 2 * 60 * 1000,
//     });
//   }

//   return query;
// };

// // ============================================
// // MUTATION HOOKS WITH OPTIMISTIC UPDATES
// // ============================================

// /**
//  * ✅ CREATE with optimistic UI update
//  * Note: Image preview shown immediately, but actual upload still takes time
//  */
// export const useCreateBanner = () => {
//   const queryClient = useQueryClient();
  
//   return useMutation({
//     mutationFn: createBannerApi,
    
//     onMutate: async (formData) => {
//       // Show loading toast
//       toast.loading('Creating banner...', { id: 'create-banner' });
      
//       // Cancel outgoing queries
//       await queryClient.cancelQueries({ queryKey: ['banners'] });
      
//       // Snapshot previous data
//       const previousBanners = queryClient.getQueriesData({ queryKey: ['banners', 'all'] }); // fail bhayo bhani pailako dekhauney
      
//       // Optimistically add new banner with temporary data
//       const tempBanner = {
//         _id: `temp-${Date.now()}`, // Temporary ID
//         imageUrl: formData.get('image') ? URL.createObjectURL(formData.get('image')) : '',
//         link: formData.get('link') || '',
//         altText: formData.get('altText') || '',
//         isActive: formData.get('isActive') === 'true',
//         createdAt: new Date().toISOString(),
//         __optimistic: true, // Flag to show loading state
//       };
      
//       // Update all banner list queries
//       queryClient.setQueriesData(
//         { queryKey: ['banners', 'all'] },
//         (oldData) => {
//           if (!oldData?.data?.banners) return oldData;
          
//           return {
//             ...oldData,
//             data: {
//               ...oldData.data,
//               banners: [tempBanner, ...oldData.data.banners], // Add to top
//               pagination: {
//                 ...oldData.data.pagination,
//                 totalBanners: oldData.data.pagination.totalBanners + 1,
//               },
//             },
//           };
//         }
//       );
      
//       return { previousBanners };
//     },
    
//     onError: (error, variables, context) => {
//       toast.error('Failed to create banner', { id: 'create-banner' });
      
//       // Rollback to previous data
//       if (context?.previousBanners) {
//         context.previousBanners.forEach(([queryKey, data]) => {
//           queryClient.setQueryData(queryKey, data);
//         });
//       }
      
//       console.error('❌ Create banner error:', error);
//     },
    
//     onSuccess: (data) => {
//       toast.success('Banner created successfully!', { id: 'create-banner' });
      
//       // Invalidate to fetch real data from server
//       queryClient.invalidateQueries({ queryKey: ['banners'] });
//       queryClient.invalidateQueries({ queryKey: ['banner', 'active'] });
//     },
//   });
// };

// /**
//  * ✅ UPDATE with instant UI feedback
//  */
// export const useUpdateBanner = () => {
//   const queryClient = useQueryClient();
  
//   return useMutation({
//     mutationFn: updateBannerApi,
    
//     onMutate: async ({ bannerId, formData }) => {
//       toast.loading('Updating banner...', { id: 'update-banner' });
      
//       await queryClient.cancelQueries({ queryKey: ['banners'] });
      
//       // Snapshot all banner queries
//       const previousBanners = queryClient.getQueriesData({ queryKey: ['banners', 'all'] });
      
//       // Extract form data
//       const updates = {
//         link: formData.get('link'),
//         altText: formData.get('altText'),
//         isActive: formData.get('isActive') === 'true',
//       };
      
//       // If new image, create preview URL
//       const newImage = formData.get('image');
//       if (newImage) {
//         updates.imageUrl = URL.createObjectURL(newImage);
//         updates.__uploadingImage = true; // Flag for loading indicator
//       }
      
//       // Update all matching banner list queries
//       queryClient.setQueriesData(
//         { queryKey: ['banners', 'all'] },
//         (oldData) => {
//           if (!oldData?.data?.banners) return oldData;
          
//           return {
//             ...oldData,
//             data: {
//               ...oldData.data,
//               banners: oldData.data.banners.map(banner =>
//                 banner._id === bannerId
//                   ? { ...banner, ...updates, __optimistic: true }
//                   : banner
//               ),
//             },
//           };
//         }
//       );
      
//       // Update active banner if this is the active one
//       if (updates.isActive) {
//         queryClient.setQueryData(['banner', 'active'], (old) => ({
//           ...old,
//           data: { banner: { ...old?.data?.banner, ...updates } },
//         }));
//       }
      
//       return { previousBanners };
//     },
    
//     onError: (error, variables, context) => {
//       toast.error('Failed to update banner', { id: 'update-banner' });
      
//       // Rollback
//       if (context?.previousBanners) {
//         context.previousBanners.forEach(([queryKey, data]) => {
//           queryClient.setQueryData(queryKey, data);
//         });
//       }
      
//       console.error('❌ Update banner error:', error);
//     },
    
//     onSuccess: (data) => {
//       toast.success('Banner updated successfully!', { id: 'update-banner' });
      
//       // Fetch fresh data from server
//       queryClient.invalidateQueries({ queryKey: ['banners'] });
//       queryClient.invalidateQueries({ queryKey: ['banner', 'active'] });
//     },
//   });
// };

// /**
//  * ✅ DELETE with instant removal
//  */
// export const useDeleteBanner = () => {
//   const queryClient = useQueryClient();
  
//   return useMutation({
//     mutationFn: deleteBannerApi,
    
//     onMutate: async (bannerId) => {
//       toast.loading('Deleting banner...', { id: 'delete-banner' });
      
//       await queryClient.cancelQueries({ queryKey: ['banners'] });
      
//       // Snapshot
//       const previousBanners = queryClient.getQueriesData({ queryKey: ['banners', 'all'] });
      
//       // Remove banner from all list queries
//       queryClient.setQueriesData(
//         { queryKey: ['banners', 'all'] },
//         (oldData) => {
//           if (!oldData?.data?.banners) return oldData;
          
//           return {
//             ...oldData,
//             data: {
//               ...oldData.data,
//               banners: oldData.data.banners.filter(b => b._id !== bannerId),
//               pagination: {
//                 ...oldData.data.pagination,
//                 totalBanners: oldData.data.pagination.totalBanners - 1,
//               },
//             },
//           };
//         }
//       );
      
//       return { previousBanners };
//     },
    
//     onError: (error, variables, context) => {
//       toast.error('Failed to delete banner', { id: 'delete-banner' });
      
//       // Rollback
//       if (context?.previousBanners) {
//         context.previousBanners.forEach(([queryKey, data]) => {
//           queryClient.setQueryData(queryKey, data);
//         });
//       }
      
//       console.error('❌ Delete banner error:', error);
//     },
    
//     onSuccess: (data) => {
//       toast.success('Banner deleted successfully!', { id: 'delete-banner' });
      
//       queryClient.invalidateQueries({ queryKey: ['banners'] });
//       queryClient.invalidateQueries({ queryKey: ['banner', 'active'] });
//     },
//   });
// };


// now claude now banner management for frontend and backend is comlpeated now lets move towards the corse management okay the admin can add a course modify update such things okay lets starts from the backend alright till now i was showing from the the json data static from the files now we would add the courses management first



// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import useAuthStore from '../store/authStore';
// import {
//   getActiveBannerApi,
//   getAllBannersApi,
//   createBannerApi,
//   updateBannerApi,
//   deleteBannerApi,
// } from '../api/bannerApi.js';
// import toast from 'react-hot-toast';

// // ============================================
// // QUERY HOOKS (GET REQUESTS)
// // ============================================

// /**
//  * Get active banner for public display
//  * Can be used on any page without authentication
//  */
// export const useActiveBanner = () => {
//   return useQuery({
//     queryKey: ['banner', 'active'],
//     queryFn: getActiveBannerApi,
    
//     staleTime: 5 * 60 * 1000, // 5 minutes - banners don't change frequently
//     gcTime: 10 * 60 * 1000, // 10 minutes cache
    
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//     refetchOnReconnect: true,
//     select: (data) => data.data?.banner, // Extract just the banner object
//   });
// };

// /**
//  * Get all banners for admin dashboard
//  * @param {Object} params - { page, limit, status }
//  */
// //get me 10 cards in the 1st page and respectively
// export const useAllBanners = ({ page = 1, limit = 10, status } = {}) => { 
//   const user = useAuthStore((s) => s.user);
  
//   return useQuery({
//     queryKey: ['banners', 'all', { page, limit, status }], // Include params in cache key
//     queryFn: () => getAllBannersApi({ page, limit, status }),
//     keepPreviousData: true, // <--- important

//     staleTime: 2 * 60 * 1000, // 2 minutes
//     gcTime: 5 * 60 * 1000, // 5 minutes cache
    
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//     refetchOnReconnect: true,
    
//     // Only fetch if user is admin or super_admin
//     enabled: user?.role === 'admin' || user?.role === 'super_admin',
    
//     select: (data) => {
//       console.log('🔄 [TanStack] Processing banners data...');
//       return data.data; // Returns { banners: [...], pagination: {...} }
//     },
//   });
// };

// // ============================================
// // MUTATION HOOKS (CREATE/UPDATE/DELETE)
// // ============================================

// /**
//  * Create new banner mutation
//  */
// export const useCreateBanner = () => {
//   const queryClient = useQueryClient();
  
//   return useMutation({
//     mutationFn: createBannerApi,
    
//     onSuccess: (data) => {
//       // Invalidate all banner queries to refetch fresh data
//       queryClient.invalidateQueries({ queryKey: ['banners'] });
//       queryClient.invalidateQueries({ queryKey: ['banner', 'active'] });
      
//       toast.success(data.message || 'Banner created successfully!');
//     },
    
//     onError: (error) => {
//       const errorMessage = error.response?.data?.message || 'Failed to create banner';
//       toast.error(errorMessage);
//       console.error('❌ Create banner error:', error);
//     },
//   });
// };

// /**
//  * Update banner mutation
//  */
// export const useUpdateBanner = () => {
//   const queryClient = useQueryClient();
  
//   return useMutation({
//     mutationFn: updateBannerApi,
    
//     onSuccess: (data) => {
//       // Invalidate all banner queries
//       queryClient.invalidateQueries({ queryKey: ['banners'] });
//       queryClient.invalidateQueries({ queryKey: ['banner', 'active'] });
      
//       toast.success(data.message || 'Banner updated successfully!');
//     },
    
//     onError: (error) => {
//       const errorMessage = error.response?.data?.message || 'Failed to update banner';
//       toast.error(errorMessage);
//       console.error('❌ Update banner error:', error);
//     },
//   });
// };


// // //for the fast ui update cause image update takes time  This is called rollback
// // export const useUpdateBanner = () => {
// //   const queryClient = useQueryClient();

// //   return useMutation({
// //     mutationFn: updateBannerApi,

// //     // Optimistic update before server responds
// //      onMutate: async ({ bannerId, formData }) => {
// //       await queryClient.cancelQueries({ queryKey: ['banners'] });

// //       const previousData = queryClient.getQueryData(['banners']); //Take a snapshot of old data

// //       queryClient.setQueryData(['banners'], oldData => ({
// //         ...oldData,
// //         banners: oldData.banners.map(b =>
// //           b._id === bannerId ? { ...b, ...formData } : b
// //         ),
// //       }));

// //       return { previousData };
// //     },

// //     onError: (err, variables, context) => {
// //       // Roll back cache if server fails
// //       queryClient.setQueryData(['banners'], context.previousData);
// //       toast.error('Failed to update banner');
// //     },

// //     onSuccess: (data) => {
// //       toast.success('Banner updated successfully!');
// //       queryClient.invalidateQueries({ queryKey: ['banners'] }); // Ensure fresh data
// //     },
// //   });
// // };


// // Optimistic update: UI updates immediately, before server responds

// // Steps:

// // User clicks “Update banner”

// // onMutate changes React Query cache instantly → UI shows new banner info immediately

// // API request runs in background

// // If API succeeds → optionally refetch (invalidateQueries) to ensure fresh data

// // If API fails → rollback cache to previousData → user sees old state

// // Benefit: UI feels instant, no waiting for network, better UX, especially with images/files.

// // 2️⃣ Interaction example (flow)

// // Imagine a banner with:

// // altText: "Old Text"

// // isActive: false

// // You want to update it to:

// // altText: "New Text"

// // isActive: true

// // Normal update (Version 1)

// // Click “Update” → nothing changes in UI

// // Wait 3 seconds for image upload + API

// // Server responds → cache invalidates → query fetches new data

// // UI updates → now shows "New Text"

// // UX: feels slow, user waits → bad experience

// // Optimistic update (Version 2)

// // Click “Update” → onMutate immediately changes cache

// // UI instantly shows "New Text" and isActive: true

// // API runs in background

// // Server responds → cache invalidates (optional)

// // UI stays correct → user sees instant feedback

// // If API fails → rollback → user sees old "Old Text"

// // UX: feels instantaneous → better for long uploads or slow network




// /**
//  * Delete banner mutation
//  */
// export const useDeleteBanner = () => {
//   const queryClient = useQueryClient();
  
//   return useMutation({
//     mutationFn: deleteBannerApi,
    
//     onSuccess: (data) => {
//       // Invalidate all banner queries
//       queryClient.invalidateQueries({ queryKey: ['banners'] });
//       queryClient.invalidateQueries({ queryKey: ['banner', 'active'] });
      
//       toast.success(data.message || 'Banner deleted successfully!');
//     },
    
//     onError: (error) => {
//       const errorMessage = error.response?.data?.message || 'Failed to delete banner';
//       toast.error(errorMessage);
//       console.error('❌ Delete banner error:', error);
//     },
//   });
// };