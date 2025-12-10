// app/(marketing)/page.tsx

import { Metadata } from "next";
import LandingPageClient from "@/components/landing-page/landing-page-client";
import {
  SoftwareApplicationJsonLd,
  WebPageJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "EziBreezy | The Editorial Social Media Scheduler & Content Planner",
  description:
    "The editorial desk for modern creators. Draft, visualize, and schedule Instagram posts, LinkedIn articles, and Threads from one aesthetic workspace.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "EziBreezy | Social Media Scheduler & Content Planner",
    description:
      "Stop the spreadsheet chaos. The all-in-one editorial workspace to draft, visualize, and schedule content for all social platforms.",
    url: "https://www.ezibreezy.com",
    siteName: "EziBreezy",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy Editorial Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  keywords: [
    "social media scheduler",
    "social media content planner",
    "instagram scheduler",
    "content calendar",
    "social media workflow",
    "buffer alternative",
    "planoly alternative",
  ],
};

export default function Page() {
  return (
    <>
      <WebPageJsonLd
        title="EziBreezy | The Editorial Social Media Scheduler & Content Planner"
        description="The editorial desk for modern creators. Draft, visualize, and schedule Instagram posts, LinkedIn articles, and Threads from one aesthetic workspace."
        url="https://www.ezibreezy.com"
      />
      {/* Main SaaS Product - Price reflects subscription */}
      <SoftwareApplicationJsonLd
        name="EziBreezy"
        applicationCategory="BusinessApplication"
        price="25"
        currency="USD"
      />
      <LandingPageClient />
    </>
  );
}
