import React, { useState, useEffect } from "react";
import { Clock, Star, Users, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import Modal from "./Modal";

const CoursesSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 4;
    const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const categories = [
    "All",
    "Analysis", // except Data Collection, Scientific Paper, GIS_SYLLABUS
    "Coding", // put r, python, python with ai
    "AI", // put using python and AI
    "Collection", // put Data Collection System
    "Writing", // put Scientific Paper Writing
    "Management and Modeling", // put GIS
  ];

  const courses = [
  {
    id: 1,
    title: "Data Analytics using R Programming",
    slug: "data-analytics-using-r-programming",
    subtitle: "Master Statistical analysis and visualization with R",
    duration: "4 Weeks",
    rating: 4.8,
    students: "200+",
    image: "/courses/R-programming-logo.webp",
    alt: "R Programming course for data analytics - Learn statistical analysis and data visualization with R programming language",
    width: 1280,
    height: 992,
    categories: ["Analysis", "Coding", "Statistics"],
    isTrending: true,
    isFeatured: true,
    isUpcoming: true,
  },
  {
    id: 2,
    title: "Data Analytics using SPSS",
    slug: "data-analytics-using-spss",
    subtitle: "Statistical analysis and visualization with SPSS",
    duration: "3 Weeks",
    rating: 4.7,
    students: "200+",
    image: "/courses/Spss-Course.webp",
    alt: "SPSS course for data analytics - Learn statistical analysis and data visualization using SPSS software",
    width: 360,
    height: 270,
    categories: ["Analysis", "Statistics"],
    isTrending: true,
    isFeatured: true,
    isUpcoming: true,
  },
  {
    id: 3,
    title: "Data Analysis using Python",
    slug: "data-analysis-using-python",
    subtitle:
      "Python for data cleaning, Analysis and Visualization including Statistics test",
    duration: "5 Weeks",
    rating: 4.9,
    students: "50+",
    image: "/courses/Python-Course.webp",
    alt: "Python programming course for data analysis - Learn data cleaning, analysis and visualization with Python",
    width: 2400,
    height: 1500,
    categories: ["Analysis", "Coding", "Statistics"],
    isTrending: true,
    isFeatured: true,
    isUpcoming: false,
  },
  {
    id: 4,
    title: "Data Analysis using Python and AI",
    slug: "data-analysis-using-python-and-ai",
    subtitle:
      "Advanced AI and Python for Data Analysis with Advanced Statistical knowledge",
    duration: "8 Weeks",
    rating: 4.9,
    students: "10+",
    image: "/courses/Python-AI-Course.webp",
    alt: "Python AI course for advanced data analysis - Learn artificial intelligence and machine learning with Python programming",
    width: 800,
    height: 466,
    categories: ["Analysis", "Statistics", "AI", "Coding"],
    isTrending: false,
    isFeatured: false,
    isUpcoming: true,
  },
  {
    id: 5,
    title: "Data Analysis using Advanced Excel",
    slug: "data-analysis-using-advanced-excel",
    subtitle: "Data cleaning, Analysis and Visualization Using Excel",
    duration: "5 Weeks",
    rating: 4.9,
    students: "50+",
    image: "/courses/Excel.webp",
    alt: "Advanced Excel course for data analysis - Master data cleaning, analysis and visualization using Microsoft Excel",
    width: 1446,
    height: 9744,
    categories: ["Analysis", "Statistics"],
    isTrending: false,
    isFeatured: true,
    isUpcoming: false,
  },
  {
    id: 6,
    title: "Data Collection (kobo toolbox & Survey solutions)",
    slug: "data-collection-kobo-toolbox-survey-solutions",
    subtitle: "Data collections system for Mobile and Tablet",
    duration: "5 Weeks",
    rating: 4.6,
    students: "50+",
    image: "/courses/kobotoolbox-Course.webp",
    alt: "KoBoToolbox course for data collection - Learn mobile and tablet-based survey data collection systems",
    width: 1200,
    height: 630,
    categories: ["Collection", "Survey"],
    isTrending: false,
    isFeatured: true,
    isUpcoming: false,
  },
  {
    id: 7,
    title: "Scientific Paper Writing and Publish",
 slug: "scientific-paper-writing-and-Publish",
    subtitle: "Learn to write compelling research papers",
    duration: "3 Weeks",
    rating: 4.5,
    students: "50+",
    image: "/courses/Scientific-Paper-Writing.webp",
    alt: "Scientific paper writing course - Learn academic writing, research methodology and publication strategies",
    width: 4592,
    height: 3448,
    categories: ["Writing"],
    isTrending: false,
    isFeatured: true,
    isUpcoming: false,
  },
  {
    id: 8,
    title: "GIS and Spatial Analysis",
    slug: "gis-and-spatial-analysis",
    subtitle: "Geographic Information Systems and spatial modeling",
    duration: "6 Weeks",
    rating: 4.7,
    students: "50+",
    image: "/courses/Gis-Course.webp",
    alt: "GIS course for spatial analysis - Learn Geographic Information Systems, mapping and spatial data modeling",
    width: 626,
    height: 626,
    categories: ["Management and Modeling", "Analysis"],
    isTrending: false,
    isFeatured: true,
    isUpcoming: false,
  },
   {
    id: 9,
    title: "Digital Marketing & SEO Training",
    slug: "digital-marketing-and-seo-training",
    subtitle: "Digital Marketing And SEO Training",
    duration: "4 Weeks",
    rating: 4.7,
    students: "20+",
    image: "/courses/digital-marketing.webp",
    alt: "Learn Digital Marketing & SEO",
    width: 4400,
    height: 3425,
    categories: ["Management and Modeling", "Analysis"],
    isTrending: false,
    isFeatured: true,
    isUpcoming: false,
  },
];


  // Updated filtering logic to handle multiple categories
  const filteredCourses =
    activeCategory === "All"
      ? courses
      : courses.filter((course) => course.categories.includes(activeCategory));

  // Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const currentCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <section className="py-4 lg:py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Choose your course and set your career in motion
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enroll in our highly-rated courses and learn all you need to land
            the job you want.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Courses Grid - Updated for 2-column mobile layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {currentCourses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.slug}`}
              className="bg-white rounded-lg shadow-sm hover:shadow-lg hover:scale-[1.02] hover:bg-gray-50 transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col h-full cursor-pointer"
            >
              {/* Course Image - Adjusted height for mobile */}
              <div className="relative h-32 sm:h-40 lg:h-48 overflow-hidden">
                <img
                  loading="lazy"
                  decoding="auto"
                  src={course.image}
                  alt={course.alt}
                  width={course.width}
                  height={course.height}
                  className="w-full h-full object-contain bg-gray-100 group-hover:scale-105 transition-transform duration-300"
                />

                {/* Rating Badge - Adjusted size for mobile */}
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md shadow-sm">
                  <div className="flex items-center text-xs sm:text-sm font-medium">
                    <Star
                      size={10}
                      className="mr-0.5 sm:mr-1 fill-yellow-400 text-yellow-400"
                    />
                    <span className="text-gray-700">{course.rating}</span>
                  </div>
                </div>
              </div>

              {/* Course Content - Adjusted padding and text sizes */}
              <div className="p-3 sm:p-4 lg:p-5 flex flex-col flex-grow">
                {/* Title - Responsive text sizes */}
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-2 h-10 sm:h-12 lg:h-14 flex items-start">
                  <span className="line-clamp-2">{course.title}</span>
                </h3>

                {/* Subtitle - Responsive text sizes */}
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 h-8 sm:h-10 flex items-start flex-grow">
                  <span className="line-clamp-2">{course.subtitle}</span>
                </p>

                {/* Course Info - Responsive sizes and layout */}
                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock size={12} className="mr-1" />
                    <span className="hidden sm:inline">{course.duration}</span>
                    <span className="sm:hidden">{course.duration.split(' ')[0]}W</span>
                  </div>
                  <div className="flex items-center">
                    <Users size={12} className="mr-1" />
                    {course.students}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No courses found message */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-base sm:text-lg">
              No courses found in the "{activeCategory}" category.
            </p>
          </div>
        )}

        {/* Pagination - Responsive adjustments */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mt-8 sm:mt-12">
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <ChevronLeft size={16} className="mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </button>

            {renderPagination().map((page, index) =>
              page === "ellipsis" ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 sm:px-4 py-2 sm:py-3 text-gray-400 font-medium text-xs sm:text-sm"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 shadow-sm hover:shadow-md ${
                    currentPage === page
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110"
                      : "text-gray-700 bg-white border-2 border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() =>
                handlePageChange(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="flex items-center px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight size={16} className="ml-1 sm:ml-2" />
            </button>
          </div>
        )}

        {/* CTA Section - Responsive adjustments */}
        <div className="text-center mt-8 sm:mt-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link to={"/courses"}>
              <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto">
                View All Courses
              </button>
            </Link>

            <button
             onClick={() => setIsModalOpen(true)}
              className="px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-200 text-sm sm:text-base w-full sm:w-auto"
            >
             Register Now
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
            src="https://docs.google.com/forms/d/e/1FAIpQLSclA-uhbCaHLJsdR2W8sqhspvqJRkqDQzVahrgA-LsZBWg5QQ/viewform?embedded=true"
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
    </section>
  );
};

export default CoursesSection;