// app/(marketing)/features/instagram-scheduler/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import {
  SoftwareApplicationJsonLd,
  WebPageJsonLd,
} from "@/components/seo/json-ld";
import Masthead from "./masthead";
import GridIntro from "./grid-intro";
import Analytics from "./analytics";
import Inbox from "./inbox";
import TechnicalLedger from "./technical-ledger";
import ComplementaryTools from "./complementary-tools";
import FinalCTA from "./final-cta";

export const metadata: Metadata = {
  title: "Instagram Scheduler | Visual Planner, Inbox & Analytics",
  description:
    "The editorial workspace for Instagram. Plan your grid, understand your audience with deep analytics, and manage conversations from one desk.",
  alternates: {
    canonical: "/features/instagram-scheduler",
  },
  openGraph: {
    title: "Instagram Scheduler | EziBreezy",
    description:
      "The editorial workspace for Instagram. Plan, visualize, measure, and connect.",
    url: "https://www.ezibreezy.com/features/instagram-scheduler",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy Instagram Scheduler",
      },
    ],
    type: "website",
  },
};

export default function InstagramSchedulerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif selection:bg-brand-primary/20">
      <WebPageJsonLd
        title="Instagram Scheduler | Visual Grid Planner"
        description="The editorial workspace for Instagram. Visually plan your grid, schedule Reels, track analytics, and manage your inbox."
        url="https://www.ezibreezy.com/features/instagram-scheduler"
      />
      <SoftwareApplicationJsonLd
        name="EziBreezy Instagram Scheduler"
        applicationCategory="BusinessApplication"
        price="25"
        currency="USD"
      />

      <LandingPageHeader />

      <main className="grow w-full max-w-[1400px] mx-auto px-4 md:px-6 pb-24">
        <Masthead />
        <GridIntro />
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
