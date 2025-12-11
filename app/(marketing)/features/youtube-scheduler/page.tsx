// app/(marketing)/features/youtube-scheduler/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import {
  SoftwareApplicationJsonLd,
  WebPageJsonLd,
} from "@/components/seo/json-ld";
import Masthead from "./masthead";
import VideoIntro from "./video-intro";
import Analytics from "./analytics";
import Inbox from "./inbox";
import TechnicalLedger from "./technical-ledger";
import ComplementaryTools from "./complementary-tools";
import FinalCTA from "./final-cta";

export const metadata: Metadata = {
  title: "YouTube Scheduler | Shorts, Video & Community Posts",
  description:
    "The creator workspace for YouTube. Schedule Shorts and long-form video, manage metadata, and handle community posts from one desk.",
  alternates: {
    canonical: "/features/youtube-scheduler",
  },
  openGraph: {
    title: "YouTube Scheduler | EziBreezy",
    description:
      "The broadcast station. Schedule, optimize, and grow your channel.",
    url: "https://www.ezibreezy.com/features/youtube-scheduler",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy YouTube Scheduler",
      },
    ],
    type: "website",
  },
};

export default function YouTubeSchedulerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif selection:bg-brand-primary/20">
      <WebPageJsonLd
        title="YouTube Scheduler | Shorts, Video & Community Posts"
        description="The creator workspace for YouTube. Schedule Shorts and long-form video, manage metadata, and handle community posts."
        url="https://www.ezibreezy.com/features/youtube-scheduler"
      />
      <SoftwareApplicationJsonLd
        name="EziBreezy YouTube Scheduler"
        applicationCategory="BusinessApplication"
        price="25"
        currency="USD"
      />

      <LandingPageHeader />

      <main className="grow w-full max-w-[1400px] mx-auto px-4 md:px-6 pb-24">
        <Masthead />
        <VideoIntro />
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
