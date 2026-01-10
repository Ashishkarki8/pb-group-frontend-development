import React from 'react'

const LoadingFallback = ({props}) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-blue-600"></div>
    <span>{props}</span>
  </div>
  )
}

export default LoadingFallback
