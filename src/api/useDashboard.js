import { useQuery } from '@tanstack/react-query';

import useAuthStore from '../store/authStore';
import { getAdminDashboardApi, getSuperAdminDashboardApi } from './dashboardApi';

/**
 * Hook for Super Admin Dashboard
 * Uses TanStack Query for client-side caching
 */

// after retriving from db TanStack stores in its memory cache

// Data is marked as FRESH

// ✔ At this moment, data is fresh

export const useSuperAdminDashboard = () => {
  const user = useAuthStore((s) => s.user);
  console.log("inside superAdmin tanstack",user);
  return useQuery({
    queryKey: ['dashboard', 'superAdmin'], // Unique cache key
    queryFn: getSuperAdminDashboardApi,
    
    // ⏱️ TanStack Query cache settings
    staleTime: 1 * 60 * 1000, // 2 minutes - data considered fresh so for to minutes even i refresh url no api call happens component remount no api call route changed back no api call After staleTime, TanStack will refetch

    gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache (formerly cacheTime)
    
    // 🔄 Refetch strategies
    refetchOnWindowFocus: false, // Don't refetch on tab switch
    refetchOnMount: false, // Don't refetch if data exists means even i change the url in stale state the api wont hit if false , and in true if i am in stale and go back to admin dashboard api hits
    refetchOnReconnect: true, // Refetch on internet reconnect
    
    // 🔐 Only run if user is superAdmin
    enabled: user?.role === 'super_admin',
    
    // 📊 Transform data if needed (optional)
    select: (data) => {
      console.log('🔄 [TanStack] Processing Super Admin data...');
      return data.data; // Return only the 'data' property
    },
  });
};
// prefetchQuery is for:

// Data you do not yet need

// But will likely need next

/**
 * Hook for Regular Admin Dashboard
 */
export const useAdminDashboard = () => {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['dashboard', 'admin'], // Different cache key
    queryFn: getAdminDashboardApi,
    
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    
    // 🔐 Only run if user is admin (not superAdmin)
    enabled: user?.role === 'admin',
    
    select: (data) => {
      console.log('🔄 [TanStack] Processing Admin data...');
      return data.data;
    },
  });
};