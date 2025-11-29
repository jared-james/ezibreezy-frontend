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
  title: "Instagram Font Generator | Copy & Paste Aesthetic Fonts",
  description:
    "Free tool to generate bold, italic, script, and aesthetic fonts for your Instagram bio and captions. No app required.",
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
    "instagram font generator",
    "ig fonts",
    "instagram bio fonts",
    "aesthetic font generator",
    "instagram caption font",
    "bold text instagram",
    "cursive text generator",
  ],
};

export default function InstagramFontGeneratorPage() {
  return (
    <>
      <WebPageJsonLd
        title="Instagram Font Generator | Copy & Paste Aesthetic Fonts"
        description="Free tool to generate bold, italic, script, and aesthetic fonts for your Instagram bio and captions. No app required."
        url="https://www.ezibreezy.com/tools/instagram-font-generator"
        images={["https://www.ezibreezy.com/og-font-generator.jpg"]}
      />

      <SoftwareApplicationJsonLd
        name="Instagram Font Generator"
        description="A free web tool to convert standard text into aesthetic Unicode fonts (bold, italic, script) for Instagram bios and captions."
        applicationCategory="MultimediaApplication"
        url="https://www.ezibreezy.com/tools/instagram-font-generator"
        operatingSystem="Any"
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
