import {
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Search,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SeoHelmet from "../components/seo/SeoHelmet";

const CoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSection, setActiveSection] = useState("All Courses");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("rating");
  const coursesPerPage = 12;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll to top when currentPage changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

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
    isUpcoming: true,
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
    isUpcoming: true,
  },
];
  const categories = [
    "All",
    "Analysis",
    "Coding",
    "AI",
    "Collection",
    "Writing",
    "Management and Modeling",
    "Statistics",
    "Survey",
  ];

  // Updated sections - removed Featured Courses
  const sections = [
    { id: "All Courses", icon: BookOpen, count: courses.length },
    {
      id: "Trending Courses",
      icon: TrendingUp,
      count: courses.filter((c) => c.isTrending).length,
    },
    {
      id: "Upcoming Courses",
      icon: Calendar,
      count: courses.filter((c) => c.isUpcoming).length,
    },
  ];

  const filteredCourses = useMemo(() => {
    let filtered = courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.subtitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === "All" ||
        course.categories.some((cat) => cat === activeCategory);

      let matchesSection = true;
      if (activeSection === "Trending Courses") {
        matchesSection = course.isTrending;
      } else if (activeSection === "Upcoming Courses") {
        matchesSection = course.isUpcoming;
      }

      return matchesSearch && matchesCategory && matchesSection;
    });

    // Sort courses - removed "Most Popular" option
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "students":
          return (
            parseInt(b.students.replace(/[^0-9]/g, "")) -
            parseInt(a.students.replace(/[^0-9]/g, ""))
          );
        default: // rating as default
          return b.rating - a.rating;
      }
    });

    return filtered;
  }, [searchQuery, activeCategory, activeSection, sortBy]);

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const currentCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  }, []);

  const handleSectionChange = useCallback((section) => {
    setActiveSection(section);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

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
    <div>
      <main>
        <SeoHelmet
          title="PB Group | Data Analytics Courses in Nepal"
          description="Explore PB Group's expert-led Data Analytics courses in Python, R, SPSS, Excel, and more. Learn practical skills for analytics, research, and IT solutions. Boost your career and business insights with professional training."
          image="/landing-page-images/tilganga2.webp"
          url=" https://pbg.com.np/courses"
        />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Section Navigation - Responsive */}
            <div className="mb-4 sm:mb-5">
              <div className="flex flex-wrap gap-2 sm:gap-4">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id)}
                    className={`flex items-center px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${
                      activeSection === section.id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <section.icon size={16} className="mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">{section.id}</span>
                    <span className="sm:hidden">
                      {section.id.split(' ')[0]}
                    </span>
                    <span
                      className={`ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs ${
                        activeSection === section.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {section.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search and Filters - Responsive */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 mb-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Sort Dropdown and Results Count */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center">
                    <Filter size={14} className="mr-2 text-gray-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="rating">Highest Rated</option>
                      <option value="students">Most Enrolled</option>
                    </select>
                  </div>

                  <div className="text-xs sm:text-sm text-gray-600">
                    Showing {currentCourses.length} of {filteredCourses.length}{" "}
                    courses
                  </div>
                </div>
              </div>
            </div>

            {/* Category Filter - Responsive */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                      activeCategory === category
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Courses Grid - Optimized for all screen sizes */}
            {currentCourses.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12">
                {currentCourses.map((course) => (
                  <Link
                    key={course.id}
                    to={`/courses/${course.slug}`}
                    className="block"
                  >
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer h-full">
                      {/* Course Image - Responsive height */}
                      <div className="relative h-32 sm:h-40 lg:h-48 overflow-hidden">
                        <img
                          loading="lazy"
                          decoding="auto"
                          src={course.image}
                          alt={course.title}
                          width={course.width}
                          height={course.height}
                          className="w-full h-full object-contain bg-gray-100 group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Badges - Responsive positioning and sizing */}
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-2">
                          <div className="bg-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md shadow-sm">
                            <div className="flex items-center text-xs sm:text-sm font-medium">
                              <Star
                                size={10}
                                className="mr-0.5 sm:mr-1 fill-yellow-400 text-yellow-400"
                              />
                              <span className="text-gray-700">
                                {course.rating}
                              </span>
                            </div>
                          </div>
                          {course.isTrending && (
                            <span className="bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs font-medium">
                              <span className="hidden sm:inline">Trending</span>
                              <span className="sm:hidden">Hot</span>
                            </span>
                          )}
                          {course.isUpcoming && (
                            <span className="bg-green-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs font-medium">
                              <span className="hidden sm:inline">Starting Soon</span>
                              <span className="sm:hidden">Soon</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Course Content - Responsive padding and text sizes */}
                      <div className="p-3 sm:p-4 lg:p-5 flex flex-col flex-grow">
                        <div className="flex items-center justify-between mb-1 sm:mb-2">
                          <span className="text-xs text-gray-500">
                            {course.categories[0]}
                          </span>
                        </div>

                        {/* Title - Responsive sizing with consistent height */}
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] lg:min-h-[3.5rem] flex items-start">
                          <span className="line-clamp-2">{course.title}</span>
                        </h3>

                        {/* Subtitle - Responsive sizing with consistent height */}
                        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] flex items-start flex-grow">
                          <span className="line-clamp-2">{course.subtitle}</span>
                        </p>

                        {/* Course Info - Responsive sizing */}
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
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="text-gray-400 mb-4">
                  <BookOpen size={48} className="mx-auto sm:w-16 sm:h-16" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                  No courses found
                </h3>
                <p className="text-sm sm:text-base text-gray-500">
                  Try adjusting your search criteria or browse different
                  categories.
                </p>
              </div>
            )}

            {/* Pagination - Responsive */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                <button
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} className="mr-1" />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </button>

                {renderPagination().map((page, index) =>
                  page === "ellipsis" ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-500"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-200 ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
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
                  className="flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight size={14} className="ml-1" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoursesPage;