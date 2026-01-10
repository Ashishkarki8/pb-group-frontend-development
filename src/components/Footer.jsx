import { ChevronUp, Mail, MapPin, Phone } from "lucide-react";
import { useState, useEffect, useCallback, memo } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";

// Memoized Social Link Component
const SocialLink = memo(({ icon: Icon, href, label, color }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`${color} transition-transform duration-200 ease-out p-2 rounded-full hover:scale-105 will-change-transform`}
    aria-label={label}
  >
    <Icon size={20} />
  </a>
));

// Memoized Service Link Component
const ServiceLink = memo(({ name, href }) => (
  <li>
    <a
      href={href}
      className="text-gray-300 hover:text-white transition-colors duration-150 ease-out text-sm py-1 inline-block"
    >
      {name}
    </a>
  </li>
));

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setShowScrollTop(scrollTop > 300);
  }, []);

  // Throttled scroll listener
  useEffect(() => {
    let timeoutId;
    const throttledHandleScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        handleScroll();
        timeoutId = null;
      }, 100);
    };

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });

    // Check initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [handleScroll]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Static data - moved outside component to prevent recreation
  const socialLinks = [
    {
      icon: FaFacebookF,
      href: "https://www.facebook.com/PBGroupIT/",
      label: "Facebook",
      color: "text-[#1877F2]",
    },
    {
      icon: FaTwitter,
      href: "https://www.twitter.com/pbITgroup",
      label: "Twitter",
      color: "text-[#1DA1F2]",
    },
    {
      icon: FaInstagram,
      href: "https://www.instagram.com/pbgroupit",
      label: "Instagram",
      color: "text-[#E4405F]",
    },
    {
      icon: FaLinkedinIn,
      href: "https://www.linkedin.com/company/pbgroups/",
      label: "LinkedIn",
      color: "text-[#0A66C2]",
    },
    {
      icon: FaYoutube,
      href: "https://www.youtube.com/@PBGroup2022",
      label: "YouTube",
      color: "text-[#FF0000]",
    },
    {
      icon: FaWhatsapp,
      href: "https://wa.me/97715422929",
      label: "WhatsApp",
      color: "text-[#25D366]",
    },
    {
      icon: FaTiktok,
      href: "https://www.tiktok.com/@pbgroup0?_t=ZS-8z201mbD7Fk&_r=1",
      label: "Tiktok",
      color: "text-white",
    },
  ];

  const services = [
    { name: "Research Services", href: "/services/research-services" },
    {
      name: "Survey Software & Mobile App",
      href: "/services/survey-software-apps",
    },
    { name: "Data Analytics Service", href: "/services/data-analytics-service" },
    { name: "ICT Solutions", href: "/services/ict-solutions" },
    { name: "Business Dashboard", href: "/services/business-dashboard" },
    {
      name: "Capacity Building Training",
      href: "/services/capacity-building-training",
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white relative">
      {/* Optimized Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 ease-out will-change-transform z-50 ${
          showScrollTop
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Scroll to top"
        style={{ transform: showScrollTop ? "scale(1)" : "scale(0.8)" }}
      >
        <ChevronUp size={25} />
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        {/* Optimized Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Info + Social */}
          <div className="will-change-auto">
            <h3 className="text-xl font-bold text-white mb-6">PB Group</h3>

            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-3">
                <MapPin
                  size={18}
                  className="text-blue-400 mt-1 flex-shrink-0"
                />
                <a
                  href="https://www.google.com/maps/place/PB+Group+%7C+Research+and+Data+Analytics+Company+in+Nepal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 text-sm leading-relaxed hover:text-white transition-colors duration-150 ease-out"
                >
                  Pulchowk, Lalitpur 44600,
                  <br />
                  Nepal
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-orange-400 flex-shrink-0" />
                <a
                  href="mailto:info@pbg.com.np"
                  className="text-gray-300 hover:text-white transition-colors duration-150 ease-out text-sm"
                >
                  info@pbg.com.np
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-green-400 flex-shrink-0" />
                <a
                  href="tel:+9779802351303"
                  className="text-gray-300 text-sm hover:text-white transition-colors duration-150 ease-out"
                >
                  980-2351303
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Follow Us
              </h4>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <SocialLink
                    key={social.label}
                    icon={social.icon}
                    href={social.href}
                    label={social.label}
                    color={social.color}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="will-change-auto">
            <h3 className="text-xl font-bold text-white mb-6">Our Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <ServiceLink
                  key={service.name}
                  name={service.name}
                  href={service.href}
                />
              ))}
            </ul>
          </div>

          {/* Optimized Google Map */}
          <div className="will-change-auto">
            <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-lg border border-slate-700 transform-gpu">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d884.8385578298967!2d85.31517521291779!3d27.677185235584285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb193c5fed8d65%3A0x4bd54b2ed54938b0!2sPB%20Group%20%7C%20Research%20and%20Data%20Analytics%20Company%20in%20Nepal!5e0!3m2!1sen!2snp!4v1694845647123!5m2!1sen!2snp"
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="PB Group Location Map"
              />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 mt-10 pt-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="text-center lg:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} PB Group All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Leading Research & Data Analytics Company in Nepal
              </p>
            </div>

            <nav className="flex flex-wrap justify-center lg:justify-end space-x-6 text-sm">
              <a
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors duration-150 ease-out"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors duration-150 ease-out"
              >
                Terms of Service
              </a>
              <a
                href="/cookies"
                className="text-gray-400 hover:text-white transition-colors duration-150 ease-out"
              >
                Cookie Policy
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
