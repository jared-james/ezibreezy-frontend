// app/(marketing)/tools/instagram-grid-planner/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import {
  SoftwareApplicationJsonLd,
  WebPageJsonLd,
} from "@/components/seo/json-ld";
import GridPlannerClient from "./client";

export const metadata: Metadata = {
  title: "Instagram Grid Planner | Free Visual Feed & Content Planner",
  description:
    "Visually plan your Instagram feed. Drag and drop photos to create the perfect aesthetic grid layout before you schedule content. Free online tool.",
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
    "instagram feed planner",
    "visual content planner",
    "instagram layout tool",
    "preview instagram feed",
    "aesthetic planner",
  ],
};

export default function GridPlannerPage() {
  return (
    <>
      <WebPageJsonLd
        title="Instagram Grid Planner | Free Visual Feed & Content Planner"
        description="Visually plan your Instagram feed. Drag and drop photos to create the perfect aesthetic grid layout."
        url="https://www.ezibreezy.com/tools/instagram-grid-planner"
        images={["https://www.ezibreezy.com/og-instagram-grid-planner.jpg"]}
      />

      <SoftwareApplicationJsonLd
        name="Instagram Grid Planner"
        description="A drag-and-drop tool to plan and visualize Instagram feed aesthetics."
        applicationCategory="MultimediaApplication"
        url="https://www.ezibreezy.com/tools/instagram-grid-planner"
        operatingSystem="Any"
        price="0"
        image="https://www.ezibreezy.com/og-instagram-grid-planner.jpg"
      />

      <div className="min-h-screen flex flex-col bg-background-editorial text-foreground font-serif">
        <LandingPageHeader />
        <GridPlannerClient />
        <LandingPageFooter />
      </div>
    </>
  );
}
