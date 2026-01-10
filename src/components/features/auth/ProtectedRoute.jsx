import { Navigate } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  console.log('🛡️ ProtectedRoute START');
  console.log('   isLoading:', isLoading);
  console.log('   isAuthenticated:', isAuthenticated);
  console.log('   user:', user);
  console.log('   allowedRoles:', allowedRoles);

  // 1️⃣ Wait until auth state is resolved
  if (isLoading) {
    console.log('⏳ Auth state loading...');
    return <div>Loading...</div>;
  }

  // 2️⃣ Not logged in → send to login
  if (!isAuthenticated) {
    console.log('❌ Not authenticated → redirect to /admin/login');
    return <Navigate to="/admin/login" replace />;
  }

  // 3️⃣ Logged in but role not allowed
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user?.role)
  ) {
    console.log('🚫 Role not allowed:', user?.role);
    console.log('➡️ Redirecting to /unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }

  // 4️⃣ Everything OK
  console.log('✅ Access granted');
  return children;
};




// protected route chain hami admin urls haru lai encrpt garera use garcham



