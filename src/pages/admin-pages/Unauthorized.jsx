// ========================================
// UNAUTHORIZED PAGE (403)
// ========================================

import { ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
          <ShieldAlert className="w-12 h-12 text-red-600" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>

        {/* Message */}
        <p className="text-lg text-gray-600 mb-8">
          You don't have permission to access this page. <br />
          Only Super Admins can access this feature.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;