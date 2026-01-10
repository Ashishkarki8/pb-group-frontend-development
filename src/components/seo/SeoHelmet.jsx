

import { Helmet } from 'react-helmet-async';

// rest of your SeoHelmet component stays the same


const SeoHelmet = ({ 
  title = "", 
  description = "", 
  image = "", 
  url = "", 
  blogPost = null,
  twitterHandle = "@pbgroup",
  locale = "en_US",
  siteName = "PB Group"
}) => {
  // Ensure we have fallback values
  const seoTitle = title || "PB Group - Default Title";
  const seoDescription = description || "Default description for PB Group website";
  const seoImage = image || "/default-og-image.jpg";
  const canonicalUrl = url || window.location.href;

  // Generate structured data for articles
  const structuredData = blogPost ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": seoTitle,
    "description": seoDescription,
    "image": {
      "@type": "ImageObject",
      "url": seoImage,
      "width": 1200,
      "height": 630
    },
    "author": {
      "@type": "Person",
      "name": blogPost.author
    },
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "logo": {
        "@type": "ImageObject",
        "url": "/logo.png"
      }
    },
    "datePublished": blogPost.date,
    "dateModified": blogPost.modifiedDate || blogPost.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    }
  } : {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": canonicalUrl,
    "description": seoDescription
  };

  return (
    <Helmet>
      {/* 🔹 Basic Meta */}
      <html lang="en" />
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="content-language" content="en" />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="googlebot" content="index, follow" />
      
      {/* 🔹 Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* 🔹 Open Graph */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${seoTitle} - Featured Image`} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={blogPost ? "article" : "website"} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      {/* 🔹 Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      <meta name="twitter:image:alt" content={`${seoTitle} - Featured Image`} />

      {/* 🔹 Blog/Article-specific Meta */}
      {blogPost && (
        <>
          <meta name="keywords" content={blogPost.tags?.join(", ") || ""} />
          <meta property="article:section" content={blogPost.category} />
          <meta property="article:published_time" content={blogPost.date} />
          <meta property="article:modified_time" content={blogPost.modifiedDate || blogPost.date} />
          <meta property="article:author" content={blogPost.author} />
          {blogPost.tags?.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* 🔹 Additional SEO Meta */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#000000" />
      
      {/* 🔹 Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* 🔹 Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* 🔹 Additional meta for specific content types */}
      {blogPost?.readingTime && (
        <meta name="twitter:label1" content="Reading time" />
      )}
      {blogPost?.readingTime && (
        <meta name="twitter:data1" content={`${blogPost.readingTime} min read`} />
      )}
    </Helmet>
  );
};

export default SeoHelmet;