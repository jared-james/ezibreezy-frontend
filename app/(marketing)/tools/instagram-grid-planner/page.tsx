// app/(marketing)/tools/instagram-grid-planner/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import { SoftwareApplicationJsonLd } from "@/components/seo/json-ld";
import GridPlannerClient from "./client"; // Logic moved to client component

export const metadata: Metadata = {
  title: "Instagram Grid Planner | Free Visual Feed Preview Tool",
  description:
    "Plan your Instagram feed visually. Drag and drop photos, rearrange your grid, and curate your aesthetic before posting. Free online tool, no login required.",
  alternates: {
    canonical: "/tools/instagram-grid-planner",
  },
  openGraph: {
    title: "Instagram Grid Planner | Visual Feed Preview",
    description:
      "The easiest way to plan your Instagram grid. Drag, drop, and rearrange photos to find your perfect aesthetic.",
    url: "https://www.ezibreezy.com/tools/instagram-grid-planner",
    siteName: "EziBreezy",
    images: [
      {
        url: "/og-instagram-grid-planner.jpg",
        width: 1200,
        height: 630,
        alt: "Instagram Grid Planner Interface",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Grid Planner",
    description: "Visually plan your Instagram feed with drag and drop.",
    images: ["/og-instagram-grid-planner.jpg"],
  },
  keywords: [
    "instagram grid planner",
    "visual feed planner",
    "instagram layout tool",
    "preview instagram feed",
    "drag and drop instagram",
    "aesthetic planner",
    "grid preview tool",
    "instagram feed organizer",
  ],
};

export default function GridPlannerPage() {
  return (
    <>
      <SoftwareApplicationJsonLd
        name="Instagram Grid Planner"
        description="A browser-based tool to visually plan and rearrange Instagram posts in a grid layout before publishing."
        applicationCategory="MultimediaApplication"
        url="https://www.ezibreezy.com/tools/instagram-grid-planner"
        operatingSystem="Any"
        price="0.00"
        rating={{
          ratingValue: 4.9,
          ratingCount: 156,
        }}
      />

      <div className="min-h-screen flex flex-col bg-background-editorial text-foreground font-serif">
        <LandingPageHeader />

        <GridPlannerClient />

        <LandingPageFooter />
      </div>
    </>
  );
}
