// app/(marketing)/features/tiktok-scheduler/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import {
  SoftwareApplicationJsonLd,
  WebPageJsonLd,
} from "@/components/seo/json-ld";
import Masthead from "./masthead";
import PhoneIntro from "./phone-intro";
import ProductionCapabilities from "./production-capabilities";
import Inbox from "./inbox";
import TechnicalLedger from "./technical-ledger";
import ComplementaryTools from "./complementary-tools";
import FinalCTA from "./final-cta";

export const metadata: Metadata = {
  title: "TikTok Scheduler | Video, Carousel & Privacy Controls",
  description:
    "The creative workspace for TikTok. Schedule videos and 35-slide carousels, manage comments, and control privacy settings from one desk.",
  alternates: {
    canonical: "/features/tiktok-scheduler",
  },
  openGraph: {
    title: "TikTok Scheduler | EziBreezy",
    description: "The creative workspace. Schedule, visualize, and engage.",
    url: "https://www.ezibreezy.com/features/tiktok-scheduler",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy TikTok Scheduler",
      },
    ],
    type: "website",
  },
};

export default function TikTokSchedulerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif selection:bg-brand-primary/20">
      <WebPageJsonLd
        title="TikTok Scheduler | Video, Carousel & Privacy Controls"
        description="The creative workspace for TikTok. Schedule videos and 35-slide carousels, manage comments, and control privacy settings."
        url="https://www.ezibreezy.com/features/tiktok-scheduler"
      />
      <SoftwareApplicationJsonLd
        name="EziBreezy TikTok Scheduler"
        applicationCategory="BusinessApplication"
        price="25"
        currency="USD"
      />

      <LandingPageHeader />

      <main className="grow w-full max-w-[1400px] mx-auto px-4 md:px-6 pb-24">
        <Masthead />
        <PhoneIntro />
        <ProductionCapabilities />
        <Inbox />
        <TechnicalLedger />
        <ComplementaryTools />
        <FinalCTA />
      </main>

      <LandingPageFooter />
    </div>
  );
}
