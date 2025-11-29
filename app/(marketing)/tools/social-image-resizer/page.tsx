// app/(marketing)/tools/social-image-resizer/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import {
  SoftwareApplicationJsonLd,
  WebPageJsonLd,
} from "@/components/seo/json-ld";
import SocialResizerClient from "./client";

export const metadata: Metadata = {
  title: "Social Image Resizer | Crop Once, Post Everywhere",
  description:
    "Resize and crop a single image for Instagram, Twitter/X, LinkedIn, and Facebook instantly. Export pixel-perfect formats without complex software.",
  alternates: {
    canonical: "/tools/social-image-resizer",
  },
  openGraph: {
    title: "Social Image Resizer | The Multi-Crop Utility",
    description:
      "Stop cropping the same image 5 times. Upload once, adjust for every platform, and export.",
    url: "https://www.ezibreezy.com/tools/social-image-resizer",
    siteName: "EziBreezy",
    images: [
      {
        url: "/og-social-resizer.jpg",
        width: 1200,
        height: 630,
        alt: "Social Image Resizer Interface",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Social Image Resizer",
    description: "Crop once, export for every social platform.",
    images: ["/og-social-resizer.jpg"],
  },
  keywords: [
    "social media image resizer",
    "instagram crop tool",
    "twitter header size converter",
    "linkedin image resizer",
    "content repurposing tool",
    "social media crop online",
    "image aspect ratio converter",
  ],
};

export default function SocialResizerPage() {
  return (
    <>
      <WebPageJsonLd
        title="Social Image Resizer | Crop Once, Post Everywhere"
        description="Resize and crop a single image for Instagram, Twitter/X, LinkedIn, and Facebook instantly."
        url="https://www.ezibreezy.com/tools/social-image-resizer"
        images={["https://www.ezibreezy.com/og-social-resizer.jpg"]}
      />

      <SoftwareApplicationJsonLd
        name="Social Image Resizer"
        description="A browser-based utility to resize and crop images for multiple social media platforms simultaneously."
        applicationCategory="MultimediaApplication"
        url="https://www.ezibreezy.com/tools/social-image-resizer"
        operatingSystem="Any"
        image="https://www.ezibreezy.com/og-social-resizer.jpg"
      />

      <div className="min-h-screen flex flex-col bg-background-editorial text-foreground font-serif">
        <LandingPageHeader />
        <SocialResizerClient />
        <LandingPageFooter />
      </div>
    </>
  );
}
