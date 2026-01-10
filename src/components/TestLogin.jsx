// import React from 'react'
// import { loginApi } from '../api/auth.api';
// import useAuthStore from '../store/auth.store';

// const TestLogin = () => {
//   const isAuth = useAuthStore((s) => s.isAuthenticated);
//   console.log("isAuth",isAuth)

//   const testLogin = async () => {
//     try {
//       const data = await loginApi({
//         email: "test@test.com",
//         password: "123456",
//       });
//       console.log("🎉 Login success:", data);
//     } catch (error) {
//       console.log("💥 Login failed:", error); //4
//     }
//   };

//   return (
//     <div>
//       <div>testing</div>
//       <div>
//       <button onClick={testLogin}>Test</button>
//       </div>
//     </div>
//   )
// }

// export default TestLogin