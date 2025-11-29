// app/(marketing)/page.tsx

import { Metadata } from "next";
import LandingPageClient from "@/components/landing-page/landing-page-client";
import {
  SoftwareApplicationJsonLd,
  WebPageJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "EziBreezy | The Editorial Desk for Social Media",
  description:
    "Draft, visualize, and schedule content for Instagram, LinkedIn, and X without the spreadsheet chaos. The all-in-one workspace for modern creators.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "EziBreezy | Social Media Scheduling & Planning",
    description:
      "Stop managing content in spreadsheets. Draft, visualize, and auto-publish to Instagram, LinkedIn, and X from one beautiful workspace.",
    url: "https://www.ezibreezy.com",
    siteName: "EziBreezy",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy Dashboard Interface",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  keywords: [
    "social media scheduler",
    "content calendar",
    "instagram auto publish",
    "linkedin scheduler",
    "social media workflow",
    "content approval software",
    "social media management tool",
  ],
};

export default function Page() {
  return (
    <>
      <WebPageJsonLd
        title="EziBreezy | The Editorial Desk for Social Media"
        description="Draft, visualize, and schedule content for Instagram, LinkedIn, and X without the spreadsheet chaos."
        url="https://www.ezibreezy.com"
      />

      {/* 
        2. Software Application Schema: Defines the Product (SaaS)
        This is crucial for ranking for "Software" keywords.
      */}
      <SoftwareApplicationJsonLd
        name="EziBreezy"
        description="A comprehensive social media scheduling and content planning platform for creators and teams."
        applicationCategory="BusinessApplication"
        operatingSystem="Web"
        url="https://www.ezibreezy.com"
        price="0.00" // If you have a free tier
        currency="USD"
        rating={{
          ratingValue: 4.9,
          ratingCount: 85,
        }}
      />

      <LandingPageClient />
    </>
  );
}
