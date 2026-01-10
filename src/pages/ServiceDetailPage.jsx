import {
  ArrowRight,
  Loader2,
  Mail,
  Phone,
  X,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Modal from "../components/Modal.jsx";
import SeoHelmet from "../components/seo/SeoHelmet.jsx";
import { services } from "../data/services.js";

// Custom hook for scroll animations
const useScrollAnimation = () => {
  const [visibleElements, setVisibleElements] = useState(new Set());
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) =>
              new Set(prev).add(entry.target.dataset.animateId)
            );
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
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

  const isVisible = useCallback(
    (id) => visibleElements.has(id),
    [visibleElements]
  );

  return { observeElement, isVisible };
};

// Enhanced internal link helper with better HTML safety
const addInternalLinks = (text, links = []) => {
  if (!links.length || !text) return text;

  // Create a temporary div to safely parse HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = text;

  // Only process text nodes to avoid nested links
  const walkTextNodes = (node) => {
    if (node.nodeType === 3) {
      // Text node
      let textContent = node.textContent;
      let hasChanges = false;

      links.forEach(({ keyword, url, title }) => {
        const regex = new RegExp(`\\b${keyword}\\b`, "gi");
        if (regex.test(textContent)) {
          textContent = textContent.replace(
            regex,
            `<LINK_PLACEHOLDER_${keyword.replace(/\s+/g, "_")}_${url}_${title}>`
          );
          hasChanges = true;
        }
      });

      if (hasChanges) {
        const wrapper = document.createElement("span");
        wrapper.innerHTML = textContent.replace(
          /<LINK_PLACEHOLDER_([^_]+(?:_[^_]+)*)_([^_]+)_([^>]+)>/g,
          (match, keyword, url, title) => {
            const cleanKeyword = keyword.replace(/_/g, " ");
            return `<a href="${url}" title="${title}" class="text-blue-600 hover:text-blue-800 underline">${cleanKeyword}</a>`;
          }
        );

        while (wrapper.firstChild) {
          node.parentNode.insertBefore(wrapper.firstChild, node);
        }
        node.parentNode.removeChild(node);
      }
    } else if (node.nodeType === 1 && node.tagName !== "A") {
      // Element node, not a link
      Array.from(node.childNodes).forEach(walkTextNodes);
    }
  };

  walkTextNodes(tempDiv);

  return tempDiv.innerHTML;
};

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const [currentServicePage, setCurrentServicePage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { observeElement, isVisible } = useScrollAnimation();
  const servicesPerPage = 4;

  // Internal links configuration
  const internalLinks = useMemo(
    () => [
      {
        keyword: "research services",
        url: "/services/research-services",
        title: "Research Services",
      },
      {
        keyword: "survey software",
        url: "/services/survey-software-apps",
        title: "Survey Software & Apps",
      },
      {
        keyword: "data analytics",
        url: "/services/data-analytics-service",
        title: "Data Analytics Service",
      },
      {
        keyword: "ICT solutions",
        url: "/services/ict-solutions",
        title: "ICT Solutions",
      },
      {
        keyword: "business dashboard",
        url: "/services/business-dashboard",
        title: "Business Dashboard",
      },
      {
        keyword: "capacity building training",
        url: "/services/capacity-building-training",
        title: "Capacity Building Training",
      },
      {
        keyword: "digital marketing",
        url: "/services/digital-marketing",
        title: "Digital Marketing Services",
      },
      {
        keyword: "web development",
        url: "/services/web-development",
        title: "Web Development Services",
      },
      {
        keyword: "SEO optimization",
        url: "/services/seo-optimization",
        title: "SEO Optimization Services",
      },
      {
        keyword: "business consulting",
        url: "/services/business-consulting",
        title: "Business Consulting Services",
      },
      {
        keyword: "professional training",
        url: "/courses",
        title: "Professional Training Courses",
      },
      {
        keyword: "project management",
        url: "/services/project-management",
        title: "Project Management Services",
      },
      {
        keyword: "brand strategy",
        url: "/services/brand-strategy",
        title: "Brand Strategy Services",
      },
      {
        keyword: "marketing strategy",
        url: "/services/marketing-strategy",
        title: "Marketing Strategy Services",
      },
    ],
    []
  );

  // Find service and handle loading/error states
  useEffect(() => {
    const findService = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Simulate API call delay (remove in production)
        await new Promise((resolve) => setTimeout(resolve, 300));

        const service = services.find((s) => s.slug === slug);
        if (service) {
          setCurrentService(service);
        } else {
          setError("Service not found");
        }
      } catch (err) {
        console.log(err);
        setError("Failed to load service");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      findService();
    }
  }, [slug]);

  // Memoized content with internal links
  const enhancedDescription = useMemo(() => {
    return currentService
      ? addInternalLinks(currentService.description, internalLinks)
      : "";
  }, [currentService?.description, internalLinks]);

  // Similar services logic
  const similarServices = useMemo(
    () => services.filter((service) => service.slug !== slug),
    [slug]
  );

  const totalServicePages = Math.ceil(similarServices.length / servicesPerPage);
  const startIndex = (currentServicePage - 1) * servicesPerPage;
  const currentServices = similarServices.slice(
    startIndex,
    startIndex + servicesPerPage
  );

  // Event handlers
  const handleServicePageChange = useCallback((pageNumber, event) => {
    event.preventDefault();
    event.stopPropagation();
    setCurrentServicePage(pageNumber);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !currentService) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Service Not Found"}
          </h2>
          <p className="text-gray-600 mb-6">
            The service you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = currentService.icon;

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Helmet */}
      <SeoHelmet
        title={`PB Group | ${currentService.title}`}
        description={currentService.subtitle}
        image={currentService.heroImage}
        url={`https://pbg.com.np/services/${currentService.slug}`}
      />

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

      {/* Hero Section */}
      <section
        className={`relative py-8 md:py-12 bg-gradient-to-br ${currentService.color} text-white overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div
              ref={(el) => observeElement(el, "hero-content")}
              className={`space-y-6 opacity-0 ${
                isVisible("hero-content") ? "animate-fade-left" : ""
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <IconComponent
                    size={28}
                    className="text-white md:w-8 md:h-8"
                  />
                </div>
                <div className="text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Professional Service
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                {currentService.title}
              </h1>

              <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl">
                {currentService.subtitle}
              </p>

             {currentService.title === "Capacity Building Training" && (
  <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
    <MapPin className="w-4 h-4" />
    <span>Kathmandu & Lalitpur, Nepal
</span>
  </div>
)}

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 md:px-8 py-3 md:py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-white/90 transform hover:scale-105 transition-all duration-300 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Get consultation for this service"
                >
                  {currentService.title === "Capacity Building Training"
                    ? `Get Registered`
                    : `Get consultation`}
                </button>
              </div>
            </div>

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
                src={currentService.heroImage}
                alt={`${currentService.title} - Professional service illustration`}
                width={currentService.width || 600}
                height={currentService.height || 400}
                className="rounded-2xl shadow-2xl w-full h-64 md:h-80 lg:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-white/5 rounded-full -translate-y-16 md:-translate-y-32 translate-x-16 md:translate-x-32" />
        <div className="absolute bottom-0 left-0 w-24 h-24 md:w-48 md:h-48 bg-white/5 rounded-full translate-y-12 md:translate-y-24 -translate-x-12 md:-translate-x-24" />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12 md:space-y-16">
            {/* Service Overview */}
            <section
              ref={(el) => observeElement(el, "overview")}
              className={`space-y-6 md:space-y-8 opacity-0 ${
                isVisible("overview") ? "animate-fade-up" : ""
              }`}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">

                {currentService.title === "Capacity Building Training"
                  ? `Training Overview`
                  : `Service Overview`}
              </h2>
              <div className="space-y-6 prose prose-lg max-w-none">
                <div
                  className="text-base md:text-lg text-gray-700 leading-relaxed text-justify"
                  dangerouslySetInnerHTML={{ __html: enhancedDescription }}
                />
              </div>

              {/* Research Types Bullet Points */}
              {currentService?.researchTypes &&
                currentService.researchTypes.length > 0 && (
                  <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 md:p-8 border border-blue-100">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                      {(() => {
                        if (currentService.title === "Research Services") {
                          return "Our Research Capabilities";
                        } else if (
                          [
                            "Survey Software & Apps",
                            "Data Analytics Service",
                            "ICT Solutions",
                            "Business Dashboard",
                          ].includes(currentService.title)
                        ) {
                          return "Key Features of Our Service";
                        } else if (
                          currentService.title === "Capacity Building Training"
                        ) {
                          return "Key Features of Our Training";
                        } else {
                          return "Key Features";
                        }
                      })()}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                      {currentService.researchTypes.map((type, index) => (
                        <div
                          key={index}
                          ref={(el) =>
                            observeElement(el, `research-type-${index}`)
                          }
                          className={`flex items-start space-x-3 opacity-0 ${
                            isVisible(`research-type-${index}`)
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
                            {type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </section>

            {/* What's Included */}
            <section
              ref={(el) => observeElement(el, "features")}
              className={`space-y-6 md:space-y-8 opacity-0 ${
                isVisible("features") ? "animate-fade-up animate-delay-200" : ""
              }`}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                What's Included
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                {currentService?.serviceFeatures?.map((item, index) => (
                  <div
                    key={index}
                    ref={(el) => observeElement(el, `feature-${index}`)}
                    className={`flex space-x-4 p-4 md:p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300 opacity-0 ${
                      isVisible(`feature-${index}`)
                        ? `animate-scale-in animate-delay-${(index + 1) * 100}`
                        : ""
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <item.icon
                          size={20}
                          className="text-blue-600 md:w-6 md:h-6"
                        />
                      </div>
                    </div>
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
          </div>

          {/* Sidebar */}
          <div
            ref={(el) => observeElement(el, "sidebar")}
            className={`space-y-6 md:space-y-8 opacity-0 ${
              isVisible("sidebar") ? "animate-fade-right animate-delay-300" : ""
            }`}
          >
            {/* Contact Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 md:p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-blue-100 mb-4 md:mb-6 text-sm md:text-base leading-relaxed">
                Let's discuss how our {currentService.title.toLowerCase()} can
                help your business grow and achieve sustainable success.
              </p>
              <div className="space-y-3 mb-4 md:mb-6">
                <div className="flex items-center space-x-3">
                  <Phone size={14} className="md:w-4 md:h-4 flex-shrink-0" />
                  <span className="text-xs md:text-sm">980-2351303</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail size={14} className="md:w-4 md:h-4 flex-shrink-0" />
                  <span className="text-xs md:text-sm">info@pbg.com.np</span>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full px-4 md:px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-100 transition-colors text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-label="Schedule consultation modal"
              >
                {currentService.title === "Capacity Building Training"
                  ? `Send Inquiry`
                  : `Schedule Consultation`}
              </button>
            </div>

            {/* Related Services */}
            <div
              ref={(el) => observeElement(el, "related-services")}
              className={`bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm opacity-0 ${
                isVisible("related-services")
                  ? "animate-scale-in animate-delay-400"
                  : ""
              }`}
            >
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">
                Related Services
              </h3>

              <div className="min-h-[400px] md:min-h-[450px] flex flex-col">
                <div className="flex-1">
                  <div className="space-y-3 md:space-y-4">
                    {currentServices.map((service, index) => {
                      const ServiceIcon = service.icon;
                      return (
                        <Link
                          key={service.slug}
                          to={`/services/${service.slug}`}
                          ref={(el) => observeElement(el, `related-${index}`)}
                          className={`flex items-center space-x-3 md:space-x-4 p-2 md:p-3 rounded-xl hover:bg-gray-50 transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-300 opacity-0 ${
                            isVisible(`related-${index}`)
                              ? `animate-fade-up animate-delay-${
                                  (index + 5) * 100
                                }`
                              : ""
                          }`}
                          aria-label={`View ${service.title} service details`}
                        >
                          <div
                            className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0`}
                          >
                            <ServiceIcon
                              size={16}
                              className="text-white md:w-5 md:h-5"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-xs md:text-sm truncate">
                              {service.title}
                            </h4>
                            <p className="text-gray-600 text-xs line-clamp-2 mt-1">
                              {service.shortDescription?.slice(0, 80)}...
                            </p>
                          </div>
                          <ArrowRight
                            size={14}
                            className="text-gray-400 flex-shrink-0 group-hover:text-blue-600 transition-colors md:w-4 md:h-4"
                          />
                        </Link>
                      );
                    })}
                  </div>

                  {/* Empty space filler */}
                  {currentServices.length < servicesPerPage && (
                    <div className="space-y-3 md:space-y-4 mt-3 md:mt-4">
                      {Array.from({
                        length: servicesPerPage - currentServices.length,
                      }).map((_, index) => (
                        <div key={`empty-${index}`} className="h-16 md:h-20" />
                      ))}
                    </div>
                  )}
                </div>

                {/* Service Pagination */}
                {totalServicePages > 1 && (
                  <nav
                    className="flex justify-center items-center mt-4 md:mt-6 pt-4 border-t border-gray-100"
                    aria-label="Related services pagination"
                  >
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) =>
                          handleServicePageChange(
                            Math.max(1, currentServicePage - 1),
                            e
                          )
                        }
                        disabled={currentServicePage === 1}
                        className={`px-2 py-1 rounded text-sm transition-colors duration-200 ${
                          currentServicePage === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                        aria-label="Previous page"
                      >
                        ←
                      </button>

                      {Array.from(
                        { length: totalServicePages },
                        (_, i) => i + 1
                      ).map((pageNumber) => (
                        <button
                          key={pageNumber}
                          onClick={(e) =>
                            handleServicePageChange(pageNumber, e)
                          }
                          className={`w-6 h-6 md:w-7 md:h-7 rounded text-xs font-medium transition-colors duration-200 ${
                            currentServicePage === pageNumber
                              ? "bg-blue-600 text-white"
                              : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                          }`}
                          aria-label={`Go to page ${pageNumber}`}
                          aria-current={
                            currentServicePage === pageNumber
                              ? "page"
                              : undefined
                          }
                        >
                          {pageNumber}
                        </button>
                      ))}

                      <button
                        onClick={(e) =>
                          handleServicePageChange(
                            Math.min(totalServicePages, currentServicePage + 1),
                            e
                          )
                        }
                        disabled={currentServicePage === totalServicePages}
                        className={`px-2 py-1 rounded text-sm transition-colors duration-200 ${
                          currentServicePage === totalServicePages
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                        aria-label="Next page"
                      >
                        →
                      </button>
                    </div>
                  </nav>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Contact Us
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="p-0">
          <iframe
            src={
              currentService?.title === "Capacity Building Training"
                ? "https://docs.google.com/forms/d/e/1FAIpQLSclA-uhbCaHLJsdR2W8sqhspvqJRkqDQzVahrgA-LsZBWg5QQ/viewform?embedded=true"
                : "https://docs.google.com/forms/d/e/1FAIpQLSeDX0dtxDzX-k2FGwV1RCgxT1Qecmm4a4jKbJfI_EPYkTbfaA/viewform?embedded=true"
            }
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
    </div>
  );
};

export default ServiceDetailPage;
