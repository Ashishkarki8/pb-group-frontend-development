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








// so this is correct now if we dont use hydration we are using this
// // ========================================
// 📁 src/App.jsx - CSR APPROACH
// ========================================
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import { Suspense, lazy } from "react";
// import { Navigate, Route, Routes } from 'react-router-dom';
// import { GuestRoute } from './components/features/auth/GuestRoute';
// import { ProtectedRoute } from './components/features/auth/ProtectedRoute';
// import LoadingFallback from './components/LoadingFallback';
// import MainLayout from "./layouts/MainLayout";
// import LoginPage from './pages/admin-pages/LoginPage';
// import Unauthorized from './pages/admin-pages/Unauthorized';
// import useAuthStore from './store/authStore';
// import AdminLayout from './layouts/AdminLayout';
// import AdminDashboard from './pages/admin-pages/AdminDashboard';
// import AdminRegister from './pages/admin-pages/AdminRegister';
// // PUBLIC PAGES (Lazy loaded)
// // ========================================
// const Home = lazy(() => import("./pages/Home"));
// const AllCourses = lazy(() => import("./pages/CoursesPage"));
// const AllClientsPartners = lazy(() => import("./pages/ClientsAndPartnersPage"));
// const BlogPage = lazy(() => import("./pages/BlogPage"));
// const CourseDetailsPage = lazy(() => import("./pages/CourseDetailsPage"));
// const ServiceDetailPage = lazy(() => import("./pages/ServiceDetailPage"));
// const BlogDetailsPage = lazy(() => import("./pages/BlogDetailsPage"));
// const OurWorksPage = lazy(() => import("./pages/OurWorksPage"));
// const TeamPage = lazy(() => import("./pages/TeamPage"));
// const CareersPage = lazy(() => import("./pages/CareersPage"));
// const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));



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

//   const { isAuthenticated, user, isLoading } = useAuthStore();
//   console.log('👑 SuperAdminRoute: Checking auth...', { isAuthenticated, user, isLoading });
 


// 📁 src/App.jsx
// 📁 src/App.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom'; // ✅ Add these imports
import LoadingFallback from './components/LoadingFallback';
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

function App() { // ✅ Remove children prop
  const hasHydrated = useAuthStore((state) => state.hasHydrated); //to retrive one hashydrated data only we call like this
  console.log("app.js hasHydrated",hasHydrated);

  const { isAuthenticated, user, isLoading } = useAuthStore();
   console.log(' Checking store state', { isAuthenticated, user, isLoading, hasHydrated});

  if (!hasHydrated) {
    console.log(" // wait until Zustand loads data from localStorage show spinner")
    return <LoadingFallback />;
  }
  console.log("queryclient",queryClient);
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingFallback />}>
        <Outlet /> {/* ✅ This renders child routes */}
        <ScrollRestoration /> {/* ✅ Add ScrollRestoration here */}
      </Suspense>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
