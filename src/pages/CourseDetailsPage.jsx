
import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Star,
  Clock,
  Calendar,
  MapPin,
  CheckCircle,
  Gift,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Users,
  Phone,
  Mail,
} from "lucide-react";
import { HashLoader } from "react-spinners";
import {
  getCourseBySlug,
  getSimilarCourses,
  getSyllabusByCourseSlug,
} from "../data/courseDetails";
import Modal from "../components/Modal";
import SeoHelmet from "../components/seo/SeoHelmet";

// Custom hook for scroll animations (same as ServiceDetailPage)
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

// Simple internal link helper - only replaces specific keywords you define
const addInternalLinks = (text, links = []) => {
  if (!links.length) return text;

  let enhancedText = text;
  links.forEach(({ keyword, url, title }) => {
    const regex = new RegExp(`\\b${keyword}\\b(?![^<]*>)`, "gi");
    enhancedText = enhancedText.replace(
      regex,
      `<a href="${url}" title="${title}" class="text-blue-600 hover:text-blue-800 underline">${keyword}</a>`
    );
  });

  return enhancedText;
};

// Content skeleton for loading states
const ContentSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
  </div>
);

// Schedule message component
const ScheduleMessage = ({ observeElement, isVisible }) => (
  <div 
    ref={(el) => observeElement(el, 'schedule-content')}
    className={`text-center py-12 px-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 opacity-0 ${
      isVisible('schedule-content') ? 'animate-fade-up' : ''
    }`}
  >
    <div className="max-w-md mx-auto">
      <Calendar className="w-16 h-16 text-blue-500 mx-auto mb-6" />
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Course Schedule Coming Soon
      </h3>
      <p className="text-gray-600 mb-6 leading-relaxed">
        We're currently finalizing the upcoming batch schedules for this course.
        Stay tuned for exciting new session timings!
      </p>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
          <h4 className="font-semibold text-gray-900 mb-2">
            Get Notified First
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            Contact us to be the first to know when enrollment opens
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <div className="flex items-center text-sm text-blue-600">
              <Phone className="w-4 h-4 mr-2" />
              <span>Call: +977 980-2351303</span>
            </div>
            <div className="flex items-center text-sm text-blue-600">
              <Mail className="w-4 h-4 mr-2" />
              <span>Email: info@pbg.com.np</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Memoized similar course card to prevent unnecessary re-renders
const SimilarCourseCard = React.memo(({ course, onClick, observeElement, isVisible, index }) => (
  <div
    ref={(el) => observeElement(el, `similar-course-${index}`)}
    className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 group cursor-pointer opacity-0 ${
      isVisible(`similar-course-${index}`) ? `animate-scale-in animate-delay-${(index + 1) * 100}` : ''
    }`}
    onClick={() => onClick(course.slug)}
  >
    <div className="relative h-32 overflow-hidden">
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
        width={course.width || 400}
        height={course.height || 300}
      />
      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
        <div className="flex items-center text-xs font-medium">
          <Star size={12} className="mr-1 fill-yellow-400 text-yellow-400" />
          <span className="text-gray-700">{course.rating}</span>
        </div>
      </div>
    </div>
    <div className="p-4">
      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight">
        {course.title}
      </h4>
      <div className="flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center">
          <Clock size={12} className="mr-1" />
          {course.duration}
        </div>
        <div className="flex items-center">
          <Users size={12} className="mr-1" />
          {course.students}
        </div>
      </div>
    </div>
  </div>
));

// Optimized syllabus component with better performance
const SyllabusTab = React.memo(({ syllabus, expandedModule, toggleModule, observeElement, isVisible }) => (
  <div className="space-y-4 sm:space-y-6">
    <h3 
      ref={(el) => observeElement(el, 'syllabus-title')}
      className={`text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 opacity-0 ${
        isVisible('syllabus-title') ? 'animate-fade-up' : ''
      }`}
    >
      Course Syllabus
    </h3>
    {syllabus.map((module, index) => (
      <div
        key={module.id}
        ref={(el) => observeElement(el, `syllabus-module-${index}`)}
        className={`border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md opacity-0 ${
          isVisible(`syllabus-module-${index}`) ? `animate-fade-up animate-delay-${(index + 1) * 100}` : ''
        }`}
      >
        <button
          onClick={() => toggleModule(index)}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="min-w-0 flex-1 pr-4">
            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
              {module.title}
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {module.duration}
            </p>
          </div>
          {expandedModule === index ? (
            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200" />
          )}
        </button>
        {expandedModule === index && (
          <div className="px-4 sm:px-6 pb-3 sm:pb-4 bg-gray-50 border-t border-gray-100">
            <ul className="space-y-2">
              {module.topics.map((topic, topicIndex) => (
                <li key={topicIndex} className="flex items-start">
                  <BookOpen className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{topic}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ))}
  </div>
));

// Main component
const CourseDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { observeElement, isVisible } = useScrollAnimation();

  // State management
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedModule, setExpandedModule] = useState(null);
  const [currentSimilarCoursePage, setCurrentSimilarCoursePage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isContentReady, setIsContentReady] = useState(false);
  const [imagePreloaded, setImagePreloaded] = useState(false);

  const internalLinks = useMemo(
    () => [
      {
        keyword: "R Programming",
        url: "/courses/data-analytics-using-r-programming",
        title: "Learn Data Analytics using R Programming",
      },
      {
        keyword: "SPSS",
        url: "/courses/data-analytics-using-spss",
        title: "Learn Data Analytics using SPSS",
      },
      {
        keyword: "Python",
        url: "/courses/data-analysis-using-python",
        title: "Learn Data Analysis using Python",
      },
      {
        keyword: "AI",
        url: "/courses/data-analysis-using-python-and-ai",
        title: "Advanced Data Analysis using Python and AI",
      },
      {
        keyword: "Excel",
        url: "/courses/data-analysis-using-advanced-excel",
        title: "Learn Data Analysis using Advanced Excel",
      },
      {
        keyword: "KoBoToolbox",
        url: "/courses/data-collection-kobo-toolbox-survey-solutions",
        title: "Data Collection with KoBoToolbox & Survey Solutions",
      },
      {
        keyword: "Scientific Paper Writing",
        url: "/courses/scientific-paper-writing-and-publish",
        title: "Scientific Paper Writing and Publishing",
      },
      {
        keyword: "GIS",
        url: "/courses/gis-and-spatial-analysis",
        title: "Learn GIS and Spatial Analysis",
      },
    ],
    []
  );

  // Core data with immediate loading using slug
  const course = useMemo(() => {
    const courseData = getCourseBySlug(slug);
    return courseData;
  }, [slug]);

  // Preload content with image optimization
  useEffect(() => {
    if (course) {
      const prepareContent = async () => {
        // Preload hero image for smooth display
        const imagePromise = new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            setImagePreloaded(true);
            resolve();
          };
          img.onerror = resolve; // Continue even if image fails
          img.src = course.image;
        });

        // Wait for image and minimum loading time
        await Promise.all([
          imagePromise,
          new Promise((resolve) => setTimeout(resolve, 900)), // Optimized to 600ms
        ]);

        setIsLoading(false);
        setIsContentReady(true);
      };

      prepareContent();
    } else {
      setIsLoading(false);
    }
  }, [course]);

  // Lazy load syllabus data only when needed using slug
  const syllabusData = useMemo(() => {
    return activeTab === "syllabus" ? getSyllabusByCourseSlug(slug) : [];
  }, [slug, activeTab]);

  // Similar courses with optimized pagination using slug
  const paginationData = useMemo(() => {
    const courses = getSimilarCourses(slug, 9);
    const coursesPerPage = 3;
    const totalPages = Math.ceil(courses.length / coursesPerPage);
    const startIndex = (currentSimilarCoursePage - 1) * coursesPerPage;
    const currentCourses = courses.slice(
      startIndex,
      startIndex + coursesPerPage
    );

    return { totalPages, currentCourses };
  }, [slug, currentSimilarCoursePage]);

  // Memoized tabs
  const tabs = useMemo(
    () => [
      { id: "overview", label: "Overview" },
      { id: "syllabus", label: "Syllabus" },
      { id: "schedule", label: "Schedule" },
    ],
    []
  );

  // Optimized event handlers
  const toggleModule = useCallback((index) => {
    setExpandedModule((prev) => (prev === index ? null : index));
  }, []);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    if (tabId === "syllabus") {
      setExpandedModule(null);
    }
  }, []);

  const handleSimilarCourseClick = useCallback(
    (courseSlug) => {
      setIsLoading(true);
      setIsContentReady(false);
      setImagePreloaded(false);
      setActiveTab("overview");
      navigate(`/courses/${courseSlug}`);
    },
    [navigate]
  );

  const handlePageChange = useCallback((pageNumber, event) => {
    event.preventDefault();
    event.stopPropagation();
    setCurrentSimilarCoursePage(pageNumber);
  }, []);

  // Early return with optimized loading state
  if (isLoading || !course || !isContentReady) {
    return (
      <div className="min-h-screen bg-white">
        {!course && !isLoading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 text-lg mb-4">
                Course Coming Soon
              </div>
              <button
                onClick={() => navigate("/")}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Go Back to Home
              </button>
            </div>
          </div>
        ) : (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center">
              <div className="flex justify-center items-center mb-6">
                <HashLoader color="#2563eb" size={60} />
              </div>
              <p className="text-gray-700 font-medium text-lg">
                Loading course details...
              </p>
              <p className="mt-2 text-gray-500 text-sm">
                Preparing content for smooth experience
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Optimized tab content rendering
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6 sm:space-y-8">
            <div 
              ref={(el) => observeElement(el, 'course-description')}
              className={`opacity-0 ${isVisible('course-description') ? 'animate-fade-up' : ''}`}
            >
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Course Description
              </h3>
              {course.description.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-gray-700 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base"
                  dangerouslySetInnerHTML={{
                    __html: addInternalLinks(paragraph, internalLinks),
                  }}
                />
              ))}
            </div>

            <div 
              ref={(el) => observeElement(el, 'learning-outcomes')}
              className={`opacity-0 ${isVisible('learning-outcomes') ? 'animate-fade-up animate-delay-200' : ''}`}
            >
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                What You'll Learn
              </h3>
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                {course.learningOutcomes.map((item, index) => (
                  <div 
                    key={index} 
                    ref={(el) => observeElement(el, `outcome-${index}`)}
                    className={`flex items-start opacity-0 ${
                      isVisible(`outcome-${index}`) ? `animate-fade-right animate-delay-${(index + 3) * 100}` : ''
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                    <span
                      className="text-gray-700 text-sm sm:text-base"
                      dangerouslySetInnerHTML={{
                        __html: addInternalLinks(item, internalLinks),
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div 
              ref={(el) => observeElement(el, 'requirements-audience')}
              className={`grid md:grid-cols-2 gap-6 sm:gap-8 opacity-0 ${
                isVisible('requirements-audience') ? 'animate-fade-up animate-delay-400' : ''
              }`}
            >
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Course Requirements
                </h3>
                <ul className="space-y-3">
                  {course.prerequisites.map((prereq, index) => (
                    <li
                      key={index}
                      className="text-gray-700 text-sm sm:text-base"
                      dangerouslySetInnerHTML={{
                        __html: `• ${addInternalLinks(prereq, internalLinks)}`,
                      }}
                    />
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Who Should Enroll
                </h3>
                <ul className="space-y-3">
                  {course.targetAudience.map((audience, index) => (
                    <li
                      key={index}
                      className="text-gray-700 text-sm sm:text-base"
                      dangerouslySetInnerHTML={{
                        __html: `• ${addInternalLinks(
                          audience,
                          internalLinks
                        )}`,
                      }}
                    />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      case "syllabus":
        return syllabusData.length > 0 ? (
          <SyllabusTab
            syllabus={syllabusData}
            expandedModule={expandedModule}
            toggleModule={toggleModule}
            observeElement={observeElement}
            isVisible={isVisible}
          />
        ) : (
          <ContentSkeleton />
        );

      case "schedule":
        return <ScheduleMessage observeElement={observeElement} isVisible={isVisible} />;

      default:
        return <ContentSkeleton />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Animation CSS Styles */}
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
        
        .animate-delay-100 { animation-delay: 0.05s; }
        .animate-delay-200 { animation-delay: 0.1s; }
        .animate-delay-300 { animation-delay: 0.15s; }
        .animate-delay-400 { animation-delay: 0.2s; }
        .animate-delay-500 { animation-delay: 0.25s; }
        .animate-delay-600 { animation-delay: 0.3s; }
        .animate-delay-700 { animation-delay: 0.35s; }
        .animate-delay-800 { animation-delay: 0.4s; }
        
        .opacity-0 { opacity: 0; }
      `}</style>

      <SeoHelmet
        title={`${course.title} | PB Group Course Training`}
        description={`${course.subtitle} - Duration: ${
          course.duration
        }. Learn ${course.learningOutcomes.slice(0, 3).join(", ")}, and more.`}
        image={course.image}
        url={`https://pbg.com.np/courses/${course.slug}`}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8">
            <div 
              ref={(el) => observeElement(el, 'hero-content')}
              className={`lg:col-span-3 space-y-6 opacity-0 ${
                isVisible('hero-content') ? 'animate-fade-left' : ''
              }`}
            >
              <div className="space-y-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {course.title}
                </h1>
                <p className="text-lg text-gray-600">{course.subtitle}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-semibold text-gray-900">
                      {course.rating}
                    </span>
                    <span className="ml-1">({course.students} students)</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" /> {course.duration}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" /> Enquiry for Schedule
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" /> {course.location}
                  </div>
                </div>
              </div>

              <div 
                ref={(el) => observeElement(el, 'hero-image')}
                className={`relative rounded-2xl overflow-hidden shadow-lg opacity-0 ${
                  isVisible('hero-image') ? 'animate-scale-in animate-delay-300' : ''
                }`}
              >
                <div className="aspect-[16/9] relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      imagePreloaded ? "opacity-100" : "opacity-90"
                    }`}
                    loading="eager"
                    width={course.width || 1280}
                    height={course.height || 720}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div 
              ref={(el) => observeElement(el, 'sidebar')}
              className={`lg:col-span-2 opacity-0 ${
                isVisible('sidebar') ? 'animate-fade-right animate-delay-400' : ''
              }`}
            >
             {/*  {course.festiveOffer && (
                <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-4 text-white shadow-lg mb-6">
                  <div className="flex items-center justify-center gap-2">
                    <Gift className="w-5 h-5" />
                    <span className="font-semibold text-lg">
                      {course.festiveOffer}
                    </span>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <p className="text-center text-sm mt-2 opacity-90">
                    Limited time offer - Enroll now!
                  </p>
                </div>
              )} */}

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="space-y-4 mb-6">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-[1.02] shadow-md"
                  >
                    Enquiry Now
                  </button>
                  <a
                    href={`/files/${course.title}.pdf`}
                    target="_blank"
                    download
                    rel="noopener noreferrer"
                    className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-200 text-center block"
                  >
                    Download Syllabus
                  </a>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Course Highlights
                  </h4>
                  <ul className="space-y-3">
                    {course.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span
                          className="text-gray-700 text-sm"
                          dangerouslySetInnerHTML={{
                            __html: addInternalLinks(highlight, internalLinks),
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div 
              ref={(el) => observeElement(el, 'tabs')}
              className={`border-b border-gray-200 mb-6 sm:mb-8 overflow-x-auto opacity-0 ${
                isVisible('tabs') ? 'animate-fade-up' : ''
              }`}
            >
              <nav className="flex space-x-4 sm:space-x-8 min-w-max sm:min-w-0">
                {tabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    ref={(el) => observeElement(el, `tab-${index}`)}
                    onClick={() => handleTabChange(tab.id)}
                    className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 opacity-0 ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } ${isVisible(`tab-${index}`) ? `animate-fade-up animate-delay-${(index + 1) * 100}` : ''}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="min-w-0">{renderTabContent()}</div>
          </div>

          {/* Similar Courses */}
          <div 
            ref={(el) => observeElement(el, 'similar-courses')}
            className={`lg:col-span-1 opacity-0 ${
              isVisible('similar-courses') ? 'animate-fade-right animate-delay-500' : ''
            }`}
          >
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Similar Courses
              </h3>
              <div className="space-y-4">
                {paginationData.currentCourses.map((similarCourse, index) => (
                  <SimilarCourseCard
                    key={similarCourse.slug}
                    course={similarCourse}
                    onClick={handleSimilarCourseClick}
                    observeElement={observeElement}
                    isVisible={isVisible}
                    index={index}
                  />
                ))}
              </div>

              {/* Pagination */}
              {paginationData.totalPages > 1 && (
                <div 
                  ref={(el) => observeElement(el, 'pagination')}
                  className={`flex justify-center items-center mt-6 space-x-1 opacity-0 ${
                    isVisible('pagination') ? 'animate-fade-up animate-delay-600' : ''
                  }`}
                >
                  <button
                    onClick={(e) =>
                      handlePageChange(
                        Math.max(1, currentSimilarCoursePage - 1),
                        e
                      )
                    }
                    disabled={currentSimilarCoursePage === 1}
                    className={`px-3 py-1 rounded text-sm transition-all duration-200 ${
                      currentSimilarCoursePage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    ←
                  </button>
                  {Array.from(
                    { length: paginationData.totalPages },
                    (_, i) => i + 1
                  ).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={(e) => handlePageChange(pageNumber, e)}
                      className={`w-8 h-8 rounded text-sm font-medium transition-all duration-200 ${
                        currentSimilarCoursePage === pageNumber
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  <button
                    onClick={(e) =>
                      handlePageChange(
                        Math.min(
                          paginationData.totalPages,
                          currentSimilarCoursePage + 1
                        ),
                        e
                      )
                    }
                    disabled={
                      currentSimilarCoursePage === paginationData.totalPages
                    }
                    className={`px-3 py-1 rounded text-sm transition-all duration-200 ${
                      currentSimilarCoursePage === paginationData.totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Contact Us</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="p-0">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSclA-uhbCaHLJsdR2W8sqhspvqJRkqDQzVahrgA-LsZBWg5QQ/viewform?embedded=true"
            width="100%"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            className="w-full h-[70vh] min-h-[500px] rounded-b-lg"
            title="Enquiry Form"
            loading="lazy"
          />
        </div>
      </Modal>
    </div>
  );
};

export default CourseDetailsPage;