// app/(marketing)/features/twitter-scheduler/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import {
  SoftwareApplicationJsonLd,
  WebPageJsonLd,
} from "@/components/seo/json-ld";
import Masthead from "./masthead";
import ThreadIntro from "./thread-intro";
import Analytics from "./analytics";
import Inbox from "./inbox";
import TechnicalLedger from "./technical-ledger";
import ComplementaryTools from "./complementary-tools";
import FinalCTA from "./final-cta";

export const metadata: Metadata = {
  title: "Twitter Scheduler | Threads, Polls & Analytics",
  description:
    "The editorial workspace for X (Twitter). Schedule threads, format tweets, and manage conversations from one desk.",
  alternates: {
    canonical: "/features/twitter-scheduler",
  },
  openGraph: {
    title: "Twitter Scheduler | EziBreezy",
    description:
      "The editorial workspace for X. Schedule threads, analyze impact, and engage.",
    url: "https://www.ezibreezy.com/features/twitter-scheduler",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy Twitter Scheduler",
      },
    ],
    type: "website",
  },
};

export default function TwitterSchedulerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif selection:bg-brand-primary/20">
      <WebPageJsonLd
        title="Twitter Scheduler | Threads, Polls & Analytics"
        description="The editorial workspace for X (Twitter). Schedule threads, format tweets, and manage conversations from one desk."
        url="https://www.ezibreezy.com/features/twitter-scheduler"
      />
      <SoftwareApplicationJsonLd
        name="EziBreezy Twitter Scheduler"
        applicationCategory="BusinessApplication"
        price="25"
        currency="USD"
      />

      <LandingPageHeader />

      <main className="grow w-full max-w-[1400px] mx-auto px-4 md:px-6 pb-24">
        <Masthead />
        <ThreadIntro />
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
