// 📁 src/App.jsx
// ========================================
// 🎯 PURPOSE: Main app component with routing
// ========================================

// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// // Import protected route components
// import { 
//   ProtectedRoute, 
//   SuperAdminRoute, 
//   AdminRoute, 
//   GuestRoute 
// } from './components/features/auth/ProtectedRoute';

// // Import pages


// import LoginPage from './pages/admin-pages/LoginPage';
// import SuperAdminDashboard from './pages/admin-pages/SuperAdminDashboard';
// import { PostsPage,UnauthorizedPage,HomePage } from './pages/PublicPages';
// import AdminDashboard from './pages/admin-pages/AdminDashboard';
// import useAuthStore from './store/authStore';

// // ========================================
// // 🔧 REACT QUERY SETUP
// // ========================================
// // WHAT THIS DOES:
// // - Manages all API requests
// // - Handles caching, refetching, error handling
// // - Provides loading states
// // ========================================
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       // Don't retry on 401 (auth errors)
//       retry: (failureCount, error) => {
//         if (error.response?.status === 401) return false;
//         return failureCount < 2;
//       },
//       // Refetch on window focus
//       refetchOnWindowFocus: false,
//       // Cache time
//       staleTime: 5 * 60 * 1000, // 5 minutes
//     },
//   },
// });

// console.log("queryClient",queryClient)

// function App() {
//   console.log('🚀 App component mounted');
//   const { isAuthenticated, user, isLoading } = useAuthStore();
//   console.log('👤 AdminRoute: Checking auth...', { isAuthenticated, user, isLoading });
//   return (
//     <QueryClientProvider client={queryClient}>

//         <Routes>
//           {/* ========================================
//               🌍 PUBLIC ROUTES (No login required)
//               ========================================
//               - Everyone can access these
//               - Normal users can visit these pages
//           */}
//           <Route path="/" element={<HomePage />} />
//           <Route path="/posts" element={<PostsPage />} />
          
//           {/* ========================================
//               🔐 LOGIN ROUTE (Guest only)
//               ========================================
//               - If already logged in, redirect to dashboard
//           */}
//           <Route path="/admin/login" element={<GuestRoute><LoginPage /></GuestRoute>} />

//           {/* ========================================
//               👤 ADMIN ROUTES (Admin or SuperAdmin)
//               ========================================
//               - Both admin and superadmin can access
//           */}
//           <Route 
//             path="/admin/dashboard" 
//             element={
//               <AdminRoute>
//                 <AdminDashboard />
//               </AdminRoute>
//             } 
//           />

//           {/* ========================================
//               👑 SUPER ADMIN ROUTES (SuperAdmin only)
//               ========================================
//               - Only superadmin can access
//               - Regular admin will be redirected to unauthorized
//           */}
//           <Route 
//             path="/superadmin/dashboard" 
//             element={
//               <SuperAdminRoute>
//                 <SuperAdminDashboard />
//               </SuperAdminRoute>
//             } 
//           />

//           {/* ========================================
//               🚫 UNAUTHORIZED PAGE
//               ========================================
//               - Shown when user tries to access forbidden route
//           */}
//           <Route path="/unauthorized" element={<UnauthorizedPage />} />

//           {/* ========================================
//               404 NOT FOUND
//           */}
//           <Route path="*" element={<div>404 - Page Not Found</div>} />
//         </Routes>

//       {/* React Query DevTools (only in development) */}
//       <ReactQueryDevtools initialIsOpen={false} />
//     </QueryClientProvider>
//   );
// }

// export default App;




//if hydrate is turned on
// 📁 src/App.jsx - Simpler Version
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import { useEffect, useState } from 'react';

// import { 
//   ProtectedRoute, 
//   SuperAdminRoute, 
//   AdminRoute, 
//   GuestRoute 
// } from './components/features/auth/ProtectedRoute';

// import LoginPage from './pages/admin-pages/LoginPage';
// import SuperAdminDashboard from './pages/admin-pages/SuperAdminDashboard';
// import { PostsPage, UnauthorizedPage, HomePage } from './pages/PublicPages';
// import AdminDashboard from './pages/admin-pages/AdminDashboard';
// import useAuthStore from './store/authStore';

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: (failureCount, error) => {
//         if (error.response?.status === 401) return false;
//         return failureCount < 2;
//       },
//       refetchOnWindowFocus: false,
//       staleTime: 5 * 60 * 1000,
//     },
//   },
// });

// function App() {
//   const [isHydrated, setIsHydrated] = useState(false);

//   useEffect(() => {
//     console.log('🔄 [App] Rehydrating auth state...');
    
//     // Manually trigger rehydration
//     useAuthStore.persist.rehydrate();
    
//     // Wait a tick for state to restore
//     setTimeout(() => {
//       setIsHydrated(true);
//       console.log('✅ [App] Hydration complete');
//     }, 0);
//   }, []);

//   // Show loading screen during hydration
//   if (!isHydrated) {
//     return (
//       <div style={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100vh',
//         fontSize: '1.5rem'
//       }}>
//         🔄 Loading...
//       </div>
//     );
//   }

//   return (
//     <QueryClientProvider client={queryClient}>
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/posts" element={<PostsPage />} />
//           <Route path="/admin/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
//           <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
//           <Route path="/superadmin/dashboard" element={<SuperAdminRoute><SuperAdminDashboard /></SuperAdminRoute>} />
//           <Route path="/unauthorized" element={<UnauthorizedPage />} />
//           <Route path="*" element={<div>404 - Page Not Found</div>} />
//         </Routes>
//       <ReactQueryDevtools initialIsOpen={false} />
//     </QueryClientProvider>
//   );
// }

// export default App;








// so this is correct now if we dont use hydration
// // ========================================
// 📁 src/App.jsx - CSR APPROACH
// ========================================
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { 
  ProtectedRoute, 
  SuperAdminRoute, 
  AdminRoute, 
  GuestRoute 
} from './components/features/auth/ProtectedRoute';

import LoginPage from './pages/admin-pages/LoginPage';
import SuperAdminDashboard from './pages/admin-pages/SuperAdminDashboard';
import { PostsPage, UnauthorizedPage, HomePage } from './pages/PublicPages';
import AdminDashboard from './pages/admin-pages/AdminDashboard';
import useAuthStore from './store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error.response?.status === 401) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  // ========================================
  // ✅ SIMPLE CSR APPROACH
  // ========================================
  // In CSR, Zustand hydrates synchronously on store creation
  // We just need to wait for that one-time hydration to complete
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  console.log('🚀 [App] Render, hasHydrated:', hasHydrated);

  // Show loading only until initial hydration completes
  // This is a ONE-TIME check on app startup
  if (!hasHydrated) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5rem',
        background: '#f7fafc'
      }}>
        🔄 Loading...
      </div>
    );
  }

  // Hydration complete - render app with correct auth state
  return (
    <QueryClientProvider client={queryClient}>

        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<HomePage />} />
          <Route path="/posts" element={<PostsPage />} />
          
          {/* LOGIN ROUTE */}
          <Route 
            path="/admin/login" 
            element={<GuestRoute><LoginPage /></GuestRoute>} 
          />

          {/* ADMIN ROUTES */}
          <Route 
            path="/admin/dashboard" 
            element={<AdminRoute><AdminDashboard /></AdminRoute>} 
          />

          {/* SUPER ADMIN ROUTES */}
          <Route 
            path="/superadmin/dashboard" 
            element={<SuperAdminRoute><SuperAdminDashboard /></SuperAdminRoute>} 
          />

          {/* ERROR ROUTES */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>


      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
