// app/(marketing)/features/facebook-scheduler/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import {
  SoftwareApplicationJsonLd,
  WebPageJsonLd,
} from "@/components/seo/json-ld";
import Masthead from "./masthead";
import PageIntro from "./page-intro";
import Analytics from "./analytics";
import Inbox from "./inbox";
import TechnicalLedger from "./technical-ledger";
import ComplementaryTools from "./complementary-tools";
import FinalCTA from "./final-cta";

export const metadata: Metadata = {
  title: "Facebook Scheduler | Reels, Groups & Page Management",
  description:
    "The editorial workspace for Facebook Pages. Schedule Reels, manage community reviews, and track fan growth from one desk.",
  alternates: {
    canonical: "/features/facebook-scheduler",
  },
  openGraph: {
    title: "Facebook Scheduler | EziBreezy",
    description:
      "The community hub. Schedule, manage reputation, and grow your fans.",
    url: "https://www.ezibreezy.com/features/facebook-scheduler",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy Facebook Scheduler",
      },
    ],
    type: "website",
  },
};

export default function FacebookSchedulerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif selection:bg-brand-primary/20">
      <WebPageJsonLd
        title="Facebook Scheduler | Reels, Groups & Page Management"
        description="The editorial workspace for Facebook Pages. Schedule Reels, manage community reviews, and track fan growth."
        url="https://www.ezibreezy.com/features/facebook-scheduler"
      />
      <SoftwareApplicationJsonLd
        name="EziBreezy Facebook Scheduler"
        applicationCategory="BusinessApplication"
        price="25"
        currency="USD"
      />

      <LandingPageHeader />

      <main className="grow w-full max-w-[1400px] mx-auto px-4 md:px-6 pb-24">
        <Masthead />
        <PageIntro />
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
