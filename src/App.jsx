//if hydrate is turned on
// 📁 src/App.jsx - Simpler Version
// import { Routes, Route } from 'react-router-dom';
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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from 'react-router-dom';
import { GuestRoute } from './components/features/auth/GuestRoute';
import { ProtectedRoute } from './components/features/auth/ProtectedRoute';
import LoadingFallback from './components/LoadingFallback';
import MainLayout from "./layouts/MainLayout";
import LoginPage from './pages/admin-pages/LoginPage';
import Unauthorized from './pages/admin-pages/Unauthorized';
import useAuthStore from './store/authStore';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin-pages/AdminDashboard';
import AdminRegister from './pages/admin-pages/AdminRegister';
// PUBLIC PAGES (Lazy loaded)
// ========================================
const Home = lazy(() => import("./pages/Home"));
const AllCourses = lazy(() => import("./pages/CoursesPage"));
const AllClientsPartners = lazy(() => import("./pages/ClientsAndPartnersPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const CourseDetailsPage = lazy(() => import("./pages/CourseDetailsPage"));
const ServiceDetailPage = lazy(() => import("./pages/ServiceDetailPage"));
const BlogDetailsPage = lazy(() => import("./pages/BlogDetailsPage"));
const OurWorksPage = lazy(() => import("./pages/OurWorksPage"));
const TeamPage = lazy(() => import("./pages/TeamPage"));
const CareersPage = lazy(() => import("./pages/CareersPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));



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

  const { isAuthenticated, user, isLoading } = useAuthStore();
  console.log('👑 SuperAdminRoute: Checking auth...', { isAuthenticated, user, isLoading });
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
      <LoadingFallback></LoadingFallback>
    );
  }

  // Hydration complete - render app with correct auth state
  return (
    <QueryClientProvider client={queryClient}>
       <Suspense fallback={<LoadingFallback />}>
       
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="courses" element={<AllCourses />} />
            <Route path="clients-partners" element={<AllClientsPartners />} />
            <Route path="blogs" element={<BlogPage />} />
            <Route path="our-works" element={<OurWorksPage />} />
            <Route path="teams" element={<TeamPage />} />
            <Route path="careers" element={<CareersPage />} />

            {/* Detail pages */}
            <Route path="courses/:slug" element={<CourseDetailsPage />} />
            <Route path="blogs/:slug" element={<BlogDetailsPage />} />
            <Route path="services/:slug" element={<ServiceDetailPage />} />
          </Route>
         

          <Route 
            path="/admin/login" 
            element={<GuestRoute><LoginPage /></GuestRoute>} 
          />
            

           <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Shared routes - both admin & superadmin */}
            <Route index element={<Navigate to="/admin/dashboard" replace />} /> {/* ✅ Redirect /admin to /admin/dashboard instead of calling the component */}
            <Route path="dashboard" element={<AdminDashboard />} />

            {/* Superadmin only - NO nested ProtectedRoute needed! */}
            <Route 
              path="create-admin" 
              element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <AdminRegister />
                </ProtectedRoute>
              }
            />
          </Route>


          {/* ERROR ROUTES */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
       </Suspense>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;


