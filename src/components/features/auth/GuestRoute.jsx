import { Navigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore";

export const GuestRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  console.log('🚫 GuestRoute START');
  console.log('   isLoading:', isLoading);
  console.log('   isAuthenticated:', isAuthenticated);
  console.log('   user:', user);

  // Optional: wait for auth state
  if (isLoading) {
    console.log('⏳ Auth state loading...');
    return <div>Loading...</div>;
  }

  // Already logged in → redirect
  if (isAuthenticated) {
    console.log('🔁 Already authenticated so redirected to the dashboard');
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Not logged in → show login page
  console.log('✅ Guest access granted');
  return children;
};
