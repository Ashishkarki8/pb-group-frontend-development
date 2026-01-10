// ========================================
// REACT QUERY CONFIGURATION
// Optimized caching, refetching, and error handling
// ========================================
// react-query.js
import { QueryClient } from '@tanstack/react-query';
import { CACHE_TIME } from '../utils/constants';

// ========================================
// QUERY CLIENT CONFIGURATION
// ========================================
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ========================================
      // CACHING STRATEGY
      // ========================================
      staleTime: CACHE_TIME.SHORT, // 5 minutes - data stays fresh
      cacheTime: CACHE_TIME.MEDIUM, // 10 minutes - data stays in memory
      
      // ========================================
      // REFETCHING BEHAVIOR
      // ========================================
      refetchOnWindowFocus: true, // Refetch when user comes back to tab
      refetchOnReconnect: true, // Refetch when internet reconnects
      refetchOnMount: true, // Refetch when component mounts
      
      // ========================================
      // RETRY LOGIC
      // ========================================
      retry: 1, // Retry failed requests once
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // ========================================
      // ERROR HANDLING
      // ========================================
      onError: (error) => {
        console.error('Query error:', error);
        // Error toasts are handled by axios interceptor
      },
      
      // ========================================
      // PERFORMANCE
      // ========================================
      suspense: false, // Don't use suspense by default
      useErrorBoundary: false, // Handle errors in components
    },
    
    mutations: {
      // ========================================
      // MUTATION ERROR HANDLING
      // ========================================
      onError: (error) => {
        console.error('Mutation error:', error);
        // Error toasts are handled by axios interceptor
      },
      
      // ========================================
      // RETRY LOGIC FOR MUTATIONS
      // ========================================
      retry: 0, // Don't retry mutations (they're idempotent)
    },
  },
});

// ========================================
// QUERY KEY FACTORIES
// Centralized way to create consistent query keys
// ========================================

export const queryKeys = {
  // Auth keys
  auth: {
    all: ['auth'],
    user: () => [...queryKeys.auth.all, 'user'],
    verify: () => [...queryKeys.auth.all, 'verify'],
  },
  
  // Admin keys
  admin: {
    all: ['admin'],
    lists: () => [...queryKeys.admin.all, 'list'],
    list: (filters) => [...queryKeys.admin.lists(), filters],
    details: () => [...queryKeys.admin.all, 'detail'],
    detail: (id) => [...queryKeys.admin.details(), id],
    stats: () => [...queryKeys.admin.all, 'stats'],
  },
};

// ========================================
// CACHE INVALIDATION HELPERS
// ========================================

/**
 * Invalidate all auth queries
 */
export const invalidateAuthQueries = () => {
  return queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
};

/**
 * Invalidate all admin queries
 */
export const invalidateAdminQueries = () => {
  return queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
};

/**
 * Invalidate specific admin detail
 */
export const invalidateAdminDetail = (id) => {
  return queryClient.invalidateQueries({ queryKey: queryKeys.admin.detail(id) });
};

/**
 * Invalidate admin list
 */
export const invalidateAdminList = () => {
  return queryClient.invalidateQueries({ queryKey: queryKeys.admin.lists() });
};

/**
 * Invalidate admin stats
 */
export const invalidateAdminStats = () => {
  return queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() });
};

// ========================================
// PREFETCH HELPERS
// ========================================

/**
 * Prefetch admin list
 */
export const prefetchAdminList = async (filters = {}) => {
  // Will be implemented when we create admin service
};

/**
 * Prefetch admin detail
 */
export const prefetchAdminDetail = async (id) => {
  // Will be implemented when we create admin service
};

// ========================================
// OPTIMISTIC UPDATE HELPERS
// ========================================

/**
 * Example: Optimistically update admin in cache
 */
export const optimisticallyUpdateAdmin = (id, updates) => {
  queryClient.setQueryData(queryKeys.admin.detail(id), (oldData) => {
    if (!oldData) return oldData;
    return {
      ...oldData,
      data: {
        ...oldData.data,
        ...updates,
      },
    };
  });
};

// ========================================
// EXPORT CONFIGURED CLIENT
// ========================================
export default queryClient;