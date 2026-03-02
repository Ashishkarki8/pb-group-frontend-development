// import { ArrowRight } from "lucide-react";
// import { useState, useCallback } from "react";
// import { Link } from "react-router-dom";
// import { useScrollAnimation } from "../../../hooks/useScrollAnimation";


// /**
//  * Reusable Related Items Component with Pagination
//  * @param {Object} props
//  * @param {Array} props.items - Array of items to display
//  * @param {string} props.title - Section title
//  * @param {number} props.itemsPerPage - Items per page (default: 4)
//  * @param {Function} props.renderItem - Custom render function for items
//  * @param {string} props.baseAnimationId - Base ID for animations
//  */
// const RelatedItems = ({
//   items = [],
//   title = "Related Items",
//   itemsPerPage = 4,
//   renderItem,
//   baseAnimationId = "related",
// }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const { observeElement, isVisible } = useScrollAnimation();

//   const totalPages = Math.ceil(items.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

//   const handlePageChange = useCallback((pageNumber, event) => {
//     event.preventDefault();
//     event.stopPropagation();
//     setCurrentPage(pageNumber);
//   }, []);

//   // Default render function
//   const defaultRenderItem = (item, index) => {
//     const ItemIcon = item.icon;
//     return (
//       <Link
//         key={item.slug || index}
//         to={item.url || `#${item.slug}`}
//         ref={(el) => observeElement(el, `${baseAnimationId}-${index}`)}
//         className={`flex items-center space-x-3 md:space-x-4 p-2 md:p-3 rounded-xl hover:bg-gray-50 transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-300 opacity-0 ${
//           isVisible(`${baseAnimationId}-${index}`)
//             ? `animate-fade-up animate-delay-${(index + 5) * 100}`
//             : ""
//         }`}
//         aria-label={`View ${item.title}`}
//       >
//         {ItemIcon && (
//           <div
//             className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br ${
//               item.color || "from-blue-500 to-blue-700"
//             } flex items-center justify-center flex-shrink-0`}
//           >
//             <ItemIcon size={16} className="text-white md:w-5 md:h-5" />
//           </div>
//         )}
//         <div className="flex-1 min-w-0">
//           <h4 className="font-semibold text-gray-900 text-xs md:text-sm truncate">
//             {item.title}
//           </h4>
//           {item.description && (
//             <p className="text-gray-600 text-xs line-clamp-2 mt-1">
//               {item.description.slice(0, 80)}...
//             </p>
//           )}
//         </div>
//         <ArrowRight
//           size={14}
//           className="text-gray-400 flex-shrink-0 group-hover:text-blue-600 transition-colors md:w-4 md:h-4"
//         />
//       </Link>
//     );
//   };

//   const itemRenderer = renderItem || defaultRenderItem;

//   return (
//     <div
//       ref={(el) => observeElement(el, `${baseAnimationId}-container`)}
//       className={`bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm opacity-0 ${
//         isVisible(`${baseAnimationId}-container`)
//           ? "animate-scale-in animate-delay-400"
//           : ""
//       }`}
//     >
//       <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">
//         {title}
//       </h3>

//       <div className="min-h-[400px] md:min-h-[450px] flex flex-col">
//         <div className="flex-1">
//           <div className="space-y-3 md:space-y-4">
//             {currentItems.map((item, index) => itemRenderer(item, index))}
//           </div>

//           {/* Empty space filler */}
//           {currentItems.length < itemsPerPage && (
//             <div className="space-y-3 md:space-y-4 mt-3 md:mt-4">
//               {Array.from({
//                 length: itemsPerPage - currentItems.length,
//               }).map((_, index) => (
//                 <div key={`empty-${index}`} className="h-16 md:h-20" />
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <nav
//             className="flex justify-center items-center mt-4 md:mt-6 pt-4 border-t border-gray-100"
//             aria-label="Pagination"
//           >
//             <div className="flex items-center space-x-1">
//               <button
//                 onClick={(e) => handlePageChange(Math.max(1, currentPage - 1), e)}
//                 disabled={currentPage === 1}
//                 className={`px-2 py-1 rounded text-sm transition-colors duration-200 ${
//                   currentPage === 1
//                     ? "text-gray-400 cursor-not-allowed"
//                     : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
//                 }`}
//                 aria-label="Previous page"
//               >
//                 ←
//               </button>

//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                 (pageNumber) => (
//                   <button
//                     key={pageNumber}
//                     onClick={(e) => handlePageChange(pageNumber, e)}
//                     className={`w-6 h-6 md:w-7 md:h-7 rounded text-xs font-medium transition-colors duration-200 ${
//                       currentPage === pageNumber
//                         ? "bg-blue-600 text-white"
//                         : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
//                     }`}
//                     aria-label={`Go to page ${pageNumber}`}
//                     aria-current={currentPage === pageNumber ? "page" : undefined}
//                   >
//                     {pageNumber}
//                   </button>
//                 )
//               )}

