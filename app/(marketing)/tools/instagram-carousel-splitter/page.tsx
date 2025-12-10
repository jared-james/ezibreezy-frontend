// app/(marketing)/tools/instagram-carousel-splitter/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import {
  SoftwareApplicationJsonLd,
  WebPageJsonLd,
} from "@/components/seo/json-ld";
import CarouselSplitterClient from "./client";

export const metadata: Metadata = {
  title: "Instagram Carousel Splitter | Seamless Panorama Swipe Tool",
  description:
    "Split panoramic images into seamless Instagram carousel slides. The perfect tool for aesthetic photo dumps and visual storytelling.",
  alternates: {
    canonical: "/tools/instagram-carousel-splitter",
  },
  openGraph: {
    title: "Instagram Carousel Splitter | Create Seamless Swipes",
    description:
      "The easiest way to split panoramas into seamless 4:5 slides for Instagram. Drag, drop, and export.",
    url: "https://www.ezibreezy.com/tools/instagram-carousel-splitter",
    siteName: "EziBreezy",
    images: [
      {
        url: "/og-carousel-splitter.jpg",
        width: 1200,
        height: 630,
        alt: "Instagram Carousel Splitter Interface",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Carousel Splitter",
    description: "Create seamless panoramic carousels for Instagram instantly.",
    images: ["/og-carousel-splitter.jpg"],
  },
  keywords: [
    "instagram carousel splitter",
    "panorama to carousel",
    "seamless instagram swipe",
    "instagram post template",
    "split image for instagram",
  ],
};

export default function CarouselSplitterPage() {
  return (
    <>
      <WebPageJsonLd
        title="Instagram Carousel Splitter | Seamless Panorama Swipe Tool"
        description="Split panoramic images into seamless Instagram carousel slides."
        url="https://www.ezibreezy.com/tools/instagram-carousel-splitter"
        images={["https://www.ezibreezy.com/og-carousel-splitter.jpg"]}
      />

      <SoftwareApplicationJsonLd
        name="Instagram Carousel Splitter"
        description="A utility to split panoramas into 4:5 seamless carousel slides for Instagram."
        applicationCategory="MultimediaApplication"
        url="https://www.ezibreezy.com/tools/instagram-carousel-splitter"
        operatingSystem="Any"
        price="0"
        image="https://www.ezibreezy.com/og-carousel-splitter.jpg"
      />
      <div className="min-h-screen flex flex-col bg-background-editorial text-foreground font-serif">
        <LandingPageHeader />
        <CarouselSplitterClient />
        <LandingPageFooter />
      </div>
    </>
  );
}
