/**
 * Global animation styles for scroll-based animations
 * Include this component once in your layout or main component
 */
const AnimationStyles = () => {
  return (
    <style>{`
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeInLeft {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes fadeInRight {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .animate-fade-up {
        animation: fadeInUp 0.4s ease-out forwards;
      }

      .animate-fade-left {
        animation: fadeInLeft 0.4s ease-out forwards;
      }

      .animate-fade-right {
        animation: fadeInRight 0.4s ease-out forwards;
      }

      .animate-scale-in {
        animation: scaleIn 0.4s ease-out forwards;
      }

      .animate-delay-100 {
        animation-delay: 0.05s;
      }
      .animate-delay-200 {
        animation-delay: 0.1s;
      }
      .animate-delay-300 {
        animation-delay: 0.15s;
      }
      .animate-delay-400 {
        animation-delay: 0.2s;
      }
      .animate-delay-500 {
        animation-delay: 0.25s;
      }

      .opacity-0 {
        opacity: 0;
      }
    `}</style>
  );
};

export default AnimationStyles;