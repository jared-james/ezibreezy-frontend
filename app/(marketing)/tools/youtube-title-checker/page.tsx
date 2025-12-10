// app/(marketing)/tools/youtube-title-checker/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import {
  SoftwareApplicationJsonLd,
  WebPageJsonLd,
} from "@/components/seo/json-ld";
import TitleCheckerClient from "./client";

export const metadata: Metadata = {
  title: "YouTube Title Checker | Length & Truncation Preview Tool",
  description:
    "Prevent title truncation on mobile and desktop. A free tool to visualize YouTube video titles in search results and suggested feeds to boost CTR.",
  alternates: {
    canonical: "/tools/youtube-title-checker",
  },
  openGraph: {
    title: "YouTube Title Checker | Optimize for CTR",
    description:
      "Don't let your hook get cut off. Preview your YouTube titles exactly as they appear in search and suggested feeds.",
    url: "https://www.ezibreezy.com/tools/youtube-title-checker",
    siteName: "EziBreezy",
    images: [
      {
        url: "/og-title-checker.jpg",
        width: 1200,
        height: 630,
        alt: "YouTube Title Checker Interface",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Title Checker",
    description: "Preview YouTube titles on mobile and desktop instantly.",
    images: ["/og-title-checker.jpg"],
  },
  keywords: [
    "youtube title checker",
    "youtube title length",
    "title truncation tool",
    "youtube seo tool",
    "video title optimizer",
    "ctr calculator",
    "youtube preview tool",
  ],
};

export default function TitleCheckerPage() {
  return (
    <>
      <WebPageJsonLd
        title="YouTube Title Checker | Length & Truncation Preview Tool"
        description="Prevent title truncation on mobile and desktop. A free tool to visualize YouTube video titles in search results and suggested feeds to boost CTR."
        url="https://www.ezibreezy.com/tools/youtube-title-checker"
        images={["https://www.ezibreezy.com/og-title-checker.jpg"]}
      />

      <SoftwareApplicationJsonLd
        name="YouTube Title Checker"
        description="A browser-based utility to analyze YouTube video titles for length, truncation, and keyword impact across different devices."
        applicationCategory="MultimediaApplication"
        url="https://www.ezibreezy.com/tools/youtube-title-checker"
        operatingSystem="Any"
        price="0"
        image="https://www.ezibreezy.com/og-title-checker.jpg"
      />

      <div className="min-h-screen flex flex-col bg-background-editorial text-foreground font-serif">
        <LandingPageHeader />
        <TitleCheckerClient />
        <LandingPageFooter />
      </div>
    </>
  );
}
