// import { getIconComponent } from "../utils/iconMapping";
// import { memo, useEffect, useRef, useState, useMemo } from "react";
// import { Link } from "react-router-dom";
// import Pagination from "./common/Pagination";
// import { useScrollAnimation } from "../hooks/useScrollAnimation";
// import AnimationStyles from "./common/AnimationStyles";

// // ==============================
// // Color Pattern Function
// // ==============================
// const getGradientByIndex = (index) => {
//   const patterns = [
//     "from-blue-600 to-blue-800",
//     "from-sky-400 to-sky-800",
//     "from-blue-400 to-blue-800",
//   ];
//   return patterns[index % patterns.length];
// };

// // ==============================
// // Text Formatter
// // ==============================
// const formatTextWithLineBreaks = (text) => {
//   if (!text) return null;
//   return text.split(/\r\n|\n/).map((line, index, arr) => (
//     <span key={index}>
//       {line}
//       {index < arr.length - 1 && <br />}
//     </span>
//   ));
// };

// // ==============================
// // Service Card (Clean Animation)
// // ==============================
// const ServiceCard = memo(({ service, index, observeElement, isVisible }) => {
//   const IconComponent = getIconComponent(service.iconName);

//   return (
//     <Link
//       to={`/services/${service.slug}`}
//       className="h-full group"
//       ref={(el) => observeElement(el, `service-card-${index}`)}
//       aria-label={`Learn more about ${service.title}`}
//     >
//       <div
//         className={`relative overflow-hidden rounded-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl h-full flex flex-col will-change-transform opacity-0 ${
//           isVisible(`service-card-${index}`) ? "animate-fade-up" : ""
//         }`}
//         style={{ animationDelay: `${index * 100}ms` }}
//       >
//         <div
//           className={`absolute inset-0 bg-gradient-to-br ${getGradientByIndex(index)} opacity-90`}
//         />

//         <div className="relative p-8 text-white flex flex-col flex-grow z-10">
//           <div className="mb-6">
//             <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm transition-colors duration-300 group-hover:bg-white/30">
//               <IconComponent size={32} className="text-white" />
//             </div>
//           </div>

//           <h3 className="text-2xl font-bold mb-4">
//             {service.title}
//           </h3>

//           <div className="text-white/90 leading-relaxed flex-grow text-justify">
//             {formatTextWithLineBreaks(service.cardDescription)}
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// });

// ServiceCard.displayName = "ServiceCard";

// // ==============================
// // Main Section
// // ==============================
// const OurServices = ({
//   services = [],
//   isLoading = false,
//   itemsPerPage = 6,
// }) => {
//   const { observeElement, isVisible } = useScrollAnimation();
//   const [currentPage, setCurrentPage] = useState(1);
//   const servicesRef = useRef(null);

//   const paginatedData = useMemo(() => {
//     const totalItems = services.length;
//     const totalPages = Math.ceil(totalItems / itemsPerPage);
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;

//     return {
//       currentItems: services.slice(startIndex, endIndex),
//       totalPages,
//       totalItems,
//       currentPage,
//     };
//   }, [services, currentPage, itemsPerPage]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [services]);

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//     requestAnimationFrame(() => {
//       servicesRef.current?.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     });
//   };

//   if (isLoading) {
//     return (
//       <section className="py-10 lg:py-14 bg-gradient-to-br from-slate-50 to-blue-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
//             {[...Array(6)].map((_, i) => (
//               <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-2xl" />
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <>
//       <AnimationStyles />

//       <section
//         ref={servicesRef}
//         className="py-10 lg:py-14 bg-gradient-to-br from-slate-50 to-blue-50"
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

//           {/* Header */}
//           <header
//             ref={(el) => observeElement(el, "section-header")}
//             className={`text-start mb-8 opacity-0 ${
//               isVisible("section-header") ? "animate-fade-up" : ""
//             }`}
//           >
//             <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 lg:mb-10">
//               What We Do
//             </h2>
//             <p className="text-xl text-center lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
//               Company offers innovative services that help businesses and communities harness
//               the power of information for sustainable growth and development.
//             </p>
//           </header>

