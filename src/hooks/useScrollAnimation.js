// 🎬 Scroll animation logic
//  # - IntersectionObserver setup
//  # - Track visible elements
//  # - Trigger animations on scroll





import { useCallback, useEffect, useRef, useState } from "react";

export const useScrollAnimation = (options = {}, dependencies = []) => {
  const [visibleElements, setVisibleElements] = useState(new Set());
  const observerRef = useRef(null);

  const defaultOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
    ...options,
  };

  // ✅ Reset visible elements when dependencies change (e.g., route/slug change)
  useEffect(() => {
    setVisibleElements(new Set());
  }, dependencies);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) =>
              new Set(prev).add(entry.target.dataset.animateId)
            );
          }
        });
      },
      defaultOptions
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const observeElement = useCallback((element, id) => {
    if (element && observerRef.current) {
      element.dataset.animateId = id;
      observerRef.current.observe(element);
    }
  }, []);

  const isVisible = useCallback(
    (id) => visibleElements.has(id),
    [visibleElements]
  );

  return { observeElement, isVisible, visibleElements };
};




















// your-project/
// │
// ├── src/
// │   │
// │   ├── hooks/
// │   │   └── useScrollAnimation.js        # 🎬 Scroll animation logic
// │   │                                    # - IntersectionObserver setup
// │   │                                    # - Track visible elements
// │   │                                    # - Trigger animations on scroll
// │   │
// │   ├── utils/
// │   │   └── linkUtils.js                 # 🔗 Internal linking utility
// │   │                                    # - Auto-convert keywords to links
// │   │                                    # - Safe HTML processing
// │   │                                    # - Avoid nested links
// │   │
// │   ├── constants/
// │   │   └── internalLinks.js             # 📝 Link configuration
// │   │                                    # - Centralized keyword mapping
// │   │                                    # - URL and title definitions
// │   │                                    # - Easy to update/maintain
// │   │
// │   ├── components/
// │   │   │
// │   │   ├── common/
// │   │   │   └── AnimationStyles.jsx      # 🎨 Global CSS animations
// │   │   │                                # - fadeInUp, fadeInLeft, etc.
// │   │   │                                # - Animation delays
// │   │   │                                # - Include once per app
// │   │   │
// │   │   ├── sections/
// │   │   │   ├── HeroSection.jsx          # 🦸 Hero banner component
// │   │   │   │                            # Props: title, subtitle, gradient,
// │   │   │   │                            #        icon, image, actions
// │   │   │   │                            # Use for: Service, Course, Blog pages
// │   │   │   │
// │   │   │   └── FeatureList.jsx          # ⭐ Feature display component
// │   │   │                                # Props: title, features, variant
// │   │   │                                # Variants: 'simple' (checkmarks)
// │   │   │                                #          'detailed' (icons + desc)
// │   │   │
// │   │   ├── sidebar/
// │   │   │   ├── ContactSidebar.jsx       # 📞 Contact/CTA card
// │   │   │   │                            # Props: title, description, button,
// │   │   │   │                            #        phone, email, gradient
// │   │   │   │                            # Use for: All detail page sidebars
// │   │   │   │
// │   │   │   └── RelatedItems.jsx         # 🔄 Related content with pagination
// │   │   │                                # Props: items, title, itemsPerPage,
// │   │   │                                #        renderItem (optional)
// │   │   │                                # Use for: Related services/courses/posts
// │   │   │
// │   │   ├── Modal.jsx                    # (Your existing modal)
// │   │   └── seo/
// │   │       └── SeoHelmet.jsx            # (Your existing SEO component)
// │   │
// │   ├── pages/
// │   │   ├── ServiceDetailPage.jsx        # 🔧 REFACTORED service page
// │   │   │                                # - Uses all reusable components
// │   │   │                                # - Clean, maintainable code
// │   │   │                                # - 60% less code than original
// │   │   │
// │   │   ├── CourseDetailPage.jsx         # 📚 EXAMPLE: Course detail page
// │   │   │                                # - Shows component reusability
// │   │   │                                # - Different content, same structure
// │   │   │
// │   │   └── BlogPostPage.jsx             # 📰 EXAMPLE: Blog post page
// │   │                                    # - Another reuse example
// │   │                                    # - Demonstrates flexibility
// │   │
// │   └── data/
// │       └── services.js                  # (Your existing data)
// │
// ├── README.md                             # 📖 Complete documentation
// ├── QUICK_START.md                        # ⚡ 5-minute setup guide
// └── FOLDER_STRUCTURE.md                   # 📂 This file