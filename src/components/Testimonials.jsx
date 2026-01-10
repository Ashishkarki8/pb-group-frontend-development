import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "./Modal"; // Import your Modal component

const TestimonialsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openTestimonial, setOpenTestimonial] = useState(null);

  const testimonials = [
    {
      id: 4,
      rating: 5,
      text: "The survey software provided by PB Group is easy to use, flexible, and very efficient. It helped us collect quality data and generate insightful reports in no time.",
      name: "Dr Tulshi Laxmi Suwal",
      position: "Program Coordinator",
      avatar: "testimonials-photos/Dr-Tulshi-Laxmi-Suwal.webp",
      avatarWidth: 719,
      avatarHeight: 552,
    },
    {
      id: 3,
      text: "Taught by an industry expert with over a decade of professional experience in data analysis and IT, we had a steep learning curve in a friendly environment. I highly recommend taking the 'R Programming' training from this institute if you are looking for it.",
      name: "Rajendra Senchuri",
      position: "Peace & Public Policy Trinity MPhil",
      avatar: "testimonials-photos/Rajendra Senchuri.webp",
      avatarWidth: 674,
      avatarHeight: 737,
    },
    {
      id: 5,
      rating: 5,
      text: "PB Group's mobile app development service exceeded our expectations. From planning to deployment, everything was handled professionally. Highly recommend their services!",
      name: "Dr. Mukunda Bhattarai",
      position: "Information Officer",
      avatar: "testimonials-photos/Munkunda-Bhattrai.webp",
      avatarWidth: 295,
      avatarHeight: 295,
    },
    {
      id: 6,
      rating: 5,
      text: "The R Programming training exceeded my expectations! The instructor explained complex topics in a very simple way, making learning enjoyable and effective. The hands-on approach and regular assessments helped me track my progress. Highly recommended for anyone serious about data analysis.",
      name: "Khagendra Saud",
      position: "Undersecretary",
      avatar: "testimonials-photos/Khagendra-Saud.webp",
      avatarWidth: 326,
      avatarHeight: 356,
    },
    {
      id: 7,
      rating: 5,
      text: "From start to finish, the training was well-organized and impactful. The instructor's decade-long expertise reflects in every lecture and exercise. PB Group not only teaches you the tools but also how to apply them effectively in real scenarios. Worth every bit of time and effort!",
      name: "Chandika Lama",
      position: "Agri- Economist",
      avatar: "testimonials-photos/chandika.webp",
      avatarWidth: 233,
      avatarHeight: 180,
    },
    {
      id: 2,
      text: "Their survey platform is powerful yet simple. We used it for multiple projects, and the response management system was outstanding. Highly recommended for organizations and researchers.",
      name: "Binod kumar bhattrai",
      position: "Deputy Director General",
      avatar: "testimonials-photos/Binod-kumar-bhattrai.webp",
      avatarWidth: 539,
      avatarHeight: 502,
    },
    {
      id: 1,
      text: "I found PB Group's R Programming course extremely valuable. The learning was interactive, and the instructors ensured no student was left behind. The balance between theory and practice was perfect. Definitely recommend this training to anyone interested in analytics and IT.",
      name: "Jigmey Lama",
      position: "M&E and Knowledge Management Specialist",
      avatar: "testimonials-photos/jigmey-lama.webp",
      avatarWidth: 674,
      avatarHeight: 739,
    },
  ];

  // Calculate items per slide
  const getItemsPerSlide = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }
    return 3;
  };

  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());

  useEffect(() => {
    const handleResize = () => setItemsPerSlide(getItemsPerSlide());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  return (
    <section className="bg-white py-10 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Fixed: Changed from h2 to h3 for proper heading hierarchy */}
        <div className="flex items-center justify-between mb-10 lg:mb-12">
          <h3 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Testimonials
          </h3>
        </div>

        {/* Testimonials Container */}
        <div className="relative">
          {/* Navigation - Fixed: Added proper aria-label attributes */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg border border-gray-200 transition-all duration-200"
            aria-label="Previous testimonials"
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg border border-gray-200 transition-all duration-200"
            aria-label="Next testimonials"
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>

          {/* Grid */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }, (_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0 flex">
                  {testimonials
                    .slice(
                      slideIndex * itemsPerSlide,
                      (slideIndex + 1) * itemsPerSlide
                    )
                    .map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className={`px-3 ${
                          itemsPerSlide === 1
                            ? "w-full"
                            : itemsPerSlide === 2
                            ? "w-1/2"
                            : "w-1/3"
                        }`}
                      >
                        <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 h-full bg-white hover:bg-blue-50/30 transition-colors duration-300">
                          {/* Text (clamped) */}
                          <p className="text-gray-700 mb-4 text-base leading-relaxed line-clamp-4 text-justify">
                            "{testimonial.text}"
                          </p>

                          {/* See More - Fixed: Added proper aria-label */}
                          {testimonial.text.length > 150 && (
                            <button
                              onClick={() => setOpenTestimonial(testimonial)}
                              className="text-blue-600 hover:underline text-sm font-medium"
                              aria-label={`Read full testimonial from ${testimonial.name}`}
                            >
                              See more
                            </button>
                          )}

                          {/* Author - Fixed: Changed from h4 to div for proper hierarchy */}
                          <div className="flex items-center mt-6">
                            <img
                              loading="lazy"
                              decoding="auto"
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              width={testimonial.avatarWidth}
                              height={testimonial.avatarHeight}
                              className="w-14 h-14 rounded-full object-cover mr-4"
                            />
                            <div>
                              <div className="font-semibold text-gray-900 text-base">
                                {testimonial.name}
                              </div>
                              <p className="text-orange-600 text-sm font-medium">
                                {testimonial.position}
                              </p>
                              <p className="text-gray-500 text-sm">
                                {testimonial.organization}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          {/* Indicators - Fixed: Added proper aria-label attributes */}
          <div className="flex justify-center space-x-2 mt-8">
            {Array.from({ length: totalSlides }, (_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-blue-500 w-8"
                    : "bg-gray-300 w-2 hover:bg-gray-400"
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to testimonial slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal for full testimonial */}
      <Modal
        isOpen={!!openTestimonial}
        onClose={() => setOpenTestimonial(null)}
        maxWidth="max-w-4xl"
        width="w-[95vw] sm:w-full"
        className="overflow-y-auto"
      >
        {openTestimonial && (
          <div className="p-6 sm:p-8 relative">
            {/* Close button - positioned in top right */}
            <button
              onClick={() => setOpenTestimonial(null)}
              className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 text-2xl font-light transition-colors duration-200 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center"
              aria-label="Close testimonial"
            >
              ×
            </button>
            
            {/* Full testimonial text */}
            <div className="mb-8 pr-4 sm:pr-12">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed text-justify hyphens-auto">
                "{openTestimonial.text}"
              </p>
            </div>
            
            {/* Author information */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center border-t pt-6 space-y-4 sm:space-y-0 sm:space-x-4">
              <img
                loading="lazy"
                decoding="auto"
                src={openTestimonial.avatar}
                alt={openTestimonial.name}
                width={openTestimonial.avatarWidth}
                height={openTestimonial.avatarHeight}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover flex-shrink-0 mx-auto sm:mx-0"
              />
              <div className="text-center sm:text-left w-full">
                <div className="font-semibold text-gray-900 text-lg sm:text-xl mb-1">
                  {openTestimonial.name}
                </div>
                <p className="text-orange-600 text-base sm:text-lg font-medium mb-1">
                  {openTestimonial.position}
                </p>
                {openTestimonial.organization && (
                  <p className="text-gray-500 text-sm sm:text-base mb-2">
                    {openTestimonial.organization}
                  </p>
                )}
                {openTestimonial.rating && (
                  <div className="flex items-center justify-center sm:justify-start">
                    {Array.from({ length: openTestimonial.rating }, (_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default TestimonialsSection;