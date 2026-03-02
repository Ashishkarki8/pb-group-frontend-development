import { useScrollAnimation } from "../../hooks/useScrollAnimation";

/**
 * Reusable Hero Section Component
 * @param {Object} props
 * @param {string} props.title - Main heading
 * @param {string} props.subtitle - Subheading/description
 * @param {string} props.gradientClasses - Tailwind gradient classes
 * @param {Component} props.icon - Icon component
 * @param {string} props.badge - Badge text (e.g., "Professional Service")
 * @param {string} props.image - Hero image URL
 * @param {string} props.imageAlt - Image alt text
 * @param {number} props.imageWidth - Image width
 * @param {number} props.imageHeight - Image height
 * @param {ReactNode} props.actions - CTA buttons/actions
 * @param {ReactNode} props.additionalInfo - Additional info (e.g., location)
 */
const HeroSection = ({
  title,
  subtitle,
  gradientClasses = "from-blue-600 to-purple-600",
  icon: IconComponent,
  badge = "Professional Service",
  image,
  imageAlt,
  imageWidth = 600,
  imageHeight = 400,
  actions,
  additionalInfo,
}) => {
  const { observeElement, isVisible } = useScrollAnimation();

  return (
    <section
      className={`relative py-8 md:py-12 bg-gradient-to-br ${gradientClasses} text-white overflow-hidden`}
    >
      <div className="absolute inset-0 bg-black/20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div
            ref={(el) => observeElement(el, "hero-content")}
            className={`space-y-6 opacity-0 ${
              isVisible("hero-content") ? "animate-fade-left" : ""
            }`}
          >
            {/* Icon & Badge */}
            <div className="flex items-center space-x-4">
              {IconComponent && (
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <IconComponent
                    size={28}
                    className="text-white md:w-8 md:h-8"
                  />
                </div>
              )}
              <div className="text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                {badge}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl">
              {subtitle}
            </p>

            {/* Additional Info (e.g., location) */}
            {additionalInfo && <div className="mt-2">{additionalInfo}</div>}

            {/* Actions/CTAs */}
            {actions && (
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                {actions}
              </div>
            )}
          </div>

          {/* Image */}
          {image && (
            <div
              ref={(el) => observeElement(el, "hero-image")}
              className={`relative opacity-0 ${
                isVisible("hero-image")
                  ? "animate-fade-right animate-delay-200"
                  : ""
              }`}
            >
              <img
                loading="lazy"
                src={image}
                alt={imageAlt || title}
                width={imageWidth}
                height={imageHeight}
                className="rounded-2xl shadow-2xl w-full h-64 md:h-80 lg:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl" />
            </div>
          )}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-white/5 rounded-full -translate-y-16 md:-translate-y-32 translate-x-16 md:translate-x-32" />
      <div className="absolute bottom-0 left-0 w-24 h-24 md:w-48 md:h-48 bg-white/5 rounded-full translate-y-12 md:translate-y-24 -translate-x-12 md:-translate-x-24" />
    </section>
  );
};

export default HeroSection;