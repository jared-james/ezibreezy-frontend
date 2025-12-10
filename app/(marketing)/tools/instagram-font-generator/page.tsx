// app/(marketing)/tools/instagram-font-generator/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import {
  SoftwareApplicationJsonLd,
  WebPageJsonLd,
} from "@/components/seo/json-ld";
import FontGeneratorClient from "./client";

export const metadata: Metadata = {
  title: "Instagram Font Generator | Copy & Paste Aesthetic IG Fonts",
  description:
    "Free IG font generator for bios and captions. Create bold, italic, and aesthetic text to make your Instagram bio ideas stand out. No app required.",
  alternates: {
    canonical: "/tools/instagram-font-generator",
  },
  openGraph: {
    title: "Instagram Font Generator | Aesthetic Text Maker",
    description:
      "Convert normal text into cool unicode fonts for your Instagram bio and posts.",
    url: "https://www.ezibreezy.com/tools/instagram-font-generator",
    siteName: "EziBreezy",
    images: [
      {
        url: "/og-font-generator.jpg",
        width: 1200,
        height: 630,
        alt: "Instagram Font Generator Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Font Generator",
    description: "Generate bold, italic, and script fonts for Instagram.",
    images: ["/og-font-generator.jpg"],
  },
  keywords: [
    "ig fonts",
    "instagram font generator",
    "instagram bio ideas",
    "font maker for instagram",
    "aesthetic fonts copy paste",
    "instagram caption font",
    "bold text instagram",
  ],
};

export default function InstagramFontGeneratorPage() {
  return (
    <>
      <WebPageJsonLd
        title="Instagram Font Generator | Copy & Paste Aesthetic IG Fonts"
        description="Free IG font generator for bios and captions. Create bold, italic, and aesthetic text to make your Instagram bio ideas stand out."
        url="https://www.ezibreezy.com/tools/instagram-font-generator"
        images={["https://www.ezibreezy.com/og-font-generator.jpg"]}
      />

      <SoftwareApplicationJsonLd
        name="Instagram Font Generator"
        description="A free web tool to generate aesthetic IG fonts and bio text styles."
        applicationCategory="MultimediaApplication"
        url="https://www.ezibreezy.com/tools/instagram-font-generator"
        operatingSystem="Any"
        price="0" // Explicitly free
        image="https://www.ezibreezy.com/og-font-generator.jpg"
      />

      <div className="min-h-screen flex flex-col bg-background-editorial text-foreground font-serif">
        <LandingPageHeader />
        <FontGeneratorClient />
        <LandingPageFooter />
      </div>
    </>
  );
}
