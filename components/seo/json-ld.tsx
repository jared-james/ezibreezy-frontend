// components/seo/json-ld.tsx

interface SoftwareApplicationProps {
  name?: string;
  description?: string;
  applicationCategory?: string;
  operatingSystem?: string;
  url?: string;
  rating?: {
    ratingValue: number;
    ratingCount: number;
  };
  price?: string;
  currency?: string;
  image?: string;
}

export function SoftwareApplicationJsonLd({
  name = "EziBreezy",
  description = "A comprehensive social media scheduling and content planning platform for creators and teams.",
  applicationCategory = "BusinessApplication",
  operatingSystem = "Web",
  url = "https://www.ezibreezy.com",
  price = "25",
  currency = "USD",
  rating = {
    ratingValue: 5,
    ratingCount: 45,
  },
  image = "https://www.ezibreezy.com/og-home.jpg",
}: SoftwareApplicationProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    applicationCategory,
    operatingSystem,
    url,
    image,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating.ratingValue,
      ratingCount: rating.ratingCount,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface WebPageJsonLdProps {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  images?: string[];
}

export function WebPageJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  images = [],
}: WebPageJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url,
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    ...(images.length > 0 && { image: images }),
    isPartOf: {
      "@type": "WebSite",
      name: "EziBreezy",
      url: "https://www.ezibreezy.com",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
