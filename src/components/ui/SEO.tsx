import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
  slug?: string;
  canonical?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image, 
  article, 
  slug,
  canonical 
}) => {
  const defaultTitle = 'Sujoy Moulick | Full Stack Developer & Tech Blogger';
  const defaultDescription = 'Explore insights on AI, Web3, and Software Engineering. Portfolio and blog of Sujoy Moulick, a creative engineer based in India.';
  const siteUrl = 'https://sujoymoulick.online'; // Replace with actual domain if different
  const defaultImage = `${siteUrl}/og-image.png`;
  const twitterHandle = '@sujoymoulick';

  const seo = {
    title: title ? `${title} | Sujoy Moulick` : defaultTitle,
    description: description || defaultDescription,
    image: image || defaultImage,
    url: `${siteUrl}${slug ? `/${slug}` : ''}`,
  };

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />
      <link rel="canonical" href={canonical || seo.url} />

      {seo.url && <meta property="og:url" content={seo.url} />}
      {(article ? true : null) && <meta property="og:type" content="article" />}
      {seo.title && <meta property="og:title" content={seo.title} />}
      {seo.description && (
        <meta property="og:description" content={seo.description} />
      )}
      {seo.image && <meta property="og:image" content={seo.image} />}

      <meta name="twitter:card" content="summary_large_image" />
      {twitterHandle && (
        <meta name="twitter:creator" content={twitterHandle} />
      )}
      {seo.title && <meta name="twitter:title" content={seo.title} />}
      {seo.description && (
        <meta name="twitter:description" content={seo.description} />
      )}
      {seo.image && <meta name="twitter:image" content={seo.image} />}
      
      {/* AdSense Verification */}
      <meta name="google-adsense-account" content="ca-pub-6650428585093774" />
    </Helmet>
  );
};
