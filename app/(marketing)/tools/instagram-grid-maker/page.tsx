// app/(marketing)/tools/instagram-grid-maker/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import {
  SoftwareApplicationJsonLd,
  WebPageJsonLd,
} from "@/components/seo/json-ld";
import GridMakerClient from "./client";

export const metadata: Metadata = {
  title: "Instagram Grid Maker | Free 3x3, 3x4 & 3x5 Splitter Tool",
  description:
    "Split a single image into a 3x3 grid for your Instagram profile. Create seamless giant square banners and multi-tile layouts instantly. Free tool.",
  alternates: {
    canonical: "/tools/instagram-grid-maker",
  },
  openGraph: {
    title: "Instagram Grid Maker | 3x3 Grid Splitter",
    description:
      "Turn any image into a seamless 3x3, 3x4, or 3x5 grid for your Instagram profile. Fast, simple, and free.",
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
    "3x3 grid generator",
    "split image for instagram",
    "instagram grid splitter",
    "giant square maker",
    "instagram tile maker",
    "photo split online",
  ],
};

export default function GridMakerPage() {
  return (
    <>
      <WebPageJsonLd
        title="Instagram Grid Maker | Free 3x3, 3x4 & 3x5 Splitter Tool"
        description="Split a single image into a 3x3 grid for your Instagram profile. Create seamless giant square banners and multi-tile layouts instantly."
        url="https://www.ezibreezy.com/tools/instagram-grid-maker"
        images={["https://www.ezibreezy.com/og-grid-maker.jpg"]}
      />

      <SoftwareApplicationJsonLd
        name="Instagram Grid Maker"
        description="A browser-based tool to split single images into 3x3, 3x4, or 3x5 grid tiles for aesthetic Instagram profile layouts."
        applicationCategory="MultimediaApplication"
        url="https://www.ezibreezy.com/tools/instagram-grid-maker"
        operatingSystem="Any"
        price="0"
        image="https://www.ezibreezy.com/og-grid-maker.jpg"
      />

      <div className="min-h-screen flex flex-col bg-background-editorial text-foreground font-serif">
        <LandingPageHeader />
        <GridMakerClient />
        <LandingPageFooter />
      </div>
    </>
  );
}
