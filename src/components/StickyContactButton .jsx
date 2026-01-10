import { Phone } from 'lucide-react';
import { useState, useEffect } from 'react';

const StickyContactButton = () => {
  const phoneNumber = "9802351303"; // Change to your actual number
  const phoneLink = "tel:+977 980-2351303"; // Remove spaces and dashes for tel: link
  
  const [isScrolling, setIsScrolling] = useState(false);
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    let scrollTimer = null;

    const handleScroll = () => {
      // User is scrolling - hide contact button
      setIsScrolling(true);
      setShowButton(false);

      // Clear previous timer
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }

      // After 1.5 seconds of no scrolling, show contact button again
      scrollTimer = setTimeout(() => {
        setIsScrolling(false);
        setShowButton(true);
      }, 1500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
    };
  }, []);

  return (
    <a
      href={phoneLink}
      className={`fixed bottom-8 left-6 z-40 flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 will-change-transform ${
        showButton && !isScrolling
          ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
          : 'opacity-0 translate-y-4 pointer-events-none scale-90'
      }`}
      aria-label="Call us"
    >
      {/* Phone Icon with shake animation */}
      <Phone 
        className="w-5 h-5 animate-[shake_2s_ease-in-out_infinite]" 
        strokeWidth={2.5}
      />
      
      {/* Phone Number */}
      <span className="font-semibold text-sm tracking-wide">
        {phoneNumber}
      </span>

      <style >{`
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          10%, 30% { transform: rotate(-12deg); }
          20%, 40% { transform: rotate(12deg); }
          50% { transform: rotate(0deg); }
        }
      `}</style>
    </a>
  );
};

export default StickyContactButton;