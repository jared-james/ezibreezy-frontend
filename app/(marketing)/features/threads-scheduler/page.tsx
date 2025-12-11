// app/(marketing)/features/threads-scheduler/page.tsx

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
  title: "Threads Scheduler | Thread Composer & Carousels",
  description:
    "The editorial workspace for Threads. Schedule multi-post threads, mixed media carousels, and manage conversations from one desk.",
  alternates: {
    canonical: "/features/threads-scheduler",
  },
  openGraph: {
    title: "Threads Scheduler | EziBreezy",
    description: "The modern conversation. Schedule, visualize, and connect.",
    url: "https://www.ezibreezy.com/features/threads-scheduler",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy Threads Scheduler",
      },
    ],
    type: "website",
  },
};

export default function ThreadsSchedulerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif selection:bg-brand-primary/20">
      <WebPageJsonLd
        title="Threads Scheduler | Thread Composer & Carousels"
        description="The editorial workspace for Threads. Schedule multi-post threads, mixed media carousels, and manage conversations."
        url="https://www.ezibreezy.com/features/threads-scheduler"
      />
      <SoftwareApplicationJsonLd
        name="EziBreezy Threads Scheduler"
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
