import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Eye,
  Facebook,
  Heart,
  Linkedin,
  Link as LinkIcon,
  MessageCircle,
  Star,
  TrendingUp,
  Twitter,
  User,
} from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HashLoader } from "react-spinners";
import SeoHelmet from "../components/seo/SeoHelmet";
import {
  getBlogBySlug,
  getBlogMetadata,
  getBlogUrl,
  getRecentPosts,
  getSimilarPostsBySlug
} from "../data/blogDetails";


// Content skeleton for loading states
const ContentSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
  </div>
);

// Memoized Recent Post Card
const RecentPostCard = React.memo(({ post }) => (
  <Link
    to={`/blogs/${post.slug || post.id}`}
    className="group cursor-pointer block"
  >
    <div className="flex gap-2 sm:gap-3">
      <img
        src={post.image}
        alt={post.title}
        className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
        loading="lazy"
        width={post.width || 64}
        height={post.height || 64}
      />
      <div className="flex-1 min-w-0">
        <h5 className="font-medium text-gray-900 text-xs sm:text-sm line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 mb-1 leading-tight">
          {post.title}
        </h5>
        <div className="flex items-center text-xs text-gray-500">
          <Calendar size={8} className="mr-1" />
          {post.date}
        </div>
      </div>
    </div>
  </Link>
));

