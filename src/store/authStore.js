




// updated
// store/authStore.js with hydrated used
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// const useAuthStore = create(
//   persist(    //to save to the local storage
//     (set, get) => ({
//       // ========================================
//       // 📊 STATE
//       // ========================================
//       user: null,               // { userId, username, role }
//       accessToken: null,        // JWT access token (validated via refresh)
//       isAuthenticated: false,
//       isLoading: false,

//       // ========================================
//       // 🔐 LOGIN ACTION
//       // ========================================
//       login: (userData, token) => {
//         console.log('🔐 [AuthStore] Login called');
//         console.log('👤 User:', userData);
//         console.log('🔑 Token:', token); 

//         if (!userData || !token) {
//           console.warn('⚠️ [AuthStore] Login called with invalid data');
//           return;
//         }

//         set({
//           user: userData,
//           accessToken: token,
//           isAuthenticated: true,
//           isLoading: false,
//         });

//         console.log('✅ [AuthStore] Login successful — state updated');
//       },

//       // ========================================
//       // 🔁 UPDATE ACCESS TOKEN (REFRESH FLOW)
//       // ========================================
//      updateAccessToken: (token) => {
//   console.log('🔄 [AuthStore] Updating access token');

//   if (!token) {
//     console.warn('⚠️ [AuthStore] updateAccessToken called without token');
//     return;
//   }

//   const user = get().user;

//   if (!user) {
//     console.warn(
//       '⚠️ [AuthStore] Access token received but user is null. Skipping auth update.'
//     );
//     return;
//   }

//   set({
//     accessToken: token,
//     isAuthenticated: true,
//   });

//   console.log('✅ [AuthStore] Access token updated');
// },

//       // ========================================
//       // 🚪 LOGOUT ACTION
//       // ========================================
//       logout: () => {
//         console.log('🚪 [AuthStore] Logging out user');

//         set({
//           user: null,
//           accessToken: null,
//           isAuthenticated: false,
//           isLoading: false,
//         });

//         console.log('✅ [AuthStore] Auth state cleared');
//       },

//       // ========================================
//       // ⏳ LOADING STATE
//       // ========================================
//       setLoading: (loading) => {
//         console.log('⏳ [AuthStore] setLoading:', loading);
//         set({ isLoading: loading });
//       },

//       // ========================================
//       // 👤 UPDATE USER
//       // ========================================
//       updateUser: (userData) => {
//         console.log('👤 [AuthStore] Updating user data:', userData);
//         set({ user: userData });
//       },
//     }),
//     {
//       name: 'auth-storage',

//       // Persist ONLY safe state
//       partialize: (state) => ({
//         user: state.user,
//         accessToken: state.accessToken,
//         isAuthenticated: state.isAuthenticated,
//       }),

//       // Prevent UI flicker during hydration
//       skipHydration: true,

//       onRehydrateStorage: () => { //refresh garda yo chalcha rah suru bata app.jsx chalcha
//         console.log('📦 [AuthStore] Rehydration started');
//         return (state) => {
//           console.log('📦 [AuthStore] Rehydration finished:', state);
//         };
//       },
//     }
//   )
// );

// export default useAuthStore;



// ========================================
// 📁 src/store/authStore.js no isHydrate to true
// ========================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // STATE
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      hasHydrated: false, // ✅ Track hydration completion

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

      // ✅ NO skipHydration for CSR apps
      // Hydration happens synchronously before first render

      // ✅ Mark hydration as complete
      onRehydrateStorage: () => {
        console.log('📦 [AuthStore] Rehydration started');
        return (state) => {
          console.log('📦 [AuthStore] Rehydration finished');
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








// 1️⃣ Do you need useEffect in App.jsx?
// ❌ No — and using it would actually be worse.

// Why?

// Because in your setup:

// You are NOT:

// Manually calling rehydrate()

// Running async auth bootstrap logic

// Refreshing tokens on startup

// You ARE:

// Letting Zustand persist hydrate automatically

// Using onRehydrateStorage as the lifecycle signal

// That means there is nothing imperative to run in App.jsx.

// useEffect is for:

// Side effects

// Imperative logic

// Async orchestration

// You are doing pure declarative state gating, so useEffect would be unnecessary noise.