import { Calendar, MapPin, Clock, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import SeoHelmet from "../components/seo/SeoHelmet";

const OurWorksPage = () => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 12; // Changed from 6 to 12
  // Sample project data
  const projects = [
    {
      id: 1,
      title: "Data Driven decisions service at CAN Info tech",
      date: "2024",
      location: "Kathmandu, Nepal",
      duration: "5 days",
      category: "Government",
      image: "/landing-page-images/CAN_Exhibition.webp",
      width: 2048,
      height: 1365
    },
    {
      id: 2,
      title: "Data Analysis Training Central Campus of Technology, TU",
      date: "2025",
      location: "Hattisar, Dharan",
      duration: "3 Days",
      category: "Microbiology",
      image: "/landing-page-images/CentralCampusofTechnology_Dharan_2.webp",
      width: 3359,
      height: 2301
    },
    {
      id: 3,
      title: "Income Generation using Data Analysis to Youths of Parbat",
      date: "2025",
      location: "Lumle, Kaski, Nepal",
      duration: "2 days",
      category: "Traning",
      image: "/landing-page-images/Lumle_Kaski.webp",
      width: 3051,
      height: 1373
    },
    {
      id: 4,
      title: "Data Analysis Training for Department of Agriculture",
      date: "2025",
      location: "Hariharbhawan, Lalipur, Nepal",
      duration: "One Month",
      category: "Education",
      image: "/landing-page-images/Deapartment_of_Agriculture.webp",
      width: 4096,
      height: 2304
    },
    {
      id: 5,
      title: "Research & Development Service at Janakpur Engineering College",
      date: "2025",
      location: "Tathali, Bhaktapur Nepal",
      duration: "3 months",
      category: "Research",
      image: "/landing-page-images/Research & Development Service at Janakpur Engineering College.webp",
      width: 6192,
      height: 4128
    },
    {
      id: 6,
      title: "Data Collection Software Training at Tilganga Institute of Opthalmology",
      date: "2025",
      location: "Kathmandu, Nepal",
      duration: "1 Day",
      category: "Capacity Development",
      image: "/landing-page-images/tilganga2.webp",
      width: 1280,
      height: 960
    },
    {
      id: 7,
      title: "Data Analysis Training at IOE Pulchowk Campus",
      date: "2024",
      location: "Pulchowk, Lalitpur, Nepal",
      duration: "5 days",
      category: "Training",
      image: "/landing-page-images/IOE_Pulchowk.webp",
      width: 2048,
      height: 1152
    },
    {
      id: 8,
      title: "Onsite Training on Data Analysis at PB Group Office",
      date: "2024",
      location: "Pulchowk, Lalitpur, Nepal",
      duration: "1 Month",
      category: "Education",
      image: "/landing-page-images/onsite_DataAnalysisTraining.webp",
      width: 1280,
      height: 720
    },
    {
      id: 9,
      title: "Survey Software & Mobile App Training to Red Panda Network",
       date: "2024",
      location: "Taplejung,Nepal",
      duration: "3 Months",
      category: "Research",
      image: "/landing-page-images/Redpanda.webp",
      width: 1600,
      height: 900
    },
    {
      id: 10,
      title: "Hands on Training on IBM SPSS & STATA for Nepal Netra Jyoti Sangh",
      date: "2024",
      location: "Tripureshwor, Kathmandu, Nepal",
      duration: "2 days",
      category: "Capacity Development",
      image: "/landing-page-images/NepalNetraJyotiSangh2.webp",
      width: 1600,
      height: 720
    },
    {
      id: 11,
      title: "Data Analysis Traning at iDE",
      date: " 2023",
      location: "Jhamsikhel, Lalitpur",
      duration: "2 Weeks",
      category: "Training",
      image: "/landing-page-images/IDE.webp",
      width: 1600,
      height: 1200
    },
    {
      id: 12,
      title: "Digital Profile Development at Badimalika Municipality",
      date: "2023",
      location: "Bajura, Nepal",
      duration: "6 Months",
      category: "Profile",
      image: "/landing-page-images/badimalika.webp",
      width: 2000,
      height: 1600
    },
  ];

  // Pagination logic
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const currentProjects = projects.slice(startIndex, startIndex + projectsPerPage);

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setExpandedCard(null);
    // Scroll to top of the gallery
    document.querySelector('.top-starter')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleDetails = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <SeoHelmet
  title="PB Group | Our Works & Data Analytics Projects in Nepal"
  description="Explore PB Group's portfolio of projects in research, data analytics, and IT solutions. See how we have delivered impactful solutions for government, educational institutions, and organizations across Nepal."
  image="/landing-page-images/our-works-hero.webp"
  url="https://pbg.com.np/our-works"
/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
          <div className="top-starter">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-blue-600">Works</span>
          </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            A showcase of our impactful projects across Nepal
          </p>
          </div>
          
        </div>

        {/* Projects Gallery */}
        <div className="gallery-container">
          {/* Masonry Layout */}
          <div className="columns-2 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 sm:gap-6 space-y-3 sm:space-y-6">
            {currentProjects.map((project, index) => (
              <div
                key={project.id}
                className="group break-inside-avoid bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <img 
                    loading="lazy"
                    decoding="auto"
                    src={project.image}
                    alt={project.title}
                    width={project.width}
                    height={project.height}
                    className={`w-full object-cover transition-all duration-300 ${
                      index % 4 === 0 ? 'h-32 sm:h-48' :
                      index % 4 === 1 ? 'h-36 sm:h-56' :
                      index % 4 === 2 ? 'h-28 sm:h-40' : 'h-34 sm:h-52'
                    }`}
                  />
                </div>

                {/* Content Area - Fixed Mobile Display */}
                <div className="p-3 sm:p-4">
                  {/* Desktop Hover Effect */}
                  <div className="hidden sm:block relative h-24 overflow-hidden">
                    {/* Default View (Title + Category) */}
                    <div className="absolute inset-0 flex flex-col justify-center transition-transform duration-300 ease-out group-hover:-translate-y-full">
                      <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 mb-2">
                        {project.title}
                      </h3>
                    </div>

                    {/* Hover Details View */}
                    <div className="absolute inset-0 bg-white transform translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 flex flex-col justify-center">
                      <div className="space-y-2 text-xs text-gray-700">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-2 text-blue-600 flex-shrink-0" />
                          <span className="font-semibold text-gray-800">{project.date}</span>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="w-3 h-3 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="leading-tight">{project.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-2 text-purple-600 flex-shrink-0" />
                          <span className="font-semibold text-gray-800">{project.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="sm:hidden">
                    <h3 className="font-bold text-gray-900 text-xs leading-tight line-clamp-2 mb-2">
                      {project.title}
                    </h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full inline-block mb-3">
                      {project.category}
                    </span>

                    {/* More Info Button */}
                    <button
                      onClick={() => toggleDetails(project.id)}
                      className="flex items-center justify-between w-full py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-700 transition-colors"
                    >
                      <span>More Info</span>
                      {expandedCard === project.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {/* Expandable Details */}
                    {expandedCard === project.id && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-2 text-xs text-gray-700">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-2 text-blue-600 flex-shrink-0" />
                          <span className="font-semibold text-gray-800">{project.date}</span>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="w-3 h-3 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="leading-tight">{project.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-2 text-purple-600 flex-shrink-0" />
                          <span className="font-semibold text-gray-800">{project.duration}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8 sm:mt-12">
              <button
                onClick={() =>
                  handlePageChange(Math.max(currentPage - 1, 1))
                }
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </button>

              {renderPagination().map((page, index) =>
                page === "ellipsis" ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-3 py-2 text-gray-500"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
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
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OurWorksPage;