import { Mail, Phone } from "lucide-react";

/**
 * Reusable Contact Sidebar Card
 * @param {Object} props
 * @param {string} props.title - Main heading
 * @param {string} props.description - Descriptive text
 * @param {string} props.buttonText - CTA button text
 * @param {Function} props.onButtonClick - Button click handler
 * @param {string} props.phone - Phone number
 * @param {string} props.email - Email address
 * @param {string} props.gradientClasses - Tailwind gradient classes
 */
const ContactSidebar = ({
  title = "Ready to Get Started?",
  description,
  buttonText = "Schedule Consultation",
  onButtonClick,
  phone = "980-2351303",
  email = "info@pbg.com.np",
  gradientClasses = "from-blue-600 to-blue-800",
}) => {
  return (
    <div
      className={`bg-gradient-to-br ${gradientClasses} rounded-2xl p-5 md:p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300`}
    >
      <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">{title}</h3>
      <p className="text-blue-100 mb-4 md:mb-6 text-sm md:text-base leading-relaxed">
        {description}
      </p>
      <div className="space-y-3 mb-4 md:mb-6">
        {phone && (
          <div className="flex items-center space-x-3">
            <Phone size={14} className="md:w-4 md:h-4 flex-shrink-0" />
            <span className="text-xs md:text-sm">{phone}</span>
          </div>
        )}
        {email && (
          <div className="flex items-center space-x-3">
            <Mail size={14} className="md:w-4 md:h-4 flex-shrink-0" />
            <span className="text-xs md:text-sm">{email}</span>
          </div>
        )}
      </div>

      <button
        onClick={onButtonClick}
        className="w-full px-4 md:px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-100 transition-colors text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
        aria-label={buttonText}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default ContactSidebar;