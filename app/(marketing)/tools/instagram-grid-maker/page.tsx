// app/(marketing)/tools/instagram-grid-maker/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import {
  SoftwareApplicationJsonLd,
  WebPageJsonLd,
} from "@/components/seo/json-ld";
import GridPlannerClient from "./client";

export const metadata: Metadata = {
  title: "Instagram Grid Maker | Free 3x3, 3x4, 3x5 Feed Grid Generator",
  description:
    "Split a single image into 3x3, 3x4, or 3x5 grid tiles for Instagram. Create seamless profile grids in seconds. No login required.",
  alternates: {
    canonical: "/tools/instagram-grid-maker",
  },
  openGraph: {
    title: "Instagram Grid Maker | Grid Splitter for Instagram",
    description:
      "Turn any image into a seamless 3x3 or multi-tile grid for your Instagram profile. Fast, simple, and free.",
    url: "https://www.ezibreezy.com/tools/instagram-grid-maker",
    siteName: "EziBreezy",
    images: [
      {
        url: "/og-grid-maker.jpg",
        width: 1200,
        height: 630,
        alt: "Instagram Grid Maker Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Grid Maker",
    description: "Generate 3x3 and multi-tile Instagram grids instantly.",
    images: ["/og-grid-maker.jpg"],
  },
  keywords: [
    "instagram grid maker",
    "instagram grid generator",
    "instagram grid splitter",
    "3x3 grid instagram",
    "instagram layout tool",
    "multi tile instagram image",
    "instagram grid preview",
  ],
};

export default function GridMakerPage() {
  return (
    <>
      <WebPageJsonLd
        title="Instagram Grid Maker | Free Instagram Grid Generator"
        description="Split a single image into 3x3, 3x4, or 3x5 grid tiles for Instagram. Create seamless profile grids in seconds."
        url="https://www.ezibreezy.com/tools/instagram-grid-maker"
        images={["https://www.ezibreezy.com/og-grid-maker.jpg"]}
      />

      <SoftwareApplicationJsonLd
        name="Instagram Grid Maker"
        description="A browser-based tool to split images into 3x3, 3x4, or 3x5 Instagram grid tiles for aesthetic profile layouts."
        applicationCategory="MultimediaApplication"
        operatingSystem="Any"
        url="https://www.ezibreezy.com/tools/instagram-grid-maker"
        image="https://www.ezibreezy.com/og-grid-maker.jpg"
      />

      <div className="min-h-screen flex flex-col bg-background-editorial text-foreground font-serif">
        <LandingPageHeader />
        <GridPlannerClient />
        <LandingPageFooter />
      </div>
    </>
  );
}
