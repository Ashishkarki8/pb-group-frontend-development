import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans flex items-center justify-center px-2 sm:px-4 lg:px-6 py-1">
      <div className="max-w-lg w-full text-center space-y-3">
        {/* 404 Number with enhanced styling */}
        <div className="space-y-2">
          <div className="relative">
            <h1 className="text-8xl sm:text-9xl lg:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 leading-none drop-shadow-sm">
              404
            </h1>
            <div className="absolute inset-0 text-8xl sm:text-9xl lg:text-[10rem] font-black text-blue-100 -z-10 transform translate-x-1 translate-y-1">
              404
            </div>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full shadow-sm"></div>
        </div>

        {/* Error Message */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
            Oops! Page Not Found
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
            The page you're looking for seems to have wandered off. Let's get you back on track!
          </p>
        </div>

        {/* Action Buttons - Centered */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
          <a
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Home size={18} className="mr-2" />
            Back to Home
          </a>
          
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-white border border-gray-200 text-gray-700 text-base font-semibold rounded-xl hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <ArrowLeft size={18} className="mr-2" />
            Go Back
          </button>
        </div>

        {/* Additional Help */}
        <div className="pt-6">
          <p className="text-sm text-gray-500">
            Still having trouble?{" "}
            <a 
              href="mailto:info@pbgroup.com" 
              className="text-blue-600 hover:text-blue-700 font-medium underline decoration-blue-200 hover:decoration-blue-400 transition-colors duration-200"
            >
              Get in touch
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;