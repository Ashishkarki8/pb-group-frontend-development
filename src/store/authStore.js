// ========================================
// 📁 src/store/authStore.js no isHydrate to true
// ========================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(    //meaning save it to the local storage
    (set, get) => ({
      // STATE
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      hasHydrated: false, // ✅ Track hydration completion     Hydration = loading saved Zustand data from localStorage after refresh


      // ACTIONS 
      login: (userData, token) => {
        console.log('🔐 [AuthStore] Login called');
        if (!userData || !token) {
          console.warn('⚠️ [AuthStore] Login called with invalid data');
          return;
        }
        set({
          user: userData,
          accessToken: token,
          isAuthenticated: true,
          isLoading: false,
        });
        console.log('✅ [AuthStore] Login successful');
      },

      updateAccessToken: (token) => {
        console.log('🔄 [AuthStore] Updating access token');
        if (!token) {
          console.warn('⚠️ [AuthStore] No token provided');
          return;
        }
        const user = get().user;
        if (!user) {
          console.warn('⚠️ [AuthStore] No user, skipping token update');
          return;
        }
        set({
          accessToken: token,
          isAuthenticated: true,
        });
        console.log('✅ [AuthStore] Access token updated');
      },

      logout: () => {
        console.log('🚪 [AuthStore] Logging out');
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
        console.log('✅ [AuthStore] Auth state cleared');
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      updateUser: (userData) => {
        console.log('👤 [AuthStore] Updating user data');
        set({ user: userData });
      },
    }),
    {
      name: 'auth-storage',

      // Only persist auth data, not UI state
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),



      onRehydrateStorage: () => {  //jaba refresh garcham page taba yo auto matically chalcha yesley chain latest storage data lincha rah has hydrated lai true banaidincha
        console.log('📦 [AuthStore] Rehydration started');
        return (state) => {
          console.log('📦 [AuthStore] Rehydration');
          console.log("rehydration state",state)
          // Mark hydration complete AFTER it finishes
          if (state) {
            state.hasHydrated = true;
          }
        };
      },
    }
  )
);

export default useAuthStore;


