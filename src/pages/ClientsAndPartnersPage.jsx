import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Users,
  Building2,
  Award,
  Star,
} from "lucide-react";
import SeoHelmet from "../components/seo/SeoHelmet";

const AllClientsPartners = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 24;

  // Scroll to top when component mounts or page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const allClients = [
    {
      id: 1,
      name: "BFI",
      src: "/clients&partners/BFI.webp",
      alt: "BFI - Banking and Financial Institution logo",
      width: 481,
      height: 481,
    },
    {
      id: 2,
      name: "Genebank",
      src: "/clients&partners/Genebank.webp",
      alt: "National Genebank of Nepal logo",
      width: 119,
      height: 100,
    },
    {
      id: 3,
      name: "iDE Global Solutions",
      src: "/clients&partners/iDE_Global_Solutions.webp",
      alt: "iDE Global Solutions - International Development Enterprise logo",
      width: 1197,
      height: 628,
    },
    {
      id: 4,
      name: "Kathmandu Upatyaka Khanepani Limited",
      src: "/clients&partners/KUKL.webp",
      alt: "KUKL - Kathmandu Upatyaka Khanepani Limited logo",
      width: 302,
      height: 89,
    },

    {
      id: 5,
      name: "Krishi Bibhag",
      src: "/clients&partners/RERP_SAMRIDDHI.webp",
      alt: "Krishi bibhag",
      width: 200,
      height: 200,
    },
   {
      id: 6,
      name: "Nepal Netra Jyoti Sangh",
      src: "/clients&partners/nnjs.webp",
      alt: "Nepal Netra Jyoti Sangh logo",
      width: 225,
      height: 225,
    },
    {
      id: 7,
      name: "Red Panda Network",
      src: "/clients&partners/redpandanetwork.webp",
      alt: "Red Panda Network conservation organization logo",
      width: 234,
      height: 215,
    },
    {
      id: 8,
      name: "RERP SAMRIDDHI",
      src: "/clients&partners/RERP_SAMRIDDHI.webp",
      alt: "RERP SAMRIDDHI - Rural Enterprise and Remittance Project logo",
      width: 301,
      height: 306,
    },
    {
      id: 9,
      name: "Seto Gurans NCDS",
      src: "/clients&partners/SetoGurans_NCDS.webp",
      alt: "Seto Gurans National Center for Diabetes and Endocrinology logo",
      width: 1583,
      height: 1583,
    },
    {
      id: 10,
      name: "SMCRF",
      src: "/clients&partners/SMCRF.webp",
      alt: "SMCRF - Shree Medical and Technical College logo",
      width: 200,
      height: 200,
    },
    {
      id: 11,
      name: "Badimalika Municipality",
      src: "/clients&partners/RERP_SAMRIDDHI.webp",
      alt: "Badimalika Municipality",
      width: 200,
      height: 200,
    },
     {
      id: 12,
      name: "DoECE IOE Pulchowk Campus",
      src: "/clients&partners/IOE_Pulchowk_Campus.webp",
      alt: "IOE Pulchowk Campus",
      width: 290,
      height: 343,
    },
    
  ];

  const totalPages = Math.ceil(allClients.length / clientsPerPage);
  const currentClients = allClients.slice(
    (currentPage - 1) * clientsPerPage,
    currentPage * clientsPerPage
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
    <div className="min-h-screen bg-gray-50">
      <SeoHelmet
        title="PB Group | Trusted Clients & Partners in Data Analytics and IT Solutions"
        description="PB Group proudly collaborates with leading organizations, NGOs, and institutions in Nepal and beyond, delivering data-driven research, analytics, and IT solutions. Explore our valued clients and partners."
        image="/clients&partners/iDE_Global_Solutions.webp"
        url=" https://pbg.com.np/clients-partners"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-5">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-blue-100 rounded-full mb-8">
            <Globe className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-blue-700 font-semibold">Our Network</span>
          </div>

         {/*  <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6">
           Trusted By Clients & <span className="text-blue-600">Partners</span>
          </h1>
 */}
  <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6">
           Trusted  <span className="text-blue-600">By</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
            Discover our extensive network of trusted clients and partners who
            collaborate with us to deliver exceptional data-driven solutions and
            innovative technology services.
          </p>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 px-6 mb-16">
          {currentClients.map((client) => (
            <div
              key={client.id}
              className="group bg-white rounded-xl shadow-md border border-gray-100 flex flex-col items-center p-6 
                         transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
            >
              {/* Logo */}
              <div className="h-28 flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-100">
                <img
                  src={client.src}
                  alt={client.alt}
                  width={client.width}
                  height={client.height}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9IiNFNUU1RTUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPg==";
                  }}
                />
              </div>

              {/* Name */}
              <h3 className="text-center text-lg font-semibold text-gray-800 transition-colors duration-500 group-hover:text-blue-600">
                {client.name}
              </h3>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center px-6 py-3 text-sm font-medium text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <ChevronLeft size={18} className="mr-2" />
              Previous
            </button>

            {renderPagination().map((page, index) =>
              page === "ellipsis" ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-4 py-3 text-gray-400 font-medium"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-5 py-3 text-sm font-bold rounded-xl transition-all duration-300 shadow-sm hover:shadow-md ${
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
              className="flex items-center px-6 py-3 text-sm font-medium text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Next
              <ChevronRight size={18} className="ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllClientsPartners;
