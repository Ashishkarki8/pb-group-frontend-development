import { Navigate, Route } from "react-router-dom";
import useAuthStore from "../../../store/authStore";
import AdminDashboard from "../../../pages/admin-pages/AdminDashboard";


// ========================================
// 🔐 ROLE-BASED PROTECTED ROUTE
// ========================================
// USAGE:
 /*  <Route path="/admin/dashboard" element={
    <RoleProtectedRoute allowedRoles={['super_admin']}>
      <AdminDashboard />
    </RoleProtectedRoute>
  } /> */
// 
// WHAT IT DOES:
// 1. Checks if user is authenticated
// 2. Checks if user has required role
// 3. If NOT allowed → Redirect to appropriate page
// ========================================

function RoleProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuthStore();

  console.log("🔐 RoleProtectedRoute check:", { 
    isAuthenticated, 
    userRole: user?.role,
    allowedRoles 
  });

  // Not authenticated → Go to login
  if (!isAuthenticated) {
    console.log("❌ Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Authenticated but wrong role → Go to their dashboard
  if (!allowedRoles.includes(user?.role)) {
    console.log("❌ Wrong role, redirecting...");
    
    // Redirect based on role
    if (user?.role === 'super_admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  console.log("✅ Correct role, rendering content");
  return children;
}

export default RoleProtectedRoute;