// import axios from 'axios';


// // ========================================
// // CREATE AXIOS INSTANCE
// // ========================================
// const api = axios.create({
//   baseURL:import.meta.env.VITE_API_URL || 'http://localhost:9000' ,
//   timeout: 30000, // 30 seconds
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true, // ✅ CRITICAL: Send cookies with every request
// });

// // REQUEST INTERCEPTOR
// // ==============================
// api.interceptors.request.use((config) => {
//     console.log("➡️ Axios Request:", {     //1
//       url: config.url,
//       method: config.method,
//       headers: config.headers,
//     });

//     // Later we will get token from Zustand
//     const token = localStorage.getItem("accessToken"); // TEMP (for learning)
//     console.log("token",token)
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//       console.log("🔐 Token attached to request");
//     }

//     return config;
//   },
//   (error) => {   
//     console.log("❌ Request Error:", error);
//     return Promise.reject(error);
//   }
// );

// // ==============================
// // RESPONSE INTERCEPTOR
// // ==============================
// api.interceptors.response.use(      //2
//   (response) => {
//       console.log("✅ Axios Response:", {
//       url: response.config.url,
//       status: response.status,
//       data: response.data,  //first data yeta aaucha reponsema
//     });

//     return response;
//   },
//   (error) => {
//     console.log("🚨 Axios Response Error:", {  //3
//       url: error.config?.url,
//       status: error.response?.status,
//       message: error.message,
//     });

//     // Example: unauthorized
//     if (error.response?.status === 401) {
//       console.log("⚠️ Unauthorized - token invalid or expired");
//       // later: logout user via Zustand
//     }

//     return Promise.reject(error);    //jaha bata call bhathyo tei return huncha test ma
//   }
// );

// export default api;






import axios from 'axios';
import useAuthStore from '../store/authStore';

// ========================================
// CREATE AXIOS INSTANCE
// ========================================
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:9000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ REQUIRED for refresh token cookie
});

// ========================================
// REFRESH CONTROL VARIABLES
// ========================================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  console.log('📦 Processing failed queue. Token:', token);

  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
};

// ========================================
// REQUEST INTERCEPTOR
// ========================================
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('➡️ Axios Request:', {
      url: config.url,
      method: config.method,
       data: config.data,        // ✅ payload (e.g. login form data)
      params: config.params,    // ✅ query params if any
      headers: config.headers,  // optional
    });

    const token = useAuthStore.getState().accessToken;

    if (token) {  //yesley harek request lai token cha bhaney request mah tasdai pathaucha
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Access token attached');
    } else {
      console.log('⚠️ No access token found');
    }

    return config;
  },
  (error) => Promise.reject(error)
);




// axiosInstance.interceptors.response.use(
//   (response) => {
//     console.log('✅ Axios Response:', {
//       url: response.config.url,
//       status: response.status,
//       data: response.data,
//     });

//     return response;
//   },

//   async (error) => {
//     const originalRequest = error.config;

//     console.log('❌ Axios Error:', {
//       url: originalRequest?.url,
//       status: error.response?.status,
//     });

//     const isAuthEndpoint =
//       originalRequest.url.includes('/login') ||
//       originalRequest.url.includes('/register') ||
//       originalRequest.url.includes('/refresh');

//     // ===============================
//     // ACCESS TOKEN EXPIRED (PROTECTED ROUTES ONLY)
//     // ===============================
//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !isAuthEndpoint
//     ) {
//       console.log('🔒 Access token expired (protected route)');

//       originalRequest._retry = true;

//       // --------------------------------
//       // QUEUE REQUESTS IF REFRESH RUNNING
//       // --------------------------------
//       if (isRefreshing) {
//         console.log('⏳ Refresh already running → queue request');

//         return new Promise((resolve, reject) => {
//           failedQueue.push({
//             resolve: (token) => {
//               originalRequest.headers.Authorization = `Bearer ${token}`;
//               resolve(axiosInstance(originalRequest));
//             },
//             reject,
//           });
//         });
//       }

//       isRefreshing = true;

//       try {
//         console.log('🔄 Calling /refresh endpoint');

//         const response = await axiosInstance.post('/api/auth/refresh');

//         const newAccessToken = response.data.data.accessToken;

//         console.log('✅ New access token received:', newAccessToken);

//         useAuthStore.getState().updateAccessToken(newAccessToken);

//         processQueue(null, newAccessToken);

//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return axiosInstance(originalRequest);

//       } catch (refreshError) {
//         console.log('❌ Refresh token expired or invalid');

//         processQueue(refreshError, null);
//         useAuthStore.getState().logout();

//         window.location.href = '/login';
//         return Promise.reject(refreshError);

//       } finally {
//         isRefreshing = false;
//         console.log('🔚 Refresh flow finished');
//       }
//     }

