// app/(marketing)/tools/linkedin-text-formatter/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import {
  SoftwareApplicationJsonLd,
  WebPageJsonLd,
} from "@/components/seo/json-ld";
import TextFormatterClient from "./client";

export const metadata: Metadata = {
  title: "LinkedIn Text Formatter | Bold, Italic & Script Font Generator",
  description:
    "Convert plain text into bold, italic, and script unicode formats for LinkedIn posts. Stop the scroll with styled headlines and lists. Free tool.",
  alternates: {
    canonical: "/tools/linkedin-text-formatter",
  },
  openGraph: {
    title: "LinkedIn Text Formatter | Bold & Italic Font Generator",
    description:
      "Make your LinkedIn posts stand out. Convert plain text to bold, italic, or script fonts instantly to highlight key points.",
    url: "https://www.ezibreezy.com/tools/linkedin-text-formatter",
    siteName: "EziBreezy",
    images: [
      {
        url: "/og-text-formatter.jpg",
        width: 1200,
        height: 630,
        alt: "LinkedIn Text Formatter Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedIn Text Formatter",
    description: "Format your LinkedIn posts with bold and italic text.",
    images: ["/og-text-formatter.jpg"],
  },
  keywords: [
    "linkedin text formatter",
    "bold text linkedin",
    "italic text linkedin",
    "linkedin font generator",
    "unicode text converter",
    "linkedin post formatting",
    "social media text styler",
  ],
};

export default function TextFormatterPage() {
  return (
    <>
      <WebPageJsonLd
        title="LinkedIn Text Formatter | Bold, Italic & Script Font Generator"
        description="Convert plain text into bold, italic, and script unicode formats for LinkedIn posts. Stop the scroll with styled headlines and lists."
        url="https://www.ezibreezy.com/tools/linkedin-text-formatter"
        images={["https://www.ezibreezy.com/og-text-formatter.jpg"]}
      />

      <SoftwareApplicationJsonLd
        name="LinkedIn Text Formatter"
        description="A browser-based tool to convert standard text into Unicode variants (bold, italic, script) for use on social media platforms like LinkedIn."
        applicationCategory="MultimediaApplication"
        url="https://www.ezibreezy.com/tools/linkedin-text-formatter"
        operatingSystem="Any"
        price="0"
        image="https://www.ezibreezy.com/og-text-formatter.jpg"
      />

      <div className="min-h-screen flex flex-col bg-background-editorial text-foreground font-serif">
        <LandingPageHeader />
        <TextFormatterClient />
        <LandingPageFooter />
      </div>
    </>
  );
}
