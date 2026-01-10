import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  Clock, 
  User, 
  Tag,
  Filter,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Bookmark,
  Share2,
  Eye,
  ArrowUpRight,
  Star,
  Heart,
  MessageCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SeoHelmet from '../components/seo/SeoHelmet';

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeFilter, setActiveFilter] = useState('All Posts');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('recent');
  const postsPerPage = 9;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll to top when currentPage changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);


const blogPosts = [
  {
    id: 1,
    title: "Empowering Better Outcomes: Data-Driven Decision Making at PB Group",
    slug: "empowering-better-outcomes-data-driven-decision-making-at-pb-group",
    excerpt: "How PB Group uses data as a strategic asset to guide operations, drive innovation, and strengthen impact through evidence-based decision making.",
    content: "In an era dominated by information, organizations must adapt or risk falling behind. At PB Group, data is more than just numbers—it's a strategic asset that guides operations, drives innovation, and strengthens impact. By embracing Data-Driven Decision Making (DDDM), PB Group has positioned itself at the forefront of evidence-based development and organizational growth...",
    image: "/blogs/posts/Empowering Better Outcomes.webp",
    alt: "Data-driven decision making infographic showing analytics dashboard and business growth metrics",
    width: 624,
    height: 357,
    author: "PB Group Insights Team",
    date: "15 Jan 2024",
    readTime: "6 min read",
    category: "data analysis",
    tags: ["Data", "Decision Making", "Analytics", "MEL"],
    views: "1.8k",
    likes: "96",
    comments: "17",
    isRecent: true,
    isPopular: false,
    isFeatured: true,
    isTrending: false
  },
  {
    id: 2,
    title: "PB Group: Empowering Decisions Through Data & Technology",
    slug: "pb-group-empowering-decisions-through-data-and-technology",
    excerpt: "Discover how PB Group, a consultancy founded by visionary engineers, is transforming data into actionable strategies for sustainable growth in Nepal.",
    content: "In today's fast-paced and data-centric world, organizations need reliable insights to make strategic decisions and stay ahead of the curve. Founded in 2022 by a team of visionary engineers, PB Group Pvt. Ltd. has emerged as a trusted name in the fields of market research, data analytics, and ICT solutions in Nepal...",
    image: "/landing-page-images/CentralCampusofTechnology_Dharan_2.webp",
    alt: "PB Group training session at Central Campus of Technology Dharan with participants learning data analytics",
    width: 3359,
    height: 2301,
    author: "PB Group Editorial",
    date: "22 Jan 2024",
    readTime: "5 min read",
    category: "Company",
    tags: ["PB Group", "About Us", "Services", "Nepal"],
    views: "2.5k",
    likes: "142",
    comments: "31",
    isRecent: true,
    isPopular: true,
    isFeatured: true,
    isTrending: true
  },
  {
    id: 3,
    title: "Data Collection Tools & Platforms: A Comprehensive Guide",
    slug: "data-collection-tools-and-platforms-a-comprehensive-guide",
    excerpt: "Explore key data collection tools, from mobile surveys to IoT sensors, and learn how to choose the right platform for your research or business needs.",
    content: "In the era of data-driven decision-making, data collection is a critical first step. This article explores key data collection tools and platforms, their features, and how to choose the right one. We cover mobile survey tools like KoboToolbox and ODK, IoT platforms, web scraping tools, and highlight how agencies like PB Group leverage these technologies for impactful insights...",
    image: "/blogs/posts/data collection tools.webp",
    alt: "Comprehensive guide to data collection tools including mobile surveys, KoBoToolbox, and digital research platforms",
    width: 992,
    height: 594,
    author: "PB Group Research Team",
    date: "05 Mar 2024",
    readTime: "8 min read",
    category: "Data Collection",
    tags: ["Data Collection", "KoboToolbox", "ODK", "SurveyCTO", "Research Tools"],
    views: "2.3k",
    likes: "124",
    comments: "23",
    isRecent: false,
    isPopular: true,
    isFeatured: false,
    isTrending: true
  },
  {
    id: 4,
    title: "Top 10 Trending Data Analysis Tools in 2024",
    slug: "top-10-trending-data-analysis-tools-in-2024",
    excerpt: "A comprehensive guide to the most popular data analysis tools, from Python and R to Power BI and Tableau, and why they are essential for turning data into insights.",
    content: "Data analysis is the process of collecting, cleaning, transforming, and interpreting data to uncover useful information. This article explores the top 10 trending tools, including Python, R, SQL, Power BI, Tableau, and more, detailing their strengths and why they are dominating the field of data analytics in 2024...",
    image: "/blogs/posts/data analysis tool list.webp",
    alt: "Top 10 data analysis tools in 2024 including Python, R, Tableau, Power BI and other trending analytics software",
    width: 624,
    height: 351,
    author: "Aswikar Khanal",
    date: "20 Mar 2024",
    readTime: "10 min read",
    category: "data analysis",
    tags: ["Data Analysis", "Python", "R", "Power BI", "Tableau", "Trending Tools"],
    views: "3.5k",
    likes: "210",
    comments: "35",
    isRecent: false,
    isPopular: true,
    isFeatured: true,
    isTrending: true
  },
  {
    id: 5,
    title: "A Comprehensive Guide to the Different Types of Market Research",
    slug: "a-comprehensive-guide-to-the-different-types-of-market-research",
    excerpt: "Explore the essential types of market research, from primary and secondary to qualitative and quantitative methods, and learn how they drive informed business decisions.",
    content: "Market research involves collecting, analyzing, and interpreting data about a market, its competitors, and its consumers. This guide breaks down the major types, including Primary, Secondary, Qualitative, and Quantitative research, and explains their importance in gaining competitive advantage, driving business growth, and understanding customer satisfaction...",
    image: "/blogs/posts/Market.webp",
    alt: "Market research types guide showing primary, secondary, qualitative and quantitative research methodologies",
    width: 1500,
    height: 1125,
    author: "Aswikar Khanal",
    date: "28 Mar 2024",
    readTime: "7 min read",
    category: "Market Research",
    tags: ["Market Research", "Primary Research", "Secondary Research", "Qualitative", "Quantitative"],
    views: "1.9k",
    likes: "87",
    comments: "14",
    isRecent: true,
    isPopular: false,
    isFeatured: true,
    isTrending: false
  },
  {
    id: 6,
    title: "Market Research in Nepal: A Complete Guide to Navigating the Growing Market",
    slug: "market-research-in-nepal-a-complete-guide-to-navigating-the-growing-market",
    excerpt: "A comprehensive look at why market research is crucial for success in Nepal's unique and evolving economic landscape, and how to get started.",
    content: "Market research is the process of gathering information about consumers and the market to make informed business decisions. This guide explores its importance in Nepal, the difference between primary and secondary research, and highlights key agencies like PB Group that can help businesses uncover opportunities, reduce risk, and navigate the country's dynamic economic landscape...",
     image: "/blogs/posts/Market-Research.webp",
    alt: "Data analysis importance in business showing charts, graphs and analytics for informed decision making",
    width: 624,
    height: 312,
    author: "Aswikar Khanal",
    date: "05 Apr 2024",
    readTime: "9 min read",
    category: "Market Research",
    tags: ["Market Research", "Nepal Market", "Primary Research", "Secondary Research", "Business Nepal"],
    views: "2.1k",
    likes: "105",
    comments: "18",
    isRecent: false,
    isPopular: false,
    isFeatured: false,
    isTrending: false
  },
  {
    id: 7,
    title: "The Critical Importance of Data Analysis in Modern Business",
    slug: "the-critical-importance-of-data-analysis-in-modern-business",
    excerpt: "Explore why data analytics is essential for business growth, better decision-making, and effective marketing in today's data-driven world.",
    content: "Data analytics has become increasingly popular in recent years as it combines IT, statistics, and business strategy to help businesses make better-informed decisions. This article explores what data analysis is, why it's needed, its role in business growth, and why companies must leverage it. We also cover career paths in data analytics, essential tools, and the skills required to become a successful data analyst...",
    image: "/blogs/posts/data analyisi importance.webp",
    alt: "Critical importance of data analysis in modern business featuring analytics dashboards and business intelligence tools",
    width: 624,
    height: 312,
    author: "Aswikar Khanal",
    date: "12 Apr 2024",
    readTime: "11 min read",
    category: "Data Analysiss",
    tags: ["Data Analysis", "Business Growth", "Data-Driven Decisions", "Career", "Data Analytics"],
    views: "2.8k",
    likes: "134",
    comments: "22",
    isRecent: false,
    isPopular: false,
    isFeatured: false,
    isTrending: false
  }
];


 const filteredPosts = useMemo(() => {
    let filtered = blogPosts.filter((post) => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = 
        activeCategory === 'All' || post.category === activeCategory;

      let matchesFilter = true;
      if (activeFilter === 'Recent Posts') {
        matchesFilter = post.isRecent;
      } else if (activeFilter === 'Popular Posts') {
        matchesFilter = post.isPopular;
      } else if (activeFilter === 'Featured Posts') {
        matchesFilter = post.isFeatured;
      }

      return matchesSearch && matchesCategory && matchesFilter;
    });

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'views':
          return parseInt(b.views.replace(/[^0-9]/g, '')) - parseInt(a.views.replace(/[^0-9]/g, ''));
        case 'readTime':
          return parseInt(a.readTime.replace(/[^0-9]/g, '')) - parseInt(b.readTime.replace(/[^0-9]/g, ''));
        case 'title':
          return a.title.localeCompare(b.title);
        default: // recent
          return new Date(b.date) - new Date(a.date);
      }
    });

    return filtered;
  }, [searchQuery, activeCategory, activeFilter, sortBy]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const renderPagination = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <SeoHelmet
  title="PB Group | Data Analytics & Research Blog in Nepal"
  description="Stay updated with PB Group's insights on data analytics, market research, data collection tools, and technology solutions. Explore articles on Python, R, SPSS, Excel, and business intelligence to empower data-driven decisions."
  image="/blogs/posts/data analysis tool list.webp"
  url="https://pbg.com.np/blogs"
