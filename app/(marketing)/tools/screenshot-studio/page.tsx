// app/(marketing)/tools/screenshot-studio/page.tsx

import { Metadata } from "next";
import { SoftwareApplicationJsonLd } from "@/components/seo/json-ld";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import ScreenshotStudioClient from "./client";

export const metadata: Metadata = {
  title: "Screenshot Studio | Free Mockup Generator & Beautifier",
  description:
    "Turn boring screenshots into viral social media posts. Add aesthetic backgrounds, rounded corners, shadows, and MacOS frames instantly. Free online tool.",
  alternates: {
    canonical: "/tools/screenshot-studio",
  },
  openGraph: {
    title: "Screenshot Studio | Create Beautiful Mockups Instantly",
    description:
      "The fastest way to wrap screenshots in aesthetic backgrounds for Twitter, LinkedIn, and Instagram.",
    url: "https://www.ezibreezy.com/tools/screenshot-studio",
    siteName: "EziBreezy",
    images: [
      {
        url: "/og-screenshot-studio.jpg",
        width: 1200,
        height: 630,
        alt: "Screenshot Studio Interface",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Screenshot Studio | Free Mockup Generator",
    description:
      "Turn boring screenshots into viral social media posts instantly.",
    images: ["/og-screenshot-studio.jpg"],
  },
  keywords: [
    "screenshot beautifier",
    "screenshot mockup generator",
    "twitter screenshot maker",
    "add background to image online",
    "screenshot frame generator",
    "macos window mockup",
    "social media image tools",
  ],
};

export default function ScreenshotStudioPage() {
  return (
    <>
      <SoftwareApplicationJsonLd
        name="Screenshot Studio"
        description="A browser-based utility to beautify screenshots with backgrounds, shadows, and frames for social media sharing."
        applicationCategory="DesignApplication"
        url="https://www.ezibreezy.com/tools/screenshot-studio"
        operatingSystem="Any"
        price="0.00"
        rating={{
          ratingValue: 4.9,
          ratingCount: 120,
        }}
      />
      <div className="min-h-screen flex flex-col bg-background-editorial text-foreground font-serif">
        <LandingPageHeader />

        <ScreenshotStudioClient />

        <LandingPageFooter />
      </div>
    </>
  );
}
