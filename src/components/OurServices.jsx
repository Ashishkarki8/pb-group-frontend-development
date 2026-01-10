import { Link } from 'react-router-dom';
import { memo, useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { services } from '../data/services';

// Custom hook for scroll animations
const useScrollAnimation = () => {
  const [visibleElements, setVisibleElements] = useState(new Set());
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set(prev).add(entry.target.dataset.animateId));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const observeElement = useCallback((element, id) => {
    if (element && observerRef.current) {
      element.dataset.animateId = id;
      observerRef.current.observe(element);
    }
  }, []);

  const isVisible = useCallback((id) => visibleElements.has(id), [visibleElements]);

  return { observeElement, isVisible };
};

// Memoized service card component to prevent unnecessary re-renders
const ServiceCard = memo(({ service, observeElement, isVisible, index }) => {
  const IconComponent = service.icon;

  return (
    <>
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
        
        .animate-scale-in {
          animation: scaleIn 0.4s ease-out forwards;
        }
        
        .animate-delay-100 { animation-delay: 0.05s; }
        .animate-delay-200 { animation-delay: 0.1s; }
        .animate-delay-300 { animation-delay: 0.15s; }
        .animate-delay-400 { animation-delay: 0.2s; }
        .animate-delay-500 { animation-delay: 0.25s; }
        .animate-delay-600 { animation-delay: 0.3s; }
        
        .opacity-0 { opacity: 0; }
      `}</style>

      <Link 
        to={`/services/${service.slug}`}
        className="h-full group"
        aria-label={`Learn more about ${service.title}`}
        ref={(el) => observeElement(el, `service-card-${index}`)}
      >
        <div className={`group relative overflow-hidden rounded-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl h-full flex flex-col will-change-transform opacity-0 ${
          isVisible(`service-card-${index}`) ? `animate-scale-in animate-delay-${(index + 1) * 100}` : ''
        }`}>
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-90`} />
          
          {/* Content */}
          <div className="relative p-8 text-white flex flex-col flex-grow z-10">
            {/* Icon Container */}
            <div className="mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm transition-colors duration-300 group-hover:bg-white/30">
                <IconComponent size={32} className="text-white" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors duration-300">
              {service.title}
            </h3>

            {/* Description */}
            <p className="text-white/90 leading-relaxed flex-grow group-hover:text-white/95 transition-colors duration-300">
              {service.shortDescription}
            </p>
          </div>

          {/* Optimized Decorative Elements with will-change for better performance */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700 will-change-transform" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12 group-hover:scale-125 transition-transform duration-500 will-change-transform" />
        </div>
      </Link>
    </>
  );
});

ServiceCard.displayName = 'ServiceCard';

const OurServices = () => {
  const { observeElement, isVisible } = useScrollAnimation();

  // Memoize service cards with animation props
  const serviceCards = useMemo(
    () => services.map((service, index) => (
      <ServiceCard 
        key={service.id} 
        service={service} 
        observeElement={observeElement}
        isVisible={isVisible}
        index={index}
      />
    )),
    [observeElement, isVisible] // Add dependencies for animation
  );

  return (
    <>
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
        
        .animate-fade-up {
          animation: fadeInUp 0.4s ease-out forwards;
        }
        
        .animate-delay-100 { animation-delay: 0.05s; }
        .animate-delay-200 { animation-delay: 0.1s; }
        
        .opacity-0 { opacity: 0; }
      `}</style>

      <section className="py-10 lg:py-14 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header - Added semantic HTML and animations */}
          <header 
            ref={(el) => observeElement(el, 'section-header')}
            className={`text-start mb-8 opacity-0 ${isVisible('section-header') ? 'animate-fade-up' : ''}`}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 lg:mb-10">
              What We Do
            </h2>
            <p className="text-xl text-center lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Company offers innovative services that help businesses and communities harness the power of information for sustainable growth and development.
            </p>
          </header>

          {/* Services Grid - Now using memoized cards with animations */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {serviceCards}
          </div>

          {/* Bottom Description - Added semantic HTML and animation */}
          <footer 
            ref={(el) => observeElement(el, 'section-footer')}
            className={`text-center mt-10 lg:mt-16 opacity-0 ${
              isVisible('section-footer') ? 'animate-fade-up animate-delay-100' : ''
            }`}
          >
            <p className="text-xl text-gray-700 max-w-5xl mx-auto leading-relaxed">
              Provide high-quality, data-driven consultancy in research, analytics, and IT, fostering business success and community development
            </p>
          </footer>
        </div>
      </section>
    </>
  );
};

export default OurServices;