/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Search and Controls - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
            
            {/* Search Bar - Responsive */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400 sm:w-5 sm:h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search articles, topics, or authors..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                />
              </div>
            </div>

            {/* Sort and Count - Mobile Responsive */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
              <div className="flex items-center">
                <Filter size={16} className="mr-2 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-sm sm:text-base"
                >
                  <option value="recent">Most Recent</option>
                  <option value="views">Most Viewed</option>
                  <option value="readTime">Quick Read</option>
                  <option value="title">Alphabetical</option>
                </select>
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">
                Showing {currentPosts.length} of {filteredPosts.length} posts
              </div>
            </div>
          </div>
        </div>
        

        {/* Blog Posts Grid - Mobile Optimized with 2 columns */}
        <div className="mb-12 sm:mb-16">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">All blog posts</h2>
            <div className="hidden sm:block text-sm text-gray-500">
              {filteredPosts.length} articles found
            </div>
          </div>
          
          {currentPosts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {currentPosts.map((post) => (
                <Link to={`/blogs/${post.slug}`} key={post.id}>
                <article
                  className="bg-white rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group cursor-pointer hover:-translate-y-1 sm:hover:-translate-y-3 h-full flex flex-col"
                >
                  
                  {/* Image Container - Responsive sizing */}
                  <div className="relative overflow-hidden h-32 sm:h-40 lg:h-56">
                    <img
                       loading="lazy"
                       decoding="auto"
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                      width={post.width}
                      height={post.height}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                    
                    {/* Status Badges - Responsive sizing */}
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-2">
                      {post.isFeatured && (
                        <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-md text-xs font-bold shadow-lg">
                          <Star size={10} className="mr-1" />
                          <span className="hidden sm:inline">Featured</span>
                          <span className="sm:hidden">✦</span>
                        </span>
                      )}
                      {post.isTrending && (
                        <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-md text-xs font-bold shadow-lg">
                          <TrendingUp size={10} className="mr-1" />
                          <span className="hidden sm:inline">Trending</span>
                          <span className="sm:hidden">🔥</span>
                        </span>
                      )}
                    </div>

                    {/* Action Buttons - Hidden on mobile for space */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 hidden sm:flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-200 shadow-lg hover:scale-110">
                        <Bookmark size={14} className="text-gray-700" />
                      </button>
                      <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-200 shadow-lg hover:scale-110">
                        <Share2 size={14} className="text-gray-700" />
                      </button>
                    </div>

                    {/* Category Badge - Responsive positioning */}
                    <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
                      <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-600 text-white rounded-full text-xs font-semibold shadow-lg">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content - Responsive padding and text sizes */}
                  <div className="p-3 sm:p-4 lg:p-6 flex-1 flex flex-col">
                    
                    {/* Meta Information - Responsive text and spacing */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-500 mb-2 sm:mb-3">
                      <div className="flex items-center">
                        <User size={10} className="mr-1" />
                        <span className="font-medium truncate max-w-20 sm:max-w-none">{post.author.split(' ')[0]}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={10} className="mr-1" />
                        {post.date}
                      </div>
                      <div className="flex items-center">
                        <Clock size={10} className="mr-1" />
                        <span className="hidden sm:inline">{post.readTime}</span>
                        <span className="sm:hidden">{post.readTime.split(' ')[0]}m</span>
                      </div>
                    </div>

                    {/* Title - Responsive sizing */}
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 leading-tight flex-shrink-0">
                      {post.title}
                      <ArrowUpRight size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform -translate-x-1 group-hover:translate-x-0 sm:w-4 sm:h-4" />
                    </h3>

                    {/* Excerpt - Responsive sizing and line clamp */}
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed flex-1">
                      {post.excerpt}
                    </p>

                    {/* Engagement Stats - Responsive sizing */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Eye size={10} className="mr-1" />
                          {post.views}
                        </div>
                        <div className="flex items-center">
                          <Heart size={10} className="mr-1" />
                          {post.likes}
                        </div>
                        <div className="flex items-center hidden sm:flex">
                          <MessageCircle size={10} className="mr-1" />
                          {post.comments}
                        </div>
                      </div>
                    </div>

                    {/* Tags - Responsive display */}
                    <div className="flex flex-wrap gap-1 sm:gap-2 mt-auto">
                      {post.tags.slice(0, 1).map((tag, index) => (
                        <span
                          key={index}
                          className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
                        >
                          <Tag size={8} className="inline mr-1" />
                          <span className="truncate max-w-16 sm:max-w-none">{tag}</span>
                        </span>
                      ))}
                      {post.tags.length > 1 && (
                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                          +{post.tags.length - 1}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-20">
              <div className="text-gray-300 mb-4 sm:mb-6">
                <Search size={60} className="mx-auto sm:w-20 sm:h-20" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-600 mb-2 sm:mb-3">
                No blog posts found
              </h3>
              <p className="text-gray-500 text-base sm:text-lg mb-6 sm:mb-8">
                Try adjusting your search criteria or browse different categories.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                  setActiveFilter('All Posts');
                }}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination - Mobile Responsive */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-1 sm:space-x-2 py-6 sm:py-8">
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-800 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
            >
              <ChevronLeft size={14} className="mr-1" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </button>

            <div className="flex space-x-1">
              {renderPagination().map((page, index) =>
                page === 'ellipsis' ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 sm:px-4 py-2 sm:py-3 text-gray-500 font-semibold text-xs sm:text-sm"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                        : 'text-gray-700 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-800 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight size={14} className="ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;