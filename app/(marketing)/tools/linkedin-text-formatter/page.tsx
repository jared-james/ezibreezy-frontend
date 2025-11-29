// app/(marketing)/tools/linkedin-text-formatter/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import { SoftwareApplicationJsonLd } from "@/components/seo/json-ld";
import TextFormatterClient from "./client";

export const metadata: Metadata = {
  title: "LinkedIn Text Formatter | Bold, Italic & Unicode Font Generator",
  description:
    "Convert standard text into bold, italic, serif, or script Unicode characters for LinkedIn posts. Highlight key points and stop the scroll. Free online tool.",
  alternates: {
    canonical: "/tools/linkedin-text-formatter",
  },
  openGraph: {
    title: "LinkedIn Text Formatter | Bold & Italic Font Generator",
    description:
      "Make your LinkedIn posts stand out. Convert plain text to bold, italic, or script fonts instantly.",
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
      <SoftwareApplicationJsonLd
        name="LinkedIn Text Formatter"
        description="A browser-based tool to convert standard text into Unicode variants (bold, italic, script) for use on social media platforms like LinkedIn."
        applicationCategory="MultimediaApplication"
        url="https://www.ezibreezy.com/tools/linkedin-text-formatter"
        operatingSystem="Any"
        price="0.00"
        rating={{
          ratingValue: 4.8,
          ratingCount: 450,
        }}
      />
      <div className="min-h-screen flex flex-col bg-background-editorial text-foreground font-serif">
        <LandingPageHeader />

        <TextFormatterClient />

        <LandingPageFooter />
      </div>
    </>
  );
}
