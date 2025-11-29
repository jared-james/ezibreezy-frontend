// app/(marketing)/tools/instagram-carousel-splitter/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import { SoftwareApplicationJsonLd } from "@/components/seo/json-ld";
import CarouselSplitterClient from "./client";

export const metadata: Metadata = {
  title: "Instagram Carousel Splitter | Seamless Panorama Swipe Tool",
  description:
    "Split your panoramic images into seamless Instagram carousel slides. Free online tool to create perfect swipeable panoramas without Photoshop.",
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
    "split image for instagram",
    "instagram swipeable post",
    "carousel maker online",
    "split panorama online",
  ],
};

export default function CarouselSplitterPage() {
  return (
    <>
      <SoftwareApplicationJsonLd
        name="Instagram Carousel Splitter"
        description="A browser-based utility to split panoramic images into seamless, pixel-perfect slides for Instagram carousels."
        applicationCategory="MultimediaApplication"
        url="https://www.ezibreezy.com/tools/instagram-carousel-splitter"
        operatingSystem="Any"
        price="0.00"
        rating={{
          ratingValue: 5,
          ratingCount: 45,
        }}
      />
      <div className="min-h-screen flex flex-col bg-background-editorial text-foreground font-serif">
        <LandingPageHeader />

        <CarouselSplitterClient />

        <LandingPageFooter />
      </div>
    </>
  );
}
