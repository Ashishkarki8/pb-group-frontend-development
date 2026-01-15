



import axiosInstance from './axiosInstance';




export const adminRegisterApi = async (payload) => {
  console.log("📤 Admin register API called with:", payload);
  const response = await axiosInstance.post("/api/auth/admin/register", payload);
  console.log("📥Admin Register API response:", response.data);
  return response.data;
};







// ========================================
// 🔐 LOGIN API
// ========================================
// WHAT IT DOES:
// 1. Send username/password to backend
// 2. Backend returns: { accessToken, user }
// 3. Backend also sets refresh token in HTTP-only cookie
// ========================================
export const loginApi = async ({username, password}) => {
  console.log('📞 API: Calling login endpoint for:', username);
  console.log("password",password) 
  console.log("username",username) 
  
  try {
    console.log("inside try auth")
    const response = await axiosInstance.post('/api/auth/admin/login', {  //post makes back ja jaha bata aacha tei sabbai print garera aaija
      username,
      password,
    });

    console.log('✅ API: Login successful', response.data.data.user); //userdata
    console.log('✅ API: Login successful this',  response.data.data.accessToken ); //undefined   
   return {
    //yesley acess token rah user data chutayera tanstackcode useAuth ma pathaucha
    user: response.data.data.user,
    accessToken: response.data.data.accessToken,
  };        
    
  } catch (error) {
    console.error('❌ API: Login failed', error.response?.data);
    throw error; // Let React Query handle the error
  }
};

// ========================================
// 🚪 LOGOUT API
// ========================================
// WHAT IT DOES:
// 1. Send logout request to backend (with access token in header)
// 2. Backend clears refresh token from DB and cookie
// ========================================
export const logoutApi = async () => {
  console.log('📞 API: Calling logout endpoint');
  
  try {
    const response = await axiosInstance.post('/api/auth/logout');
    console.log('✅ API: Logout successful', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ API: Logout failed', error.response?.data);
    throw error;
  }
};

// ========================================
// 🔄 REFRESH TOKEN API
// ========================================
// WHAT IT DOES:
// 1. Send refresh token (from cookie) to backend
// 2. Get new access token
// 3. Backend also rotates refresh token (sets new cookie)
// ========================================
// NOTE: This is handled automatically by axiosInstance,
// but you can export it if you need manual refresh
// ========================================
export const refreshTokenApi = async () => {
  console.log('📞 API: Calling refresh endpoint');
  
  try {
    const response = await axiosInstance.post('/api/auth/refresh');
    console.log('✅ API: Token refreshed', response.data);
    return response.data; // { success: true, data: { accessToken } }
    
  } catch (error) {
    console.error('❌ API: Refresh failed', error.response?.data);
    throw error;
  }
};

// ========================================
// 👤 GET CURRENT USER (optional, for session restore)
// ========================================
// WHAT IT DOES:
// If user refreshes page, we need to get user data again
// Call this on app load if access token exists
// ========================================
export const getCurrentUserApi = async () => {
  console.log('📞 API: Getting current user');
  
  try {
    // You need to create this endpoint in your backend
    // GET /api/admin/me → returns current user data
    const response = await axiosInstance.get('/admin/me');
    console.log('✅ API: Got current user', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ API: Failed to get current user', error.response?.data);
    throw error;
  }
};