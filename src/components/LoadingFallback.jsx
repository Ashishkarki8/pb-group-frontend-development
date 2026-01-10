import React from 'react'
import { HashLoader } from 'react-spinners'

const LoadingFallback = ({props}) => {
  return (
  //blue circular that rotates
    //   <div className="flex items-center justify-center min-h-screen">
  //   <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-blue-600"></div>
  //   <span>{props}</span>
  // </div>
    
 
  // # type loader
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center">
              <div className="flex justify-center items-center mb-6">
                <HashLoader color="#2563eb" size={60} />
                
              </div>
              <p className="text-gray-700 font-medium text-lg">
                {props===""?"loading":"nodatra"}
              </p>
              {/* <p className="mt-2 text-gray-500 text-sm">
                Preparing content for smooth experience
              </p> */}
            </div>
          </div>
     // Most professional - subtle and clean
/* <ClipLoader color="#2563eb" size={50} />

// Modern and elegant
<RingLoader color="#2563eb" size={60} />

// Minimal and unobtrusive
<PulseLoader color="#2563eb" size={15} />

// Your current (good but slightly busy)
<HashLoader color="#2563eb" size={60} /> */



  )
}

export default LoadingFallback

