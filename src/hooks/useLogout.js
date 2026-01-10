import { useMutation } from "@tanstack/react-query";
import { logoutApi } from "../api/authApi";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";

// ========================================
// 🚪 LOGOUT HOOK
// ========================================
// WHAT IT DOES:
// 1. Calls logout API (clears refresh token from DB + cookie)
// 2. Clears Zustand state
// 3. Redirects to login page
// ========================================

const useLogout = () => {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      console.log("🚪 TanStack logout mutation started");
      return await logoutApi();
    },

    onSuccess: (data) => {
      console.log("✅ Logout API successful:", data);

      // Clear Zustand state
      logout();
      console.log("✅ Zustand state cleared");

      // Redirect to login
      navigate("/login", { replace: true });
      console.log("✅ Redirected to login");
    },

    onError: (error) => {
      console.log("❌ Logout error:", error?.response?.data || error.message);

      // Even if API fails, clear local state
      logout();
      navigate("/login", { replace: true });
      
      console.log("⚠️ Logged out locally despite API error");
    },
  });
};

export default useLogout;