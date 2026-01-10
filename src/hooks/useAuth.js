// 📁 src/hooks/useAuth.js
// ========================================
// 🎯 PURPOSE: React Query hooks for authentication
// ========================================
// BENEFITS OF REACT QUERY:
// - Automatic loading/error states
// - Easy error handling
// - Automatic retries
// - Optimistic updates
// ========================================

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { adminRegisterApi, loginApi, logoutApi } from '../api/authApi';
import useAuthStore from '../store/authStore';  //zustand
import toast from 'react-hot-toast';


export const useAdminRegister = () => {
  return useMutation({
    mutationFn: async (payload) => {
      return await adminRegisterApi(payload);
    },

    onSuccess: (data) => {
      toast.success(`User ${data.username} registered successfully`);
     
    },

    onError: (error) => {
      const errorMessage = error?.response?.data?.message;
      toast.error(errorMessage || "Registration failed. Please try again.");
    },
  });
};



export const useLogin = () => {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate(); // ✅ Add navigation
  console.log("inside the tanstackquery");
  return useMutation({
    mutationFn: async (payload) => {
      console.log("🟡 TanStack mutation started",payload);
      return await loginApi(payload); // Returns { user, accessToken }
    },

    onSuccess: (data) => {
      console.log("🟢 TanStack success:", data);
      toast.success(`User ${data.user.username} registered successfully`);
      // ========================================

       login(data.user, data.accessToken);  //1st place that updates the zustand
      console.log("✅ Zustand login called from TanStack");
      
      // ========================================
      // STEP 2: Redirect based on role
      // ========================================
      if (data.user.role === 'super_admin') {
        console.log("🔐 SuperAdmin logged in, redirecting to admin dashboard");
        navigate('/superadmin/dashboard'); // SuperAdmin can see everything
      } else if (data.user.role === 'admin') {
        console.log("👤 Regular admin logged in, redirecting to dashboard");
        navigate('/admin/dashboard'); // Regular admin dashboard
      }
    },

   onError: (error) => {
  const backendMessage = error?.response?.data?.message;

  if (backendMessage) {
    // Expected errors (invalid credentials, etc.)
    toast.error(backendMessage);
  } else {
    // Unexpected / developer errors
    toast.error("Something went wrong. Please try again.");
    console.error("🔴 Unexpected login error:", error);
  }

  console.log("🔴 TanStack error:", error?.response?.data || error.message);
},
  });
};





// ========================================
// 🚪 useLogout Hook
// ========================================
// USAGE IN COMPONENT:
// const { mutate: logout, isPending } = useLogout();
// logout();
// ========================================
export const useLogout = () => {
  const navigate = useNavigate();
  const { logout, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: () => {
      console.log('🚪 useLogout: Starting logout...');
      setLoading(true);
      return logoutApi();
    },

    // ✅ SUCCESS: Clear user data and redirect to login
    onSuccess: () => {
      console.log('✅ useLogout: Logout successful');
      
      // Clear Zustand store (also clears token from axios)
      logout();
      
      // Redirect to login
      console.log('🚀 Redirecting to login page');
      navigate('/admin/login');
    },

    // ❌ ERROR: Even if API fails, clear local data
    onError: (error) => {
      console.error('❌ useLogout: Logout failed, clearing local data anyway', error);
      
      // Still logout user locally
      logout();
      navigate('/admin/login');
    },

    onSettled: () => {
      setLoading(false);
    }
  });
};