//           {/* Service Grid */}
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
//             {paginatedData.currentItems.map((service, index) => (
//               <ServiceCard
//                 key={service._id || service.slug}
//                 service={service}
//                 index={index}
//                 observeElement={observeElement}
//                 isVisible={isVisible}
//               />
//             ))}
//           </div>

//           {/* Pagination */}
//           {paginatedData.totalPages > 1 && (
//             <div className="mt-12">
//               <Pagination
//                 currentPage={paginatedData.currentPage}
//                 totalPages={paginatedData.totalPages}
//                 onPageChange={handlePageChange}
//                 showItemCount={false}
//                 isLoading={false}
//                 variant="public"
//               />
//             </div>
//           )}

//           {/* Footer */}
//           <footer
//             ref={(el) => observeElement(el, "section-footer")}
//             className={`text-center mt-10 lg:mt-16 opacity-0 ${
//               isVisible("section-footer") ? "animate-fade-up" : ""
//             }`}
//           >
//             <p className="text-xl text-gray-700 max-w-5xl mx-auto leading-relaxed">
//               Provide high-quality, data-driven consultancy in research, analytics, and IT,
//               fostering business success and community development.
//             </p>
//           </footer>

//         </div>
//       </section>
//     </>
//   );
// };

// export default OurServices;











import {  useEffect, useRef, useState, useMemo } from "react";
import Pagination from "./common/Pagination";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import AnimationStyles from "./common/AnimationStyles";
import ServiceCard from "./Servicecard";


// ==============================
// Main Section
// ==============================
const OurServices = ({
  services = [],
  isLoading = false,
  itemsPerPage = 6,
}) => {
  const { observeElement, isVisible } = useScrollAnimation();
  const [currentPage, setCurrentPage] = useState(1);
  const servicesRef = useRef(null);

  const paginatedData = useMemo(() => {
    const totalItems = services.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return {
      currentItems: services.slice(startIndex, endIndex),
      totalPages,
      totalItems,
      currentPage,
    };
  }, [services, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [services]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    requestAnimationFrame(() => {
      servicesRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  if (isLoading) {
    return (
      <section className="py-10 lg:py-14 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <AnimationStyles />

      <section
        ref={servicesRef}
        className="py-10 lg:py-14 bg-gradient-to-br from-slate-50 to-blue-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <header
            ref={(el) => observeElement(el, "section-header")}
            className={`text-start mb-8 opacity-0 ${
              isVisible("section-header") ? "animate-fade-up" : ""
            }`}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 lg:mb-10">
              What We Do
            </h2>
            <p className="text-xl text-center lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Company offers innovative services that help businesses and communities harness
              the power of information for sustainable growth and development.
            </p>
          </header>

          {/* Service Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {paginatedData.currentItems.map((service, index) => (
              <ServiceCard
                key={service._id || service.slug}
                service={service}
                index={index}
                observeElement={observeElement}
                isVisible={isVisible}
              />
            ))}
          </div>

          {/* Pagination */}
          {paginatedData.totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={paginatedData.currentPage}
                totalPages={paginatedData.totalPages}
                onPageChange={handlePageChange}
                showItemCount={false}
                isLoading={false}
                variant="public"
              />
            </div>
          )}

          {/* Footer */}
          <footer
            ref={(el) => observeElement(el, "section-footer")}
            className={`text-center mt-10 lg:mt-16 opacity-0 ${
              isVisible("section-footer") ? "animate-fade-up" : ""
            }`}
          >
            <p className="text-xl text-gray-700 max-w-5xl mx-auto leading-relaxed">
              Provide high-quality, data-driven consultancy in research, analytics, and IT,
              fostering business success and community development.
            </p>
          </footer>

        </div>
      </section>
    </>
  );
};

export default OurServices;