//               <button
//                 onClick={(e) =>
//                   handlePageChange(Math.min(totalPages, currentPage + 1), e)
//                 }
//                 disabled={currentPage === totalPages}
//                 className={`px-2 py-1 rounded text-sm transition-colors duration-200 ${
//                   currentPage === totalPages
//                     ? "text-gray-400 cursor-not-allowed"
//                     : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
//                 }`}
//                 aria-label="Next page"
//               >
//                 →
//               </button>
//             </div>
//           </nav>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RelatedItems;






import { ArrowRight } from "lucide-react";
import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "../../../hooks/useScrollAnimation";

/**
 * Reusable Related Items Component with Pagination
 * ✅ Optimized for services with icon components
 * 
 * @param {Object} props
 * @param {Array} props.items - Array of items to display
 * @param {string} props.title - Section title
 * @param {number} props.itemsPerPage - Items per page (default: 4)
 * @param {Function} props.renderItem - Custom render function for items
 * @param {string} props.baseAnimationId - Base ID for animations
 */
const RelatedItems = ({
  items = [],
  title = "Related Items",
  itemsPerPage = 4,
  renderItem,
  baseAnimationId = "related",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { observeElement, isVisible } = useScrollAnimation();

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = useCallback((pageNumber, event) => {
    event.preventDefault();
    event.stopPropagation();
    setCurrentPage(pageNumber);
  }, []);

  // ✅ Default render function for services
  const defaultRenderItem = (item, index) => {
    // ✅ Icon is already mapped in TanStack Query
    const ItemIcon = item.icon;
    
    return (
      <Link
        key={item.slug || index}
        to={item.url || `/services/${item.slug}`}
        ref={(el) => observeElement(el, `${baseAnimationId}-${index}`)}
        className={`flex items-center space-x-3 md:space-x-4 p-2 md:p-3 rounded-xl hover:bg-gray-50 transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-300 opacity-0 ${
          isVisible(`${baseAnimationId}-${index}`)
            ? `animate-fade-up animate-delay-${(index + 5) * 100}`
            : ""
        }`}
        aria-label={`View ${item.title}`}
      >
        {/* Icon */}
        {ItemIcon && (
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
            <ItemIcon size={16} className="text-white md:w-5 md:h-5" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-xs md:text-sm truncate">
            {item.title}
          </h4>
          {item.description && (
            <p className="text-gray-600 text-xs line-clamp-2 mt-1">
              {item.description.slice(0, 80)}...
            </p>
          )}
        </div>

        {/* Arrow */}
        <ArrowRight
          size={14}
          className="text-gray-400 flex-shrink-0 group-hover:text-blue-600 transition-colors md:w-4 md:h-4"
        />
      </Link>
    );
  };

  const itemRenderer = renderItem || defaultRenderItem;

  return (
    <div
      ref={(el) => observeElement(el, `${baseAnimationId}-container`)}
      className={`bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm opacity-0 ${
        isVisible(`${baseAnimationId}-container`)
          ? "animate-scale-in animate-delay-400"
          : ""
      }`}
    >
      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">
        {title}
      </h3>

      <div className="min-h-[400px] md:min-h-[450px] flex flex-col">
        <div className="flex-1">
          <div className="space-y-3 md:space-y-4">
            {currentItems.map((item, index) => itemRenderer(item, index))}
          </div>

          {/* Empty space filler */}
          {currentItems.length < itemsPerPage && (
            <div className="space-y-3 md:space-y-4 mt-3 md:mt-4">
              {Array.from({
                length: itemsPerPage - currentItems.length,
              }).map((_, index) => (
                <div key={`empty-${index}`} className="h-16 md:h-20" />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            className="flex justify-center items-center mt-4 md:mt-6 pt-4 border-t border-gray-100"
            aria-label="Pagination"
          >
            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => handlePageChange(Math.max(1, currentPage - 1), e)}
                disabled={currentPage === 1}
                className={`px-2 py-1 rounded text-sm transition-colors duration-200 ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
                aria-label="Previous page"
              >
                ←
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={(e) => handlePageChange(pageNumber, e)}
                    className={`w-6 h-6 md:w-7 md:h-7 rounded text-xs font-medium transition-colors duration-200 ${
                      currentPage === pageNumber
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                    aria-label={`Go to page ${pageNumber}`}
                    aria-current={currentPage === pageNumber ? "page" : undefined}
                  >
                    {pageNumber}
                  </button>
                )
              )}

              <button
                onClick={(e) =>
                  handlePageChange(Math.min(totalPages, currentPage + 1), e)
                }
                disabled={currentPage === totalPages}
                className={`px-2 py-1 rounded text-sm transition-colors duration-200 ${
                  currentPage === totalPages
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
  );
};

export default RelatedItems;