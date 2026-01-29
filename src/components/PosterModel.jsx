import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useActiveBanner } from '../hooks/useBanners';

const PosterModal = ({ isOpen, onClose }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Fetch active banner - API runs in background, doesn't block UI
  const { data: banner, isLoading, isError } = useActiveBanner();

  // Preload image as soon as data is available
  useEffect(() => {
    if (banner?.imageUrl) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => {
        console.error('Failed to load banner image');
        setImageLoaded(true); // Still set to true to remove loading state
      };
      img.src = banner.imageUrl;
    }
  }, [banner?.imageUrl]);

  // ✅ FAST EXIT: Don't render anything if no banner (no loading spinner!)
  if (isError || (!isLoading && !banner)) {
    return null;
  }

  // ✅ FAST EXIT: Don't show loading modal while fetching
  // This lets the main page render immediately
  if (isLoading || !banner) {
    return null;
  }

  // ✅ Only render modal when we have actual banner data
  return (
    <Modal
      isOpen={isOpen && imageLoaded}
      onClose={onClose}
      maxWidth="max-w-2xl"
      maxHeight="max-h-[90vh]"
      className="p-0 bg-transparent shadow-none"
    >
      <div className="relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-30 p-2 bg-gray-800/80 hover:bg-gray-900 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm"
          aria-label="Close poster"
        >
          <X size={20} className="text-white font-bold stroke-[3]" />
        </button>

        {/* Poster content */}
        {banner?.link ? (
          // Clickable poster with link
          <a
            href={banner.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative group"
            onClick={(e) => {
              // Optional: Track click analytics here
              console.log('Banner clicked:', banner.link);
            }}
          >
            <img
              src={banner.imageUrl}
              alt={banner.altText || "Special Offer"}
              className="w-full h-auto max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              style={{ display: 'block' }}
              loading="eager"
            />
            
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-lg pointer-events-none" />
          </a>
        ) : (
          // Non-clickable poster
          <img
            src={banner.imageUrl}
            alt={banner.altText || "Special Offer"}
            className="w-full h-auto max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            style={{ display: 'block' }}
            loading="eager"
          />
        )}
      </div>
    </Modal>
  );
};

export default PosterModal;

// import { X } from 'lucide-react';
// import Modal from './Modal';

// const PosterModal = ({ isOpen, onClose, posterImage, posterLink, posterAlt = "Special Offer", }) => {
//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       maxWidth="max-w-2xl"
//       maxHeight="max-h-[90vh]"
//       className="p-0 bg-transparent shadow-none"
//     >
//       <div className="relative">
//         {/* Close button */}
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 z-30 p-2 bg-gray-600 hover:bg-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-white"
//           aria-label="Close poster"
//         >
//           <X size={18} className="text-white font-bold stroke-[2]" />
//         </button>

//         {/* Clickable poster image that opens Google Form */}
//         <a
//           href="https://docs.google.com/forms/d/e/1FAIpQLSeDX0dtxDzX-k2FGwV1RCgxT1Qecmm4a4jKbJfI_EPYkTbfaA/viewform?embedded=true" 
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <img
//             src={posterImage}
//             alt={posterAlt}
//             className="w-full h-auto max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl cursor-pointer"
//             style={{ display: 'block' }}
//           />
//         </a>
//       </div>
//     </Modal>
//   );
// };

// export default PosterModal;
