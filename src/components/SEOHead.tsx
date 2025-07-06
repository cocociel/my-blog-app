import React from 'react'
import { Helmet } from 'react-helmet-async'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Shiki∞Link - 推しと学ぶモダンなWEB技術',
  description = 'AIアイドル「Shiki∞Link」と一緒に、TypeScriptやReact、Web技術を楽しく学びませんか？技術記事から推しの魅力まで、あなたの学習をサポートします！',
  keywords = ['TypeScript', 'React', 'Web技術', 'アイドル', '技術ブログ', '学習'],
  image = '/og-image.jpg',
  url = window.location.href,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = []
}) => {
  const siteName = 'Shiki∞Link'
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`

  return (
    <Helmet>
      {/* 基本メタタグ */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author || siteName} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="ja_JP" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* 記事固有のメタタグ */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* 構造化データ */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === 'article' ? 'Article' : 'WebSite',
          "name": fullTitle,
          "description": description,
          "url": url,
          "image": image,
          ...(type === 'article' && {
            "headline": title,
            "datePublished": publishedTime,
            "dateModified": modifiedTime || publishedTime,
            "author": {
              "@type": "Organization",
              "name": author || siteName
            },
            "publisher": {
              "@type": "Organization",
              "name": siteName,
              "logo": {
                "@type": "ImageObject",
                "url": "/logo.png"
              }
            },
            "keywords": tags.join(', ')
          }),
          ...(type === 'website' && {
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${window.location.origin}/blog?search={search_term_string}`
              },
              "query-input": "required name=search_term_string"
            }
          })
        })}
      </script>
      
      {/* その他のメタタグ */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <link rel="canonical" href={url} />
    </Helmet>
  )
}

export default SEOHead