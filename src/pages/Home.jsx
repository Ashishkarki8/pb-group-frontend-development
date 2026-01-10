// animations
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import AboutSection from "../components/AboutSection";
import OurClients from "../components/ClientsSection";
import CoursesSection from "../components/CourseSection";
import OurServices from "../components/OurServices";
import PosterModal from "../components/PosterModel";
import SeoHelmet from "../components/seo/SeoHelmet";
import Testimonials from "../components/Testimonials";
import Modal from "../components/Modal";

// Simple counting animation hook
const useCountUp = (end, duration = 2000, enabled = true) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      setCount(0);
      setHasStarted(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted && enabled) {
          setHasStarted(true);
          
          const increment = end / (duration / 50);
          let current = 0;
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, 50);
          
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasStarted, enabled]);

  return [count, elementRef];
};

const Home = () => {
  const [isPosterOpen, setIsPosterOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(false);

  // Animated stats counters with refs (only start when enabled)
  const [count1, ref1] = useCountUp(50, 2000, animationsEnabled);
  const [count2, ref2] = useCountUp(500, 2000, animationsEnabled);
  const [count3, ref3] = useCountUp(120, 2000, animationsEnabled);

  // Poster and animation timing
  useEffect(() => {
    const posterShown = sessionStorage.getItem("dashain-poster-shown");
    
    if (!posterShown) {
      // Show poster immediately for new users
      setIsPosterOpen(true);
    } else {
      // Start animations immediately for returning users
      setAnimationsEnabled(true);
      const timer = setTimeout(() => setBannerVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClosePoster = () => {
    setIsPosterOpen(false);
    sessionStorage.setItem("dashain-poster-shown", "true");
    
    // Start animations after poster closes
    setAnimationsEnabled(true);
    setTimeout(() => setBannerVisible(true), 200);
  };

  const slides = [
    {
      src: "landing-page-images/tilganga2.webp",
      alt: "PB Group training session at Tilganga Eye Hospital",
      width: 1280,
      height: 960,
    },
    {
      src: "landing-page-images/CAN_Exhibition.webp",
      alt: "PB Group presentation at CAN Exhibition",
      width: 2048,
      height: 1365,
    },
    {
      src: "landing-page-images/CentralCampusofTechnology_Dharan_2.webp",
      alt: "Training session at Central Campus of Technology Dharan",
      width: 3359,
      height: 2301,
    },
    {
      src: "landing-page-images/Deapartment_of_Agriculture.webp",
      alt: "PB Group workshop at Department of Agriculture",
      width: 4096,
      height: 2304,
    },
    {
      src: "landing-page-images/Lumle_Kaski.webp",
      alt: "Research training program at Lumle Kaski",
      width: 3051,
      height: 1373,
    },
    {
      src: "landing-page-images/NepalNetraJyotiSangh2.webp",
      alt: "Data analytics training at Nepal Netra Jyoti Sangh",
      width: 1600,
      height: 720,
    },
    {
      src: "landing-page-images/IDE.webp",
      alt: "PB Group training session at IDE",
      width: 1600,
      height: 1200,
    },
  ];

  // Preload images efficiently
  useEffect(() => {
    const preloadImage = (src, index) => {
      const img = new Image();
      img.onload = () =>
        setImagesLoaded((prev) => ({ ...prev, [index]: true }));
      img.src = src;
    };

    // Preload first 3 images immediately
    slides.slice(0, 3).forEach((slide, index) => {
      preloadImage(slide.src, index);
    });

    // Preload remaining images after delay
    const timer = setTimeout(() => {
      slides.slice(3).forEach((slide, index) => {
        preloadImage(slide.src, index + 3);
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    const autoSlide = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(autoSlide);
  }, [slides.length]);

  // Simple slide navigation
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index) => setCurrentSlide(index);

  // Touch handling for mobile swipes
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  const stats = [
    { number: count1, suffix: "+", label: "Research Projects", color: "text-blue-600", ref: ref1 },
    { number: count2, suffix: "+", label: "Students Trained", color: "text-amber-600", ref: ref2 },
    { number: count3, suffix: "+", label: "Training Sessions", color: "text-yellow-500", ref: ref3 },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <SeoHelmet
        title="PB Group | Data Analytics Company & Training Center in Nepal"
        description="PB Group offers research, data analytics, and IT solutions in Nepal. Learn Data Analytics with Python, R, SPSS, Excel, and more through expert-led training courses. Empower your business with actionable insights and professional growth."
        image="/landing-page-images/tilganga2.webp"
        url="https://pbg.com.np/"
      />

      {/* Preload critical images */}
      <link rel="preload" as="image" href={slides[0].src} />
      <link rel="preload" as="image" href={slides[1].src} />

      <PosterModal
        isOpen={isPosterOpen}
        onClose={handleClosePoster}
        posterImage="/poster/Banner.webp"
        posterAlt="Offer Banner"
      />

      {/* Hero Section */}
      <main id="home" className="relative overflow-hidden scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-5">
          <div className="grid lg:grid-cols-2 gap-4 items-center">
            {/* Left Content */}
            <div className="space-y-4">
              <div className="space-y-4">
                <div 
                  className={`inline-flex items-center px-1 py-2 bg-indigo-50 rounded-full text-blue-500 text-sm font-medium transform transition-all duration-1000 ease-out ${
                    bannerVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                  }`}
                >
                  🎓 Leading Research & Data Analytics Company
                </div>
                <h1 className="text-4xl italic lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                  Insights That <span className="text-blue-600">Empower</span>{" "}
                  Growth.
                </h1>
                <p className="text-xl text-gray-900 leading-relaxed font-light max-w-lg">
                  PB Group leverages Research and Data Analytics to turn
                  information into actionable insights, helping to make smarter
                  decisions, unlock opportunities, and drive real growth.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl cursor-pointer"
                >
                 Get Consultation
                </button>

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

                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center px-6 py-2 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-xl hover:border-blue-600 hover:text-blue-600"
                >
                  View Courses
                </Link>
              </div>

              {/* Animated Stats */}
              <div className="grid grid-cols-3 gap-8 pt-5">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center lg:text-left" ref={stat.ref}>
                    <div
                      className={`text-3xl lg:text-4xl font-bold ${stat.color} mb-2 tabular-nums`}
                    >
                      {stat.number}{stat.suffix}
                    </div>
                    <div className="text-gray-600 font-medium text-sm lg:text-base">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Slider */}
            <div className="relative lg:ml-3">
              <button
                onClick={prevSlide}
                className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all duration-200"
                aria-label="Previous image"
              >
                <ChevronLeft
                  size={18}
                  className="text-gray-700 md:w-5 md:h-5"
                />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all duration-200"
                aria-label="Next image"
              >
                <ChevronRight
                  size={18}
                  className="text-gray-700 md:w-5 md:h-5"
                />
              </button>

              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div className="aspect-[4/3] relative">
                  {!imagesLoaded[currentSlide] && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
                      <div className="text-gray-500 text-sm md:text-base">
                        Loading...
                      </div>
                    </div>
                  )}

                  <img
                    src={slides[currentSlide].src}
                    alt={slides[currentSlide].alt}
                    width={slides[currentSlide].width}
                    height={slides[currentSlide].height}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      imagesLoaded[currentSlide] ? "opacity-100" : "opacity-0"
                    }`}
                    loading="eager"
                    fetchpriority="high"
                    onLoad={() =>
                      setImagesLoaded((prev) => ({
                        ...prev,
                        [currentSlide]: true,
                      }))
                    }
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
              </div>

              {/* Slide indicators */}
              <div className="flex justify-center space-x-2 md:space-x-3 mt-4 md:mt-6">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-blue-500 w-6 md:w-8"
                        : "bg-gray-300 w-2 hover:bg-gray-400"
                    }`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sections with proper IDs for smooth scrolling */}
      <section id="about" className="scroll-mt-20">
        <AboutSection />
      </section>

      <section id="services" className="scroll-mt-20">
        <OurServices />
      </section>

      <section id="clients" className="scroll-mt-20">
        <OurClients />
      </section>

      <section id="courses" className="scroll-mt-20">
        <CoursesSection />
      </section>

      <section id="testimonials" className="scroll-mt-20">
        <Testimonials />
      </section>
    </div>
  );
};

export default Home;




