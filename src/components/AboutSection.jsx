import React, { useState, useRef, useCallback, useMemo } from "react";

const AboutSection = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const sectionRef = useRef(null);

  // Memoized video configuration
  const videoConfig = useMemo(
    () => ({
      VIDEO_ID: "ZSWwWI3jVL8",
      CUSTOM_THUMBNAIL: "/videos/video-thumbnail.webp",
      // More reliable YouTube thumbnail fallbacks
      YOUTUBE_MAXRES: `https://img.youtube.com/vi/ZSWwWI3jVL8/maxresdefault.jpg`, // 1280x720
      YOUTUBE_SD: `https://img.youtube.com/vi/ZSWwWI3jVL8/sddefault.jpg`, // 640x480
      YOUTUBE_HQ: `https://img.youtube.com/vi/ZSWwWI3jVL8/hqdefault.jpg`, // 480x360
      IFRAME_SRC: `https://www.youtube.com/embed/ZSWwWI3jVL8?rel=0&modestbranding=1&playsinline=1&autoplay=1`,
    }),
    []
  );

  // Handle video facade click - only load iframe when user interacts
  const handleVideoClick = useCallback(() => {
    // Preconnect to YouTube domains when user shows intent
    if (!document.querySelector('link[href*="youtube-nocookie.com"]')) {
      const preconnect1 = document.createElement('link');
      preconnect1.rel = 'preconnect';
      preconnect1.href = 'https://www.youtube-nocookie.com';
      preconnect1.crossOrigin = 'anonymous';
      document.head.appendChild(preconnect1);

      const preconnect2 = document.createElement('link');
      preconnect2.rel = 'preconnect';
      preconnect2.href = 'https://i.ytimg.com';
      preconnect2.crossOrigin = 'anonymous';
      document.head.appendChild(preconnect2);
    }

    setVideoLoaded(true);
  }, []);

  // Smart image fallback handler
  const handleImageError = useCallback((e) => {
    const currentSrc = e.target.src;
    
    if (currentSrc.includes('/videos/video-thumbnail.webp')) {
      e.target.src = videoConfig.YOUTUBE_MAXRES;
    } else if (currentSrc === videoConfig.YOUTUBE_MAXRES) {
      e.target.src = videoConfig.YOUTUBE_SD;
    } else if (currentSrc === videoConfig.YOUTUBE_SD) {
      e.target.src = videoConfig.YOUTUBE_HQ;
    }
  }, [videoConfig]);

  return (
    <section
      ref={sectionRef}
      className="py-10 lg:py-16 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(59,130,246,0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(99,102,241,0.08) 0%, transparent 50%)
          `,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Enhanced YouTube Video Container */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="relative w-full aspect-video">
                {videoLoaded ? (
                  // Use youtube-nocookie.com for better privacy
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${videoConfig.VIDEO_ID}?rel=0&modestbranding=1&playsinline=1&autoplay=1`}
                    title="PB Group Company Profile Video"
                    className="absolute inset-0 w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    loading="lazy"
                  />
                ) : (
                  // Enhanced Facade with loading states
                  <div 
                    className="absolute inset-0 bg-gray-900 cursor-pointer group"
                    onClick={handleVideoClick}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleVideoClick();
                      }
                    }}
                    aria-label="Play video"
                  >
                    {/* Thumbnail with loading state */}
                    <div className={`relative w-full h-full transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                      <picture>
                        <source
                          srcSet={videoConfig.CUSTOM_THUMBNAIL}
                          type="image/webp"
                        />
                        <img
                          src={videoConfig.CUSTOM_THUMBNAIL}
                          alt="PB Group Company Profile Video - Click to play"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                          width="1280"
                          height="720"
                          onLoad={() => setImageLoaded(true)}
                          onError={handleImageError}
                        />
                      </picture>
                    </div>

                    {/* Loading skeleton */}
                    {!imageLoaded && (
                      <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
                        <div className="text-white/60">Loading...</div>
                      </div>
                    )}

                    {/* Enhanced Play Button with hover effects */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        {/* Glow effect */}
                        <div className="absolute inset-0 w-20 h-20 bg-red-600/30 rounded-full blur-lg group-hover:scale-125 transition-transform duration-300" />
                        
                        {/* Main play button */}
                        <div className="relative w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-red-700 transition-all duration-300">
                          <div className="w-0 h-0 border-l-[16px] border-l-white border-y-[8px] border-y-transparent ml-1" />
                        </div>
                      </div>
                    </div>

                    {/* "Click to play" indicator */}
                    <div className="absolute bottom-4 left-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Click to play
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Optimized Floating Stats with reduced animations */}
            <div className="absolute -bottom-12 -right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-100 hidden sm:block hover:scale-105 transition-transform duration-200">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">3+</div>
                <div className="text-xs text-gray-600 font-medium">
                  Years Experience
                </div>
              </div>
            </div>

            <div className="absolute -top-12 -left-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-100 hidden sm:block hover:scale-105 transition-transform duration-200">
              <div className="text-center">
                <div className="text-xl font-bold text-amber-600">40+</div>
                <div className="text-xs text-gray-600 font-medium">
                  Happy Clients
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="order-1 lg:order-2 space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2">
                About Company
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
            </div>

            <div className="relative">
              <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-400 to-purple-400 rounded-full" />
              <blockquote className="pl-6 sm:pl-8 text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed text-justify">
                PB Group is a leading provider of Research, Data Analytics,
                and IT Solutions in Nepal. We empower businesses and
                organizations to make smarter decisions, optimize performance,
                and achieve sustainable growth. Combining technical expertise
                with innovative strategies, we transform data into actionable
                insights that drive real results.
              </blockquote>
            </div>

            <div className="flex justify-end">
              <div className="text-white font-semibold text-lg opacity-90">
                - PB Group
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;