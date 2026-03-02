import { CheckCircle2 } from "lucide-react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { addInternalLinks } from "../../utils/linkUtils";

/**
 * Reusable Feature List Component
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {Array} props.features - Array of feature strings or {title, desc, icon} objects
 * @param {string} props.variant - 'simple' | 'detailed'
 * @param {Array} props.internalLinks - Links for automatic keyword linking
 * @param {string} props.bgClasses - Background classes
 */
const FeatureList = ({
  title = "Key Features",
  features = [],
  variant = "simple",
  internalLinks = [],
  bgClasses = "bg-gradient-to-br from-blue-50 to-indigo-50",
}) => {
  const { observeElement, isVisible } = useScrollAnimation();

  if (!features.length) return null;

  // Simple variant - just strings with checkmarks
  if (variant === "simple") {
    return (
      <div
        className={`mt-8 ${bgClasses} rounded-xl p-6 md:p-8 border border-blue-100`}
      >
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          {title}
        </h3>
        <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => observeElement(el, `feature-simple-${index}`)}
              className={`flex items-start space-x-3 opacity-0 ${
                isVisible(`feature-simple-${index}`)
                  ? `animate-fade-up animate-delay-${Math.min(
                      (index + 1) * 100,
                      500
                    )}`
                  : ""
              }`}
            >
              <CheckCircle2
                size={20}
                className="text-blue-600 flex-shrink-0 mt-0.5 md:w-5 md:h-5"
              />
              <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                {typeof feature === "string" ? feature : feature.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Detailed variant - with icons and descriptions
  return (
    <section
      ref={(el) => observeElement(el, "features-detailed")}
      className={`space-y-6 md:space-y-8 opacity-0 ${
        isVisible("features-detailed") ? "animate-fade-up animate-delay-200" : ""
      }`}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
      <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
        {features.map((item, index) => (
          <div
            key={index}
            ref={(el) => observeElement(el, `feature-detailed-${index}`)}
            className={`flex space-x-4 p-4 md:p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300 opacity-0 ${
              isVisible(`feature-detailed-${index}`)
                ? `animate-scale-in animate-delay-${(index + 1) * 100}`
                : ""
            }`}
          >
            {item.icon && (
              <div className="flex-shrink-0">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <item.icon size={20} className="text-blue-600 md:w-6 md:h-6" />
                </div>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                {item.title}
              </h3>
              <p
                className="text-gray-600 text-xs md:text-sm leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: addInternalLinks(item.desc, internalLinks),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureList;