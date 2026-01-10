// import { useMutation } from "@tanstack/react-query";
// import { adminRegisterApi } from "../api/auth.api";
// import toast from "react-hot-toast";

// const useAdminRegister = () => {
//   console.log("inside React query hook")
//   return useMutation({
//     mutationFn: async (payload) => {       //yesley isPneidng lai true banaidincha on default rah yedi mutation called bhayena bhani 
//       console.log("🟡 TanStack mutation started");
//       return await adminRegisterApi (payload);      //1 await  
//     },

//     onSuccess: (data) => {
//         toast.success(`User ${data.username} registered successfully`);
//     },

//     onError: (error) => {
//       console.log("🔴 TanStack error:", error?.response?.data || error.message);
//     },
//   });
// };



// export default useAdminRegister;



import { useMutation } from "@tanstack/react-query";
import { adminRegisterApi } from "../api/auth.api";
import toast from "react-hot-toast";

const useAdminRegister = (reset) => {
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

export default useAdminRegister;
