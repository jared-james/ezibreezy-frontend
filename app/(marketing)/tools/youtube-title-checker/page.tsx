import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import { SoftwareApplicationJsonLd } from "@/components/seo/json-ld";
import TitleCheckerClient from "./client";

export const metadata: Metadata = {
  title: "YouTube Title Checker | CTR Optimizer & Truncation Preview",
  description:
    "Check your YouTube video titles for truncation on mobile and desktop. Visualize your click-through rate potential before you publish. Free tool.",
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
    "video title optimizer",
    "ctr optimizer",
    "youtube seo tool",
    "title truncation checker",
    "youtube preview tool",
  ],
};

export default function TitleCheckerPage() {
  return (
    <>
      <SoftwareApplicationJsonLd
        name="YouTube Title Checker"
        description="A browser-based utility to analyze YouTube video titles for length, truncation, and keyword impact across different devices."
        applicationCategory="MultimediaApplication"
        url="https://www.ezibreezy.com/tools/youtube-title-checker"
        operatingSystem="Any"
        price="0.00"
        rating={{
          ratingValue: 5,
          ratingCount: 45,
        }}
      />
      <div className="min-h-screen flex flex-col bg-background-editorial text-foreground font-serif">
        <LandingPageHeader />

        <TitleCheckerClient />

        <LandingPageFooter />
      </div>
    </>
  );
}
