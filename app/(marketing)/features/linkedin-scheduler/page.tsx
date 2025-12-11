// app/(marketing)/features/linkedin-scheduler/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import {
  SoftwareApplicationJsonLd,
  WebPageJsonLd,
} from "@/components/seo/json-ld";
import Masthead from "./masthead";
import CarouselIntro from "./carousel-intro";
import Analytics from "./analytics";
import Inbox from "./inbox";
import TechnicalLedger from "./technical-ledger";
import ComplementaryTools from "./complementary-tools";
import FinalCTA from "./final-cta";

export const metadata: Metadata = {
  title: "LinkedIn Scheduler | Articles, Carousels & Analytics",
  description:
    "The professional workspace for LinkedIn. Schedule PDF carousels, format articles, tag companies, and track visitor demographics.",
  alternates: {
    canonical: "/features/linkedin-scheduler",
  },
  openGraph: {
    title: "LinkedIn Scheduler | EziBreezy",
    description:
      "The professional workspace. Schedule, format, analyze, and engage.",
    url: "https://www.ezibreezy.com/features/linkedin-scheduler",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy LinkedIn Scheduler",
      },
    ],
    type: "website",
  },
};

export default function LinkedInSchedulerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif selection:bg-brand-primary/20">
      <WebPageJsonLd
        title="LinkedIn Scheduler | Articles, Carousels & Analytics"
        description="The professional workspace for LinkedIn. Schedule PDF carousels, format articles, tag companies, and track visitor demographics."
        url="https://www.ezibreezy.com/features/linkedin-scheduler"
      />
      <SoftwareApplicationJsonLd
        name="EziBreezy LinkedIn Scheduler"
        applicationCategory="BusinessApplication"
        price="25"
        currency="USD"
      />

      <LandingPageHeader />

      <main className="grow w-full max-w-[1400px] mx-auto px-4 md:px-6 pb-24">
        <Masthead />
        <CarouselIntro />
        <Analytics />
        <Inbox />
        <TechnicalLedger />
        <ComplementaryTools />
        <FinalCTA />
      </main>

      <LandingPageFooter />
    </div>
  );
}
