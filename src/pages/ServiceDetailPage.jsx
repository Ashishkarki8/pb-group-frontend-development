


// import { Loader2, MapPin } from "lucide-react";
// import { useEffect, useMemo, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import AnimationStyles from "../components/common/AnimationStyles.jsx";
// import Modal from "../components/Modal.jsx";
// import SeoHelmet from "../components/seo/SeoHelmet.jsx";
// import ContactSidebar from "../components/service-sections/sidebar/ContactSidebar.jsx";
// import RelatedItems from "../components/service-sections/sidebar/RelatedItems.jsx";
// import { services } from "../data/services.js";
// import { useScrollAnimation } from "../hooks/useScrollAnimation.js";
// import FeatureList from "../components/service-sections/FeatureList.jsx";
// import HeroSection from "../components/service-sections/HeroSection.jsx";

// const ServiceDetailPage = () => {
//   const { slug } = useParams();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentService, setCurrentService] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const { observeElement, isVisible } = useScrollAnimation();

//   // Find service
//   useEffect(() => {
//     const findService = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);

//         const service = services.find((s) => s.slug === slug);

//         if (service) {
//           setCurrentService(service);
//         } else {
//           setError("Service not found");
//         }
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load service");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (slug) findService();
//   }, [slug]);

//   // Similar services
//   const similarServices = useMemo(
//     () =>
//       services
//         .filter((service) => service.slug !== slug)
//         .map((service) => ({
//           ...service,
//           url: `/services/${service.slug}`,
//           description: service.cardDescription,
//         })),
//     [slug]
//   );

//   const isTraining = currentService?.title === "Capacity Building Training";
//   const buttonText = isTraining ? "Get Registered" : "Get consultation";
//   const sidebarButtonText = isTraining
//     ? "Send Inquiry"
//     : "Schedule Consultation";
//   const overviewTitle = isTraining ? "Training Overview" : "Service Overview";

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   if (error || !currentService) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-center">
//         <div>
//           <h2 className="text-2xl font-bold mb-4">
//             {error || "Service Not Found"}
//           </h2>
//           <Link
//             to="/"
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//           >
//             Return Home
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const IconComponent = currentService.icon;

//   return (
//     <div className="min-h-screen bg-white">
//       <SeoHelmet
//         title={`PB Group | ${currentService.title}`}
//         description={currentService.subtitle}
//         image={currentService.heroImage}
//         url={`https://pbg.com.np/services/${currentService.slug}`}
//       />

//       <AnimationStyles />

//       <HeroSection
//         title={currentService.title}
//         subtitle={currentService.subtitle}
//         gradientClasses={currentService.color}
//         icon={IconComponent}
//         image={currentService.heroImage}
//         imageAlt={`${currentService.title} illustration`}
//         imageWidth={currentService.width || 600}
//         imageHeight={currentService.height || 400}
//         additionalInfo={
//           isTraining && (
//             <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
//               <MapPin className="w-4 h-4" />
//               <span>Kathmandu & Lalitpur, Nepal</span>
//             </div>
//           )
//         }
//         actions={
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:scale-105 transition"
//           >
//             {buttonText}
//           </button>
//         }
//       />

//       <div className="max-w-7xl mx-auto px-4 py-12">
//         <div className="grid lg:grid-cols-3 gap-12">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-12">
//             <section
//               ref={(el) => observeElement(el, "overview")}
//               className={`space-y-6 opacity-0 ${
//                 isVisible("overview") ? "animate-fade-up" : ""
//               }`}
//             >
//               <h2 className="text-2xl font-bold">{overviewTitle}</h2>

//               <p className="text-lg text-gray-700 leading-relaxed text-justify">
//                 {currentService.description}
//               </p>

//               {currentService?.researchTypes && (
//                 <FeatureList
//                   title="Key Features"
//                   features={currentService.researchTypes}
//                   variant="simple"
//                 />
//               )}
//             </section>

//             {currentService?.serviceFeatures && (
//               <FeatureList
//                 title="What's Included"
//                 features={currentService.serviceFeatures}
//                 variant="detailed"
//               />
//             )}
//           </div>

//           {/* Sidebar */}
//           <div
//             ref={(el) => observeElement(el, "sidebar")}
//             className={`space-y-8 opacity-0 ${
//               isVisible("sidebar") ? "animate-fade-right" : ""
//             }`}
//           >
//             <ContactSidebar
//               title="Ready to Get Started?"
//               description={`Let's discuss how our ${currentService.title.toLowerCase()} can help your business grow.`}
//               buttonText={sidebarButtonText}
//               onButtonClick={() => setIsModalOpen(true)}
//             />

