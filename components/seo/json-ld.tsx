// components/seo/json-ld.tsx

interface SoftwareApplicationProps {
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem?: string;
  url: string;
  rating?: {
    ratingValue: number;
    ratingCount: number;
  };
  price?: string;
  currency?: string;
}

export function SoftwareApplicationJsonLd({
  name,
  description,
  applicationCategory,
  operatingSystem = "Web",
  url,
  rating,
  price = "0.00",
  currency = "USD",
}: SoftwareApplicationProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: name,
    description: description,
    applicationCategory: applicationCategory,
    operatingSystem: operatingSystem,
    url: url,
    offers: {
      "@type": "Offer",
      price: price,
      priceCurrency: currency,
    },
    ...(rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating.ratingValue,
        ratingCount: rating.ratingCount,
      },
    }),
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
    description: description,
    url: url,
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
