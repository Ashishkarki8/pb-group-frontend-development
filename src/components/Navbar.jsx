import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "./Modal";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const dropdownRefs = useRef({});
  const timeoutRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigationLinks = [
    {
      name: "About Us",
      href: "/#about",
      dropdown: [
        { name: "Team", href: "/teams" },
        { name: "Careers", href: "/careers" },
      ],
    },
    {
      name: "Services",
      href: "/#services",
      dropdown: [
        { name: "Research Services", href: "/services/research-services" },
        { name: "Survey Software & Mobile App", href: "/services/survey-software-apps" },
        { name: "Data Analytics Service", href: "/services/data-analytics-service" },
        { name: "ICT Solutions", href: "/services/ict-solutions" },
        { name: "Business Dashboard", href: "/services/business-dashboard" },
        { name: "Capacity Building Training", href: "/services/capacity-building-training" },
      ],
    },
    { name: "Our Works", href: "/our-works" },
    { name: "Courses", href: "courses" },
    { name: "Blogs", href: "/blogs" },
  ];

  // Optimized smooth scrolling
  const handleSmoothScroll = (e, href) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const sectionId = href.substring(2);
      const element = document.getElementById(sectionId);
      
      if (element) {
        const navbar = document.querySelector('header');
        const navbarHeight = navbar?.offsetHeight || 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight - 20;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Close menus
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
      } else if (window.location.pathname !== '/') {
        window.location.href = '/' + href;
      }
    }
  };

  // Desktop dropdown handlers
  const handleMouseEnter = (linkName) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(linkName);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 100);
  };

  // Mobile dropdown handler
  const handleMobileDropdown = (linkName) => {
    setMobileDropdown(mobileDropdown === linkName ? null : linkName);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!Object.values(dropdownRefs.current).some(ref => ref?.contains(event.target))) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="block">
              <img
                src="/pbLogoTransparent.webp"
                width={1145}
                height={458}
                alt="PB Group Logo"
                className="h-16 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <div
                key={link.name}
                className="relative"
                ref={(el) => (dropdownRefs.current[link.name] = el)}
                onMouseEnter={() => link.dropdown && handleMouseEnter(link.name)}
                onMouseLeave={() => link.dropdown && handleMouseLeave()}
              >
                <a
                  href={link.href}
                  className="flex items-center text-gray-700 hover:text-blue-600 font-medium text-lg py-2 px-1"
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                >
                  {link.name}
                  {link.dropdown && <ChevronDown size={16} className="ml-1" />}
                </a>

                {/* Simple dropdown - no animations */}
                {link.dropdown && activeDropdown === link.name && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 py-2 min-w-[220px] z-50">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block px-4 py-3 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 text-sm"
            >
              Send Inquiry
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Contact Us</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="p-0">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSeDX0dtxDzX-k2FGwV1RCgxT1Qecmm4a4jKbJfI_EPYkTbfaA/viewform?embedded=true"
            width="100%"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            className="w-full h-[70vh] md:h-[80vh] min-h-[500px] rounded-b-lg"
            title="Contact Enquiry Form"
            loading="lazy"
          />
        </div>
      </Modal>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {navigationLinks.map((link) => (
              <div key={link.name}>
                <div className="flex items-center justify-between">
                  <a
                    href={link.href}
                    className="flex-1 py-3 text-gray-700 font-medium hover:text-blue-600"
                    onClick={(e) => {
                      handleSmoothScroll(e, link.href);
                      if (!link.dropdown) setIsMobileMenuOpen(false);
                    }}
                  >
                    {link.name}
                  </a>
                  {link.dropdown && (
                    <button
                      onClick={() => handleMobileDropdown(link.name)}
                      className="p-2 text-gray-500"
                    >
                      <ChevronDown size={16} />
                    </button>
                  )}
                </div>

                {/* Mobile Dropdown */}
                {link.dropdown && mobileDropdown === link.name && (
                  <div className="pl-4 pb-2 space-y-1 bg-gray-50 rounded-md mt-1">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block py-2 px-3 text-sm text-gray-600 hover:text-blue-600"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
                <div className="border-b border-gray-100"></div>
              </div>
            ))}

            <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
              >
                Send Inquiry
              </button>
              {/* <Link
                to="/login"
                className="w-full text-center px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-600 hover:text-blue-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link> */}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;