//             <RelatedItems
//               items={similarServices}
//               title="Related Services"
//               itemsPerPage={4}
//             />
//           </div>
//         </div>
//       </div>

//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//         <iframe
//           src={
//             isTraining
//               ? "TRAINING_FORM_URL"
//               : "CONSULTATION_FORM_URL"
//           }
//           className="w-full h-[75vh]"
//           title="Contact Form"
//           loading="lazy"
//         />
//       </Modal>
//     </div>
//   );
// };

// export default ServiceDetailPage;





//with backend fetch but  it has a error of not showing the data of service details when data becomes stale

import { Loader2, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationStyles from "../components/common/AnimationStyles.jsx";
import Modal from "../components/Modal.jsx";
import SeoHelmet from "../components/seo/SeoHelmet.jsx";
import ContactSidebar from "../components/service-sections/sidebar/ContactSidebar.jsx";
import RelatedItems from "../components/service-sections/sidebar/RelatedItems.jsx";
import { useScrollAnimation } from "../hooks/useScrollAnimation.js";
import FeatureList from "../components/service-sections/FeatureList.jsx";
import HeroSection from "../components/service-sections/HeroSection.jsx";
import { useServiceBySlug, useActiveServices } from "../hooks/useService";

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
 const { observeElement, isVisible } = useScrollAnimation({}, [slug]); // ✅ Reset on slug change

  // ✅ Fetch current service details (uses cache if prefetched)
  const {
    data: currentService,
    isLoading,
    error,
  } = useServiceBySlug(slug);

  // ✅ Fetch all active services (reuse home page cache!)
  const { data: allServices = [] } = useActiveServices({ 
    showOnHomepage: true 
  });

  // ✅ Similar services = all services except current one
  const similarServices = useMemo(() => {
    if (!allServices || !currentService) return [];
    
    return allServices
      .filter((service) => service.slug !== slug)
      .map((service) => ({
        ...service,
        url: `/services/${service.slug}`,
        description: service.cardDescription,
      }));
  }, [allServices, slug, currentService]);

  // ✅ Dynamic text based on service type
  const isTraining = currentService?.title === "Capacity Building Training";
  const buttonText = isTraining ? "Get Registered" : "Get consultation";
  const sidebarButtonText = isTraining
    ? "Send Inquiry"
    : "Schedule Consultation";
  const overviewTitle = isTraining ? "Training Overview" : "Service Overview";

  // ============================================
  // LOADING STATE
  // ============================================
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // ============================================
  // ERROR / NOT FOUND STATE
  // ============================================
  if (error || !currentService) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {error?.message || "Service Not Found"}
          </h2>
          <Link
            to="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Get icon component (already mapped in TanStack Query)
  const IconComponent = currentService.icon;

  return (
    <div className="min-h-screen bg-white">
      {/* ============================================ */}
      {/* SEO META TAGS */}
      {/* ============================================ */}
      <SeoHelmet
        title={currentService.seo?.metaTitle || `PB Group | ${currentService.title}`}
        description={currentService.seo?.metaDescription || currentService.subtitle}
        keywords={currentService.seo?.metaKeywords?.join(", ")}
        image={currentService.heroImage?.url}
        url={`https://pbg.com.np/services/${currentService.slug}`}
      />

      <AnimationStyles />

      {/* ============================================ */}
      {/* HERO SECTION */}
      {/* ============================================ */}
      <HeroSection
        title={currentService.title}
        subtitle={currentService.subtitle}
        gradientClasses="from-blue-600 to-purple-600"
        icon={IconComponent}
        image={currentService.heroImage?.url}
        imageAlt={`${currentService.title} illustration`}
        imageWidth={currentService.heroImage?.width || 600}
        imageHeight={currentService.heroImage?.height || 400}
        additionalInfo={
          isTraining && (
            <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
              <MapPin className="w-4 h-4" />
              <span>Kathmandu & Lalitpur, Nepal</span>
            </div>
          )
        }
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:scale-105 transition"
          >
            {buttonText}
          </button>
        }
      />

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* LEFT COLUMN - Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Service Overview */}
            <section
              ref={(el) => observeElement(el, "overview")}
              className={`space-y-6 opacity-0 ${
                isVisible("overview") ? "animate-fade-up" : ""
              }`}
            >
              <h2 className="text-2xl font-bold">{overviewTitle}</h2>

              <p className="text-lg text-gray-700 leading-relaxed text-justify">
                {currentService.description}
              </p>

              {/* Key Features (researchTypes) */}
              {currentService?.researchTypes && (
                <FeatureList
                  title="Key Features"
                  features={currentService.researchTypes}
                  variant="simple"
                />
              )}
            </section>

            {/* What's Included (whatsIncluded with icons) */}
            {currentService?.whatsIncluded && currentService.whatsIncluded.length > 0 && (
              <section
                ref={(el) => observeElement(el, "whats-included")}
                className={`opacity-0 ${
                  isVisible("whats-included") ? "animate-fade-up" : ""
                }`}
              >
                <h2 className="text-2xl font-bold mb-6">What's Included</h2>
                <div className="space-y-6">
                  {currentService.whatsIncluded.map((item, index) => {
                    const ItemIcon = item.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                      >
                        {ItemIcon && (
                          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <ItemIcon size={24} className="text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 mb-2">
                            {item.title}
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Service Features (if different from whatsIncluded) */}
            {currentService?.serviceFeatures && (
              <FeatureList
                title="Service Highlights"
                features={currentService.serviceFeatures}
                variant="detailed"
              />
            )}
          </div>

          {/* RIGHT COLUMN - Sidebar */}
          <div
            ref={(el) => observeElement(el, "sidebar")}
            className={`space-y-8 opacity-0 ${
              isVisible("sidebar") ? "animate-fade-right" : ""
            }`}
          >
            {/* Contact Sidebar */}
            <ContactSidebar
              title="Ready to Get Started?"
              description={`Let's discuss how our ${currentService.title.toLowerCase()} can help your business grow.`}
              buttonText={sidebarButtonText}
              onButtonClick={() => setIsModalOpen(true)}
            />

            {/* Similar Services (using cached data!) */}
            {similarServices.length > 0 && (
              <RelatedItems
                items={similarServices}
                title="Related Services"
                itemsPerPage={4}
              />
            )}
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* MODAL */}
      {/* ============================================ */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <iframe
          src={
            isTraining
              ? "TRAINING_FORM_URL"
              : "CONSULTATION_FORM_URL"
          }
          className="w-full h-[75vh]"
          title="Contact Form"
          loading="lazy"
        />
      </Modal>
    </div>
  );
};

export default ServiceDetailPage;








//it works for service overview whats included etc 
// import { Loader2, MapPin } from "lucide-react";
// import { useMemo, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import Modal from "../components/Modal.jsx";
// import SeoHelmet from "../components/seo/SeoHelmet.jsx";
// import ContactSidebar from "../components/service-sections/sidebar/ContactSidebar.jsx";
// import RelatedItems from "../components/service-sections/sidebar/RelatedItems.jsx";
// import FeatureList from "../components/service-sections/FeatureList.jsx";
// import HeroSection from "../components/service-sections/HeroSection.jsx";
// import { useServiceBySlug, useActiveServices } from "../hooks/useService";

// const ServiceDetailPage = () => {
//   const { slug } = useParams();
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // ✅ Fetch current service details
//   const {
//     data: currentService,
//     isLoading,
//     error,
//   } = useServiceBySlug(slug);

//   // ✅ Fetch all active services
//   const { data: allServices = [] } = useActiveServices({
//     showOnHomepage: true,
//   });

//   // ✅ Similar services = all services except current one
//   const similarServices = useMemo(() => {
//     if (!allServices || !currentService) return [];

//     return allServices
//       .filter((service) => service.slug !== slug)
//       .map((service) => ({
//         ...service,
//         url: `/services/${service.slug}`,
//         description: service.cardDescription,
//       }));
//   }, [allServices, slug, currentService]);

//   // ✅ Dynamic text based on service type
//   const isTraining = currentService?.title === "Capacity Building Training";
//   const buttonText = isTraining ? "Get Registered" : "Get consultation";
//   const sidebarButtonText = isTraining
//     ? "Send Inquiry"
//     : "Schedule Consultation";
//   const overviewTitle = isTraining ? "Training Overview" : "Service Overview";

//   // ============================================
//   // LOADING STATE
//   // ============================================
//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   // ============================================
//   // ERROR / NOT FOUND STATE
//   // ============================================
//   if (error || !currentService) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-center">
//         <div>
//           <h2 className="text-2xl font-bold mb-4">
//             {error?.message || "Service Not Found"}
//           </h2>
//           <Link
//             to="/"
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//           >
//             Return Home
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   // ✅ Get icon component
//   const IconComponent = currentService.icon;

//   return (
//     <div className="min-h-screen bg-white">
//       {/* ============================================ */}
//       {/* SEO META TAGS */}
//       {/* ============================================ */}
//       <SeoHelmet
//         title={
//           currentService.seo?.metaTitle ||
//           `PB Group | ${currentService.title}`
//         }
//         description={
//           currentService.seo?.metaDescription || currentService.subtitle
//         }
//         keywords={currentService.seo?.metaKeywords?.join(", ")}
//         image={currentService.heroImage?.url}
//         url={`https://pbg.com.np/services/${currentService.slug}`}
//       />

//       {/* ============================================ */}
//       {/* HERO SECTION */}
//       {/* ============================================ */}
//       <HeroSection
//         title={currentService.title}
//         subtitle={currentService.subtitle}
//         gradientClasses="from-blue-600 to-purple-600"
//         icon={IconComponent}
//         image={currentService.heroImage?.url}
//         imageAlt={`${currentService.title} illustration`}
//         imageWidth={currentService.heroImage?.width || 600}
//         imageHeight={currentService.heroImage?.height || 400}
//         additionalInfo={
//           isTraining && (
//             <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
//               <MapPin className="w-4 h-4" />
//               <span>Kathmandu & Lalitpur, Nepal</span>
//             </div>
//           )
//         }
//         actions={
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:scale-105 transition"
//           >
//             {buttonText}
//           </button>
//         }
//       />

//       {/* ============================================ */}
//       {/* MAIN CONTENT */}
//       {/* ============================================ */}
//       <div className="max-w-7xl mx-auto px-4 py-12">
//         <div className="grid lg:grid-cols-3 gap-12">
//           {/* LEFT COLUMN - Main Content */}
//           <div className="lg:col-span-2 space-y-12">
//             {/* Service Overview */}
//             <section className="space-y-6">
//               <h2 className="text-2xl font-bold">{overviewTitle}</h2>

//               <p className="text-lg text-gray-700 leading-relaxed text-justify">
//                 {currentService.description}
//               </p>

//               {/* Key Features (researchTypes) */}
//               {currentService?.researchTypes && (
//                 <FeatureList
//                   title="Key Features"
//                   features={currentService.researchTypes}
//                   variant="simple"
//                 />
//               )}
//             </section>

//             {/* What's Included (whatsIncluded with icons) */}
//             {currentService?.whatsIncluded &&
//               currentService.whatsIncluded.length > 0 && (
//                 <section>
//                   <h2 className="text-2xl font-bold mb-6">What's Included</h2>
//                   <div className="space-y-6">
//                     {currentService.whatsIncluded.map((item, index) => {
//                       const ItemIcon = item.icon;
//                       return (
//                         <div
//                           key={index}
//                           className="flex items-start gap-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
//                         >
//                           {ItemIcon && (
//                             <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
//                               <ItemIcon size={24} className="text-white" />
//                             </div>
//                           )}
//                           <div className="flex-1">
//                             <h3 className="font-semibold text-lg text-gray-900 mb-2">
//                               {item.title}
//                             </h3>
//                             <p className="text-gray-700 leading-relaxed">
//                               {item.description}
//                             </p>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </section>
//               )}

//             {/* Service Features */}
//             {currentService?.serviceFeatures && (
//               <FeatureList
//                 title="Service Highlights"
//                 features={currentService.serviceFeatures}
//                 variant="detailed"
//               />
//             )}
//           </div>

//           {/* RIGHT COLUMN - Sidebar */}
//           <div className="space-y-8">
//             {/* Contact Sidebar */}
//             <ContactSidebar
//               title="Ready to Get Started?"
//               description={`Let's discuss how our ${currentService.title.toLowerCase()} can help your business grow.`}
//               buttonText={sidebarButtonText}
//               onButtonClick={() => setIsModalOpen(true)}
//             />

//             {/* Similar Services */}
//             {similarServices.length > 0 && (
//               <RelatedItems
//                 items={similarServices}
//                 title="Related Services"
//                 itemsPerPage={4}
//               />
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ============================================ */}
//       {/* MODAL */}
//       {/* ============================================ */}
//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//         <iframe
//           src={
//             isTraining ? "TRAINING_FORM_URL" : "CONSULTATION_FORM_URL"
//           }
//           className="w-full h-[75vh]"
//           title="Contact Form"
//           loading="lazy"
//         />
//       </Modal>
//     </div>
//   );
// };

// export default ServiceDetailPage;
