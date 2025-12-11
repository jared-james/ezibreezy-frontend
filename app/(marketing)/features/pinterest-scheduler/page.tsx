// app/(marketing)/features/pinterest-scheduler/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import {
  SoftwareApplicationJsonLd,
  WebPageJsonLd,
} from "@/components/seo/json-ld";
import Masthead from "./masthead";
import BoardIntro from "./board-intro";
import Analytics from "./analytics";
import Inbox from "./inbox";
import TechnicalLedger from "./technical-ledger";
import ComplementaryTools from "./complementary-tools";
import FinalCTA from "./final-cta";

export const metadata: Metadata = {
  title: "Pinterest Scheduler | Board Management & Pin Planner",
  description:
    "The visual workspace for Pinterest. Schedule Pins, manage Boards, and drive long-tail traffic from one editorial desk.",
  alternates: {
    canonical: "/features/pinterest-scheduler",
  },
  openGraph: {
    title: "Pinterest Scheduler | EziBreezy",
    description: "The curator's archive. Schedule, organize, and inspire.",
    url: "https://www.ezibreezy.com/features/pinterest-scheduler",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy Pinterest Scheduler",
      },
    ],
    type: "website",
  },
};

export default function PinterestSchedulerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif selection:bg-brand-primary/20">
      <WebPageJsonLd
        title="Pinterest Scheduler | Board Management & Pin Planner"
        description="The visual workspace for Pinterest. Schedule Pins, manage Boards, and drive long-tail traffic."
        url="https://www.ezibreezy.com/features/pinterest-scheduler"
      />
      <SoftwareApplicationJsonLd
        name="EziBreezy Pinterest Scheduler"
        applicationCategory="BusinessApplication"
        price="25"
        currency="USD"
      />

      <LandingPageHeader />

      <main className="grow w-full max-w-[1400px] mx-auto px-4 md:px-6 pb-24">
        <Masthead />
        <BoardIntro />
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
