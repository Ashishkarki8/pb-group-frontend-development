import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const OurClients = () => {
  const clientLogos = [
    {
      name: "BFI",
      src: "/clients&partners/BFI.webp",
      alt: "BFI - Banking and Financial Institution logo",
      width: 481,
      height: 481,
    },
    {
      name: "Genebank",
      src: "/clients&partners/Genebank.webp",
      alt: "National Genebank of Nepal logo",
      width: 119,
      height: 100,
    },
    {
      name: "iDE Global Solutions",
      src: "/clients&partners/iDE_Global_Solutions.webp",
      alt: "iDE Global Solutions - International Development Enterprise logo",
      width: 1197,
      height: 628,
    },
    {
      name: "KUKL",
      src: "/clients&partners/KUKL.webp",
      alt: "KUKL - Kathmandu Upatyaka Khanepani Limited logo",
      width: 302,
      height: 89,
    },
    {
      name: "kulkln",
      src: "/clients&partners/kulkln.webp",
      alt: "Kathmandu University logo",
      width: 568,
      height: 569,
    },
    {
      name: "nnjs",
      src: "/clients&partners/nnjs.webp",
      alt: "Nepal Netra Jyoti Sangh logo",
      width: 225,
      height: 225,
    },
    {
      name: "Red Panda Network",
      src: "/clients&partners/redpandanetwork.webp",
      alt: "Red Panda Network conservation organization logo",
      width: 234,
      height: 215,
    },
    {
      name: "RERP SAMRIDDHI",
      src: "/clients&partners/RERP_SAMRIDDHI.webp",
      alt: "RERP SAMRIDDHI - Rural Enterprise and Remittance Project logo",
      width: 301,
      height: 306,
    },
    {
      name: "Seto Gurans NCDS",
      src: "/clients&partners/SetoGurans_NCDS.webp",
      alt: "Seto Gurans National Center for Diabetes and Endocrinology logo",
      width: 1583,
      height: 1583,
    },
    {
      name: "SMCRF",
      src: "/clients&partners/SMCRF.webp",
      alt: "SMCRF - Shree Medical and Technical College logo",
      width: 200,
      height: 200,
    },
  ];

  // Duplicate the logos array to create seamless infinite scroll
  const duplicatedLogos = [...clientLogos, ...clientLogos];

  return (
    <>
      {/* Move styles to head using a regular style tag */}
      <style>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-slide {
          animation: slide 30s linear infinite;
        }

        /* Pause animation on hover for better UX */
        .animate-slide:hover {
          animation-play-state: paused;
        }

        /* Hide scrollbars */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Responsive adjustments for mobile */
        @media (max-width: 640px) {
          .animate-slide {
            animation-duration: 15s;
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .animate-slide {
            animation-duration: 20s;
          }
        }
      `}</style>

      <section className="py-11 lg:py-12 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
              Our Clients and
              <span className="text-blue-600"> Partners</span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We proudly collaborate with our clients, partners, donors, and
              collaborators to deliver data-driven research, analytics & ICT
              solutions.
            </p>
            <div className="text-center mt-3">
              <div className="inline-flex items-center px-6 py-2 bg-blue-50 rounded-full">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-700 font-semibold">
                    Trusted by 50+ Organizations Worldwide
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sliding Logos Container */}
        <div className="relative mb-10 lg:mb-12">
          {/* Sliding container */}
          <div className="flex animate-slide space-x-4 sm:space-x-6 lg:space-x-10">
            {duplicatedLogos.map((client, index) => (
              <div
                key={`${client.name}-${index}`}
                className="
            flex-shrink-0 group flex items-center justify-center 
            p-3 sm:p-5 
            bg-white rounded-xl shadow-sm hover:shadow-lg 
            transition-all duration-300 hover:scale-105
            w-[40%] sm:w-[25%] lg:w-[15%] 
            h-24 sm:h-28 lg:h-28
          "
              >
                <img
                  src={client.src}
                  alt={client.alt}
                  width={client.width}
                  height={client.height}
                  loading="lazy"
                  decoding="auto"
                  className="w-full h-14 sm:h-20 lg:h-20 object-contain transition-all duration-300"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* See More Button */}
        <div className="text-center">
          <Link to="/clients-partners">
            <button className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl group">
              <span>View All Partners</span>
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default OurClients;