// Memoized Similar Post Card
const SimilarPostCard = React.memo(({ post }) => (
  <Link
    to={getBlogUrl(post)}
    className="group cursor-pointer block"
  >
    <div className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="relative h-24 sm:h-32 overflow-hidden">
        <img
          src={post.slides?.[0]?.url || post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          width={post.slides?.[0]?.width || post.width || 400}
          height={post.slides?.[0]?.height || post.height || 250}
        />
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium">
            {post.category}
          </span>
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <h5 className="font-semibold text-gray-900 text-xs sm:text-sm line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 mb-2 leading-tight">
          {post.title}
          <ArrowUpRight
            size={12}
            className="inline ml-1 opacity-0 group-hover:opacity-100 transition-all duration-200"
          />
        </h5>
        <p className="text-gray-600 text-xs line-clamp-2 mb-2 leading-relaxed">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <User size={8} className="mr-1" />
            <span className="truncate">{post.author}</span>
          </div>
          <div className="flex items-center">
            <Clock size={8} className="mr-1" />
            {post.readTime}
          </div>
        </div>
      </div>
    </div>
  </Link>
));

// Main Blog Details Component
const BlogDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // State management
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [similarPostsPage, setSimilarPostsPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isContentReady, setIsContentReady] = useState(false);
  const [heroImagePreloaded, setHeroImagePreloaded] = useState(false);

  // Memoized blog data retrieval using slug
  const blogPost = useMemo(() => {
    if (!slug) return null;
    return getBlogBySlug(slug);
  }, [slug]);

  // Get SEO metadata using helper function
  const metadata = useMemo(() => {
    if (!slug) return null;
    return getBlogMetadata(slug);
  }, [slug]);

  useEffect(() => {
    if (blogPost) {
      const prepareContent = async () => {
        // Preload hero image for smooth display
        const heroImage = blogPost.slides?.[0]?.url || blogPost.authorAvatar;
        const imagePromise = new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            setHeroImagePreloaded(true);
            resolve();
          };
          img.onerror = resolve; // Continue even if image fails
          img.src = heroImage;
        });

        // Wait for image and minimum loading time
        await Promise.all([
          imagePromise,
          new Promise(resolve => setTimeout(resolve, 800)) // Optimized loading time
        ]);
        
        setIsLoading(false);
        setIsContentReady(true);
      };
      
      prepareContent();
    } else if (slug) {
      // Blog not found, stop loading after delay
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [blogPost, slug]);

  // Get similar posts using the slug-based helper function
  const similarPosts = useMemo(() => {
    if (!slug) return [];
    return getSimilarPostsBySlug(slug);
  }, [slug]);

  // Get recent posts using helper function
  const recentPosts = useMemo(() => {
    return getRecentPosts(3);
  }, []);

  // Memoized derived data
  const slides = useMemo(() => blogPost?.slides || [], [blogPost]);
  const tableOfContents = useMemo(() => blogPost?.tableOfContents || [], [blogPost]);

  // Constants
  const similarPostsPerPage = 2;

  // Calculate pagination for similar posts
  const paginatedSimilarPosts = useMemo(() => {
    const startIndex = (similarPostsPage - 1) * similarPostsPerPage;
    const endIndex = startIndex + similarPostsPerPage;
    return {
      posts: similarPosts.slice(startIndex, endIndex),
      totalPages: Math.ceil(similarPosts.length / similarPostsPerPage),
      hasNext: endIndex < similarPosts.length,
      hasPrev: similarPostsPage > 1,
    };
  }, [similarPosts, similarPostsPage]);

  // Initialize like count when blog post loads
  useEffect(() => {
    if (blogPost?.likes) {
      setLikeCount(parseInt(blogPost.likes) || 0);
    }
  }, [blogPost]);

  // Redirect if blog not found
  useEffect(() => {
    if (slug && !blogPost && !isLoading) {
      navigate("/blogs", { replace: true });
    }
  }, [slug, blogPost, navigate, isLoading]);

  // Reset similar posts pagination when blog changes
  useEffect(() => {
    setSimilarPostsPage(1);
  }, [blogPost?.id]);

  // Optimized carousel navigation with useCallback
  const nextSlide = useCallback(() => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  }, [slides.length]);

  const goToSlide = useCallback((index) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlide(index);
    }
  }, [slides.length]);

  // Similar posts pagination handlers
  const handleSimilarPostsNext = useCallback(() => {
    if (paginatedSimilarPosts.hasNext) {
      setSimilarPostsPage((prev) => prev + 1);
    }
  }, [paginatedSimilarPosts.hasNext]);

  const handleSimilarPostsPrev = useCallback(() => {
    if (paginatedSimilarPosts.hasPrev) {
      setSimilarPostsPage((prev) => prev - 1);
    }
  }, [paginatedSimilarPosts.hasPrev]);

  const handleToggleTableOfContents = useCallback(() => {
    setShowTableOfContents((prev) => !prev);
  }, []);

  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  // Keyboard navigation for carousel
  useEffect(() => {
    if (slides.length <= 1) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, slides.length]);

  // Memoized processed content with justified text and styled images
  const processedContent = useMemo(() => {
    if (!blogPost?.content) return "";
    
    return blogPost.content
      .replace(
        /<h2>/g,
        '<h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mt-8 lg:mt-12 mb-4 lg:mb-6 first:mt-0">'
      )
      .replace(
        /<p>/g,
        '<p class="text-gray-700 mb-4 lg:mb-6 leading-relaxed text-sm sm:text-base lg:text-lg text-justify">'
      )
      .replace(
        /<img([^>]+)>/g,
        '<img$1 class="max-w-full h-auto mx-auto rounded-lg my-6 shadow-md" loading="lazy" />'
      );
  }, [blogPost?.content]);



  // Social sharing functions
  const handleTwitterShare = useCallback(() => {
    if (blogPost && metadata) {
      const text = `Check out this article: ${blogPost.title}`;
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(metadata.url)}`;
      window.open(url, '_blank');
    }
  }, [blogPost, metadata]);

  const handleFacebookShare = useCallback(() => {
    if (metadata) {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(metadata.url)}`;
      window.open(url, '_blank');
    }
  }, [metadata]);

  const handleLinkedInShare = useCallback(() => {
    if (blogPost && metadata) {
      const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(metadata.url)}`;
      window.open(url, '_blank');
    }
  }, [blogPost, metadata]);

  // Early return with optimized loading state
  if (isLoading || !isContentReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {!blogPost && !isLoading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 text-lg mb-4">Blog Post Not Found</div>
              <button
                onClick={() => navigate("/blogs")}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Go Back to Blogs
              </button>
            </div>
          </div>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="flex justify-center items-center mb-6">
                <HashLoader color="#2563eb" size={60} />
              </div>
              <p className="text-gray-700 font-medium text-lg">Loading blog post...</p>
              <p className="mt-2 text-gray-500 text-sm">Preparing content for smooth experience</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">Blog Post Not Found</div>
          <button
            onClick={() => navigate("/blogs")}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-x-hidden">
      {/* SEO Helmet Component */}
      {metadata && (
        <SeoHelmet
          title={metadata.title}
          description={metadata.description}
          image={metadata.image}
          url={metadata.url}
          blogPost={{
            author: metadata.author,
            date: metadata.publishedTime,
            modifiedDate: metadata.publishedTime,
            category: metadata.category,
            tags: blogPost?.tags || [],
            readingTime: blogPost?.readTime
          }}
          twitterHandle="@pbgroup"
          siteName="PB Group"
        />
      )}

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Back Navigation */}
        <div className="mb-6 lg:mb-8 inline-block">
          <Link
            to="/blogs"
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium text-sm sm:text-base"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Blog
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 min-w-0">
            {/* Article Header */}
            <header className="mb-6 lg:mb-8">
              {/* Category and Status Badges */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-full text-xs sm:text-sm font-semibold">
                  {blogPost.category}
                </span>
                {blogPost.isFeatured && (
                  <span className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full text-xs sm:text-sm font-semibold">
                    <Star size={12} className="mr-1" />
                    Featured
                  </span>
                )}
                {blogPost.isTrending && (
                  <span className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-xs sm:text-sm font-semibold">
                    <TrendingUp size={12} className="mr-1" />
                    Trending
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                {blogPost.title}
              </h1>

              {/* Excerpt */}
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 lg:mb-8 leading-relaxed">
                {blogPost.excerpt}
              </p>

              {/* Author and Meta Info */}
              <div className="flex flex-col gap-4 sm:gap-6 mb-6 lg:mb-8 p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <img
                      src={blogPost.authorAvatar}
                      alt={blogPost.author}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0"
                      loading="eager"
                      width={blogPost.authorAvatarWidth || 56}
                      height={blogPost.authorAvatarHeight || 56}
                    />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">
                        {blogPost.author}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mt-1">
                        <div className="flex items-center">
                          <Calendar size={12} className="mr-1" />
                          <span className="whitespace-nowrap">{blogPost.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock size={12} className="mr-1" />
                          <span className="whitespace-nowrap">{blogPost.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Engagement Stats */}
                  <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center">
                      <Eye size={14} className="mr-1" />
                      {blogPost.views}
                    </div>
                    <div className="flex items-center text-red-500">
                      <Heart size={14} className="mr-1 fill-current" />
                      {likeCount}
                    </div>
                    <div className="flex items-center">
                      <MessageCircle size={14} className="mr-1" />
                      {blogPost.totalComments}
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Image Carousel with Captions */}
            {slides.length > 0 && (
              <div className="mb-8 lg:mb-12">
                <div className="relative bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg overflow-hidden border border-gray-100">
                  {/* Main Image Container - Responsive aspect ratio */}
                  <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden">
                    <img
                      src={slides[currentSlide]?.url}
                      alt={slides[currentSlide]?.caption || "Blog image"}
                      className={`w-full h-full object-cover transition-all duration-500 ${
                        heroImagePreloaded ? 'opacity-100' : 'opacity-90'
                      }`}
                      loading="eager"
                      width={slides[currentSlide]?.width || 1200}
                      height={slides[currentSlide]?.height || 600}
                    />

                    {/* Navigation Arrows */}
                    {slides.length > 1 && (
                      <>
                        <button
                          onClick={prevSlide}
                          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={16} className="text-gray-700" />
                        </button>
                        <button
                          onClick={nextSlide}
                          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
                          aria-label="Next image"
                         >
                          <ChevronRight size={16} className="text-gray-700" />
                        </button>
                      </>
                    )}

                    {/* Slide Counter */}
                    {slides.length > 1 && (
                      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/50 backdrop-blur-sm text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                        {currentSlide + 1} / {slides.length}
                      </div>
                    )}
                  </div>

                  {/* Image Caption */}
                  {slides[currentSlide]?.caption && (
                    <div className="p-4 sm:p-6 bg-white">
                      <p className="text-gray-600 text-center italic leading-relaxed text-sm sm:text-base">
                        {slides[currentSlide].caption}
                      </p>
                    </div>
                  )}

                  {/* Slide Indicators */}
                  {slides.length > 1 && (
                    <div className="flex justify-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50">
                      {slides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                            currentSlide === index
                              ? "bg-blue-600 scale-125"
                              : "bg-gray-300 hover:bg-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Article Content */}
            <article className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-8 lg:mb-12">
              <div
                className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-12 shadow-sm border border-gray-100 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 min-w-0">
            <div className="sticky top-4 space-y-6 lg:space-y-8">
              {/* Author Info */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="text-center">
                  <img
                    src={blogPost.authorAvatar}
                    alt={blogPost.author}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mx-auto mb-3 sm:mb-4"
                    loading="lazy"
                    width={blogPost.authorAvatarWidth || 80}
                    height={blogPost.authorAvatarHeight || 80}
                  />
                  <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-2">
                    {blogPost.author}
                  </h4>
                  {blogPost.authorBio && (
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                      {blogPost.authorBio}
                    </p>
                  )}
                 {/*  <button className="w-full px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg sm:rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 text-sm">
                    Follow Author
                  </button> */}
                </div>
              </div>

              {/* Table of Contents */}
              {tableOfContents.length > 0 && (
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <button
                    onClick={handleToggleTableOfContents}
                    className="flex items-center justify-between w-full mb-3 sm:mb-4"
                  >
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                      Table of Contents
                    </h4>
                    {showTableOfContents ? (
                      <ChevronUp size={18} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-500" />
                    )}
                  </button>

                  {showTableOfContents && (
                    <nav className="space-y-2">
                      {tableOfContents.map((item, index) => (
                        <a
                          key={index}
                          href={`#${item.id}`}
                          className="block text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 py-1 border-l-2 border-transparent hover:border-blue-600 pl-3"
                        >
                          {item.title}
                        </a>
                      ))}
                    </nav>
                  )}
                </div>
              )}

              {/* Recent Articles */}
              {recentPosts.length > 0 && (
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                    Recent Articles
                  </h4>
                  <div className="space-y-3 sm:space-y-4">
                    {recentPosts.map((post) => (
                      <RecentPostCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}

              {/* Similar Posts with Pagination */}
              {similarPosts.length > 0 && (
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                      Similar Posts
                    </h4>
                    {paginatedSimilarPosts.totalPages > 1 && (
                      <div className="flex items-center text-xs text-gray-500">
                        <span>
                          {similarPostsPage} / {paginatedSimilarPosts.totalPages}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 sm:space-y-4 mb-4">
                    {paginatedSimilarPosts.posts.map((post) => (
                      <SimilarPostCard key={post.id} post={post} />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {paginatedSimilarPosts.totalPages > 1 && (
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <button
                        onClick={handleSimilarPostsPrev}
                        disabled={!paginatedSimilarPosts.hasPrev}
                        className="flex items-center px-2 py-1 text-xs text-gray-600 hover:text-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={12} className="mr-1" />
                        Prev
                      </button>

                      <div className="flex gap-1">
                        {Array.from(
                          { length: paginatedSimilarPosts.totalPages },
                          (_, i) => (
                            <button
                              key={i + 1}
                              onClick={() => setSimilarPostsPage(i + 1)}
                              className={`w-6 h-6 rounded text-xs transition-colors duration-200 ${
                                similarPostsPage === i + 1
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {i + 1}
                            </button>
                          )
                        )}
                      </div>

                      <button
                        onClick={handleSimilarPostsNext}
                        disabled={!paginatedSimilarPosts.hasNext}
                        className="flex items-center px-2 py-1 text-xs text-gray-600 hover:text-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <ChevronRight size={12} className="ml-1" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Share Widget */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                  Share This Article
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  <button 
                    onClick={handleTwitterShare}
                    className="w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 bg-blue-50 text-blue-600 rounded-lg sm:rounded-xl hover:bg-blue-100 transition-colors duration-200 text-xs sm:text-sm"
                  >
                    <Twitter size={14} className="mr-2 sm:mr-3" />
                    Share on Twitter
                  </button>
                  <button 
                    onClick={handleFacebookShare}
                    className="w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 bg-blue-50 text-blue-800 rounded-lg sm:rounded-xl hover:bg-blue-100 transition-colors duration-200 text-xs sm:text-sm"
                  >
                    <Facebook size={14} className="mr-2 sm:mr-3" />
                    Share on Facebook
                  </button>
                  <button 
                    onClick={handleLinkedInShare}
                    className="w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 bg-blue-50 text-blue-700 rounded-lg sm:rounded-xl hover:bg-blue-100 transition-colors duration-200 text-xs sm:text-sm"
                  >
                    <Linkedin size={14} className="mr-2 sm:mr-3" />
                    Share on LinkedIn
                  </button>
                </div>
              </div>

              {/* Blog Tags (Dynamic from current post) */}
              {blogPost.tags && blogPost.tags.length > 0 && (
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                    Article Tags
                  </h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {blogPost.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs hover:bg-blue-100 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsPage;