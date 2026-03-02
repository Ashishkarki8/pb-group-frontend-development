import { getIconComponent } from "../utils/iconMapping";
import { memo, useRef } from "react";
import { Link } from "react-router-dom";
import { usePrefetchService } from "../hooks/useService";

// ==============================
// Color Pattern Function
// ==============================
const getGradientByIndex = (index) => {
  const patterns = [
    "from-blue-600 to-blue-800",
    "from-sky-400 to-sky-800",
    "from-blue-400 to-blue-800",
  ];
  return patterns[index % patterns.length];
};

// ==============================
// Text Formatter
// ==============================
const formatTextWithLineBreaks = (text) => {
  if (!text) return null;
  return text.split(/\r\n|\n/).map((line, index, arr) => (
    <span key={index}>
      {line}
      {index < arr.length - 1 && <br />}
    </span>
  ));
};

// ==============================
// Service Card with Hover Prefetch
// ==============================
const ServiceCard = memo(({ service, index, observeElement, isVisible }) => {
  const IconComponent = getIconComponent(service.iconName);
  const prefetchService = usePrefetchService();
  const hoverTimerRef = useRef(null);

  // ✅ Hover Prefetch: Trigger after 3 seconds
  const handleMouseEnter = () => {
    hoverTimerRef.current = setTimeout(() => {
      console.log(`🔄 Prefetching service: ${service.slug}`);
      prefetchService(service.slug);
    }, 3000); // 3 seconds delay
  };

  // ✅ Clear timer if user leaves before 3 seconds
  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  return (
    <Link
      to={`/services/${service.slug}`}
      className="h-full group"
      ref={(el) => observeElement(el, `service-card-${index}`)}
      aria-label={`Learn more about ${service.title}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`relative overflow-hidden rounded-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl h-full flex flex-col will-change-transform opacity-0 ${
          isVisible(`service-card-${index}`) ? "animate-fade-up" : ""
        }`}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${getGradientByIndex(index)} opacity-90`}
        />

        <div className="relative p-8 text-white flex flex-col flex-grow z-10">
          <div className="mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm transition-colors duration-300 group-hover:bg-white/30">
              <IconComponent size={32} className="text-white" />
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-4">
            {service.title}
          </h3>

          <div className="text-white/90 leading-relaxed flex-grow text-justify">
            {formatTextWithLineBreaks(service.cardDescription)}
          </div>
        </div>
      </div>
    </Link>
  );
});

ServiceCard.displayName = "ServiceCard";

export default ServiceCard;