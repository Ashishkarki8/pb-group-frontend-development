// 📁 src/components/ProtectedRoute.jsx
// ========================================
// 🎯 PURPOSE: Protect routes based on authentication & role
// ========================================
// 3 TYPES OF ROUTES:
// 1. Public routes → Everyone can access (/, /posts)
// 2. Protected routes → Only authenticated users (/admin/*, /superadmin/*)
// 3. Role-based routes → Only specific roles (/superadmin/* → only superadmin)
// ========================================

import { Navigate } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';


// ========================================
// 🔐 PROTECTED ROUTE (Any authenticated user)
// ========================================
// USAGE:
// <Route path="/admin/dashboard" element={
//   <ProtectedRoute>
//     <AdminDashboard />
//   </ProtectedRoute>
// } />
// ========================================
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  console.log('🛡️ ProtectedRoute: Checking auth...', { isAuthenticated, isLoading });

  // Show loading spinner while checking auth
  if (isLoading) {
    console.log('⏳ ProtectedRoute: Loading...');
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('❌ ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  // Authenticated → show the protected content
  console.log('✅ ProtectedRoute: Authenticated, showing content');
  return children;
};

// ========================================
// 👑 SUPER ADMIN ONLY ROUTE
// ========================================
// USAGE:
// <Route path="/superadmin/dashboard" element={
//   <SuperAdminRoute>
//     <SuperAdminDashboard />
//   </SuperAdminRoute>
// } />
// ========================================
export const SuperAdminRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  console.log('👑 SuperAdminRoute: Checking auth...', { isAuthenticated, user, isLoading });

  // Show loading
  if (isLoading) {
    console.log('⏳ SuperAdminRoute: Loading...');
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!isAuthenticated) {
    console.log('❌ SuperAdminRoute: Not authenticated, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  // Authenticated but not superadmin → redirect to unauthorized page
  if (user?.role !== 'superadmin') {
    console.log('❌ SuperAdminRoute: Not a superadmin, access denied');
    return <Navigate to="/unauthorized" replace />;
  }

  // Is superadmin → show content
  console.log('✅ SuperAdminRoute: Superadmin access granted');
  return children;
};

// ========================================
// 👤 ADMIN ROUTE (Admin or SuperAdmin)
// ========================================
// USAGE:
// <Route path="/admin/posts" element={
//   <AdminRoute>
//     <PostsPage />
//   </AdminRoute>
// } />
// ========================================
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  console.log('👤 AdminRoute: Checking auth...', { isAuthenticated, user, isLoading });

  // Show loading
  if (isLoading) {
    console.log('⏳ AdminRoute: Loading...');
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!isAuthenticated) {
    console.log('❌ AdminRoute: Not authenticated, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  // Authenticated but not admin or superadmin → redirect
  if (user?.role !== 'admin' && user?.role !== 'superadmin') {
    console.log('❌ AdminRoute: Not an admin, access denied');
    return <Navigate to="/unauthorized" replace />;
  }

  // Is admin or superadmin → show content
  console.log('✅ AdminRoute: Admin access granted');
  return children;
};

// ========================================
// 🚫 GUEST ONLY ROUTE (Redirect if already logged in)
// ========================================
// USAGE: For login page - if already logged in, redirect to dashboard
// <Route path="/admin/login" element={
//   <GuestRoute>
//     <LoginPage />
//   </GuestRoute>
// } />
// ========================================
export const GuestRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  console.log('🚫 GuestRoute: Checking auth...', { isAuthenticated, user });

  // If already authenticated, redirect to appropriate dashboard
  if (isAuthenticated) {
    console.log('✅ GuestRoute: Already authenticated, redirecting to dashboard');
    
    if (user?.role === 'superadmin') {
      return <Navigate to="/superadmin/dashboard" replace />;
    } else if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  // Not authenticated → show login page
  console.log('✅ GuestRoute: Not authenticated, showing login');
  return children;
};

















// // ========================================
// // PROTECTED ROUTE COMPONENT
// // Handles authentication and role-based access
// // ========================================

// import { Navigate } from 'react-router-dom';
// import useAuthStore from '../../../store/authStore';
// import { ROUTES } from '../../../utils/constants';

// const ProtectedRoute = ({ children, requireSuperAdmin = false }) => {
//   const { isAuthenticated, isSuperAdmin } = useAuthStore();

//   // ========================================
//   // CASE 1: Not authenticated
//   // ========================================
//   if (!isAuthenticated) {
//     return <Navigate to={ROUTES.LOGIN} replace />;
//   }

//   // ========================================
//   // CASE 2: Super Admin required but user is not
//   // ========================================
//   if (requireSuperAdmin && !isSuperAdmin()) {
//     return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
//   }

//   // ========================================
//   // CASE 3: Authorized - render children
//   // ========================================
//   return children;
// };

// export default ProtectedRoute;