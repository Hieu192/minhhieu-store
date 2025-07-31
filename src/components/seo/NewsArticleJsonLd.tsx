'use client';
import Script from 'next/script';

export function NewsArticleJsonLd({ post }: { post: any }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": post.title,
    "datePublished": post.date,
    "image": [`https://yourdomain.com${post.image}`],
    "author": {
      "@type": "Organization",
      "name": "Tên Website hoặc Tác giả",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Tên Website",
      "logo": {
        "@type": "ImageObject",
        "url": "https://yourdomain.com/logo.png"
      }
    },
    "description": post.summary,
    "mainEntityOfPage": `https://yourdomain.com/news/${post.slug}`,
  };

  return (
    <Script
      id="article-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