//     // IMPORTANT: Let login errors pass through
//     return Promise.reject(error);
//   }
// );
// ========================================
// RESPONSE INTERCEPTOR
// ========================================
// axiosInstance.interceptors.response.use(
//   (response) => {
//     console.log('✅ Axios Response:', {
//       url: response.config.url,
//       status: response.status,
//       data: response.data,
//     });

//     return response;
//   },

//   async (error) => {
//     const originalRequest = error.config;

//     console.log('❌ Axios Error:', {
//       url: originalRequest?.url,
//       status: error.response?.status,
//     });

//     // ========================================
//     // ✅ FIXED: Check if this is a protected route
//     // ========================================
//     const isProtectedRoute = originalRequest?.url?.startsWith('/api/admin');
    
//     console.log('🔍 Is Protected Route?', isProtectedRoute);
//     console.log('🔍 URL:', originalRequest?.url);

//     // ========================================
//     // ACCESS TOKEN EXPIRED (PROTECTED ROUTES ONLY)
//     // ========================================
//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       isProtectedRoute  // ✅ Only refresh for /api/admin/* routes
//     ) {
//       console.log('🔒 Access token expired (protected route)');

//       originalRequest._retry = true;

//       // --------------------------------
//       // QUEUE REQUESTS IF REFRESH RUNNING
//       // --------------------------------
//       if (isRefreshing) {
//         console.log('⏳ Refresh already running → queue request');

//         return new Promise((resolve, reject) => {
//           failedQueue.push({
//             resolve: (token) => {
//               originalRequest.headers.Authorization = `Bearer ${token}`;
//               resolve(axiosInstance(originalRequest));
//             },
//             reject,
//           });
//         });
//       }

//       isRefreshing = true;

//       try {
//         console.log('🔄 Calling /refresh endpoint');

//         const response = await axiosInstance.post('/api/auth/refresh');

//         const newAccessToken = response.data.data.accessToken;

//         console.log('✅ New access token received:', newAccessToken);

//         useAuthStore.getState().updateAccessToken(newAccessToken);

//         processQueue(null, newAccessToken);

//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return axiosInstance(originalRequest);

//       } catch (refreshError) {
//         console.log('❌ Refresh token expired or invalid');

//         processQueue(refreshError, null);
//         useAuthStore.getState().logout();

//         window.location.href = '/admin/login';
//         return Promise.reject(refreshError);

//       } finally {
//         isRefreshing = false;
//         console.log('🔚 Refresh flow finished');
//       }
//     }

//     // ========================================
//     // IMPORTANT: Let other errors pass through
//     // (login errors, validation errors, etc.)
//     // ========================================
//     return Promise.reject(error);
//   }
// );
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Axios Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });

    return response;
  },
  
  //yedi reponse ma 401 unauthorised token related error reponse ma aayo bhaney aba refresh token call gar hai bhancha
  async (error) => {
    const originalRequest = error.config;

    console.log('❌ Axios Error:', {
      url: originalRequest?.url,
      status: error.response?.status,
    });

    // ========================================
    // ✅ FIXED: Exclude only login and refresh endpoints means 
    // ========================================
    const isLoginEndpoint = originalRequest?.url === '/api/auth/admin/login';
    const isRefreshEndpoint = originalRequest?.url === '/api/auth/refresh';
    
    const shouldRefresh = !isLoginEndpoint && !isRefreshEndpoint;
    
    console.log('🔍 URL:', originalRequest?.url);
    console.log('🔍 Is Login?', isLoginEndpoint);
    console.log('🔍 Is Refresh?', isRefreshEndpoint);
    console.log('🔍 Should Refresh?', shouldRefresh);

    // ========================================
    // ACCESS TOKEN EXPIRED (ALL ROUTES EXCEPT LOGIN/REFRESH)
    // ========================================
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      shouldRefresh  // ✅ Refresh for everything except login/refresh
    ) {
      console.log('🔒 Access token expired (protected route)');
      
      originalRequest._retry = true;

      // --------------------------------
      // QUEUE REQUESTS IF REFRESH RUNNING
      // --------------------------------
      if (isRefreshing) {  // “Pause this second request. Don’t fail it. Wait until the first refresh finishes.”
        console.log('⏳ Refresh already running → queue request');
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        console.log('🔄 Calling /refresh endpoint');

        const response = await axiosInstance.post('/api/auth/refresh');

        const newAccessToken = response.data.data.accessToken;

        console.log('✅ New access token received:', newAccessToken);

        useAuthStore.getState().updateAccessToken(newAccessToken);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        console.log('❌ Refresh token expired or invalid');

        processQueue(refreshError, null);
        useAuthStore.getState().logout();

        window.location.href = '/admin/login';
        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
        console.log('🔚 Refresh flow finished');
      }
    }

    // ========================================
    // IMPORTANT: Let other errors pass through
    // (login errors, validation errors, etc.)
    // ========================================
    return Promise.reject(error);
  }
);



export default axiosInstance;
