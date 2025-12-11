// app/(marketing)/features/tiktok-scheduler/page.tsx

import { Metadata } from "next";
import {
  Video,
  Layers,
  Sparkles,
  Lock,
  Crop,
  Eye,
  CheckCircle2,
  Image as ImageIcon,
  Smartphone,
} from "lucide-react";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import {
  SoftwareApplicationJsonLd,
  WebPageJsonLd,
} from "@/components/seo/json-ld";

// Shared Feature Components
import FeatureMasthead from "../feature-masthead";
import FeatureHero from "../feature-hero";
import MarketIntelligence from "../market-intelligence";
import SocialInbox from "../social-inbox";
import TechnicalLedger from "../technical-ledger";
import UtilityDrawer from "../utility-drawer";
import FeatureCTA from "../feature-cta";

// Local Visuals
import { TikTokHeroVisual, TikTokInboxVisual } from "./visuals";

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
        <FeatureMasthead
          title="TikTok"
          headline="The entertainment console."
          subheadline="Where creativity finds its rhythm."
        />

        <FeatureHero
          headline={
            <>
              The stage is set.
              <br />
              <span className="italic font-normal">
                All you have to do is perform.
              </span>
            </>
          }
          copy={
            <>
              <p>
                <span className="float-left text-5xl font-black mr-3 -mt-2">
                  T
                </span>
                here is a unique energy to TikTok. It moves fast. It demands
                authenticity. It rewards the brave.
              </p>
              <p>
                The <strong>Editorial Desk</strong> is designed to help you
                harness that energy without getting swept away by it. Plan your
                performance, organize your visuals, and release your work when
                the audience is ready to applaud.
              </p>
            </>
          }
          ctaText="Plan Your Content"
          ctaLink="/auth/signup"
          visual={<TikTokHeroVisual />}
        />

        {/* 
          Using MarketIntelligence component to display "Production Capabilities" 
          to maintain the Design System consistency.
        */}
        <MarketIntelligence
          leadTitle={
            <>
              Create without
              <br />
              <span className="italic text-brand-primary">constraints.</span>
            </>
          }
          leadCopy={
            <>
              <p>
                Your creativity shouldn&apos;t be limited by file types or
                upload restrictions. We built a studio that handles everything
                you throw at it.
              </p>
              <p className="text-sm text-foreground/70">
                From 10-minute vlogs to 35-slide carousels, our publisher
                ensures your content hits the feed exactly as you imagined it.
              </p>
            </>
          }
          metrics={[
            {
              icon: Video,
              label: "Video & Photo",
              sublabel: "Formats",
              description:
                "Whether it's a quick 15-second clip, a 10-minute vlog, or a static photo update, our publisher handles every format natively.",
            },
            {
              icon: Layers,
              label: "Mega Carousels",
              sublabel: "Storytelling",
              description:
                "Tell a longer story. We support photo carousels with up to 35 images per post. Perfect for photo dumps and tutorials.",
            },
            {
              icon: Sparkles,
              label: "Smart Upload",
              sublabel: "Processing",
              description:
                "We handle the heavy lifting. Large video files are automatically chunked and optimized for smooth playback.",
            },
            {
              icon: Lock,
              label: "Privacy Control",
              sublabel: "Security",
              description:
                "Your stage, your rules. Set visibility to Public, Friends, or Private. Disable duets or comments before you even post.",
            },
            {
              icon: CheckCircle2,
              label: "Creator Tools",
              sublabel: "Transparency",
              description:
                "Working with partners? Easily mark your content as branded or sponsored to maintain compliance.",
            },
            {
              icon: Eye,
              label: "Post Preview",
              sublabel: "Quality",
              description:
                "See exactly how your video or carousel will look on the 'For You' page before it goes live.",
            },
          ]}
        />

        <SocialInbox
          description={
            <p>
              Our <strong>Social Inbox</strong> collects every comment in one
              place, allowing you to reply, appreciate, and connect with your
              audience without the distraction of the infinite scroll.
            </p>
          }
          visual={<TikTokInboxVisual />}
        />

        <TechnicalLedger
          subtitle="Feature Index"
          items={[
            {
              icon: Crop,
              title: "Image Cropping",
              description:
                "Ensure your visuals fit the frame. Crop your images to Square, Landscape, Portrait, or Story dimensions.",
            },
            {
              icon: Eye,
              title: "Post Preview",
              description:
                "See exactly how your video or carousel will look on the 'For You' page before it goes live.",
            },
            {
              icon: CheckCircle2,
              title: "Creator Tools",
              description:
                "Working with partners? Easily mark your content as branded or sponsored to maintain transparency.",
            },
            {
              icon: ImageIcon,
              title: "Any Format",
              description:
                "We support standard video uploads, static images, and multi-image carousels. One tool for every way you create.",
            },
          ]}
        />

        <UtilityDrawer
          tools={[
            {
              icon: Smartphone,
              title: "Image Resizer",
              description:
                "Crop photos perfectly for TikTok's vertical feed (9:16). Ensure your visuals fill the screen.",
              href: "/tools/social-image-resizer",
              decoration: "corner",
            },
            {
              icon: Sparkles,
              title: "Screenshot Studio",
              description:
                "Turn boring screenshots into aesthetic assets. Add backgrounds and shadows for a polished look.",
              href: "/tools/screenshot-studio",
            },
          ]}
        />

        <FeatureCTA
          icon={Sparkles}
          titlePrefix="Create without"
          titleHighlight="chaos."
          description="The editorial desk is open. Schedule your next viral moment, manage your comments, and own the stage."
          issueNumber="04"
          editionName="Performance Edition"
        />
      </main>

      <LandingPageFooter />
    </div>
  );
}
