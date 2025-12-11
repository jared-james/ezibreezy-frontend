// app/(marketing)/features/facebook-scheduler/page.tsx

import { Metadata } from "next";
import {
  CalendarRange,
  Users,
  Star,
  Eye,
  Tv,
  BarChart3,
  Sparkles,
  Crop,
  Layers,
  Type,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import {
  SoftwareApplicationJsonLd,
  WebPageJsonLd,
} from "@/components/seo/json-ld";

// Local Visuals
import { FacebookHeroVisual, FacebookInboxVisual } from "./visuals";
import FeatureMasthead from "../feature-masthead";
import FeatureHero from "../feature-hero";
import MarketIntelligence from "../market-intelligence";
import SocialInbox from "../social-inbox";
import TechnicalLedger from "../technical-ledger";
import UtilityDrawer from "../utility-drawer";
import FeatureCTA from "../feature-cta";

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
        url: "/marketing/features/features_facebook.webp",
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
        <FeatureMasthead
          title="Facebook"
          headline="The town hall."
          subheadline="Where community puts down roots."
        />

        <FeatureHero
          headline={
            <>
              Build a home for
              <br />
              <span className="italic font-normal">your brand.</span>
            </>
          }
          copy={
            <>
              <p>
                <span className="float-left text-5xl font-black mr-3 -mt-2">
                  F
                </span>
                acebook is where your business lives online. It is the
                storefront, the customer service desk, and the community board
                all in one.
              </p>
              <p>
                The <strong>Editorial Desk</strong> ensures your Page is always
                active, always welcoming. From reels that entertain to
                location-tagged updates that drive foot traffic, we help you
                manage your presence with purpose.
              </p>
            </>
          }
          ctaText="Manage Your Page"
          ctaLink="/auth/signup"
          visual={<FacebookHeroVisual />}
        />

        <MarketIntelligence
          leadTitle={
            <>
              Know your
              <br />
              <span className="italic text-brand-primary">residents.</span>
            </>
          }
          leadCopy={
            <>
              <p>
                A community isn&apos;t just a number. It&apos;s people.
                It&apos;s fans who return, and new faces discovering you for the
                first time.
              </p>
              <p className="text-sm text-foreground/70">
                Our intelligence report breaks down the health of your Page,
                showing you not just who sees your content, but who is sticking
                around.
              </p>
            </>
          }
          metrics={[
            {
              icon: Users,
              label: "Total Followers",
              sublabel: "Growth",
              description:
                "See the steady rise of your community over time. Measure the long-term health of your brand.",
            },
            {
              icon: Star,
              label: "Fan Base",
              sublabel: "Loyalty",
              description:
                "Track gained and lost fans. Understand what content builds loyalty and what drives people away.",
            },
            {
              icon: Eye,
              label: "Page Views",
              sublabel: "Visibility",
              description:
                "See how many eyes are on your storefront. Track impressions and views across the platform.",
            },
            {
              icon: Tv,
              label: "Video Views",
              sublabel: "Retention",
              description:
                "From Reels to live streams, see how many people are tuning in and watching your stories unfold.",
            },
            {
              icon: BarChart3,
              label: "Post Impressions",
              sublabel: "Reach",
              description:
                "How far did your message travel? Measure the total footprint of your posts in the feed.",
            },
            {
              icon: Sparkles,
              label: "Post Tracking",
              sublabel: "Engagement",
              description:
                "Drill down into specific posts. See engaged users, clicks, and reactions for every update.",
            },
          ]}
        />

        <SocialInbox
          description={
            <p>
              Our <strong>Unified Inbox</strong> ensures you never miss a chance
              to say &ldquo;thank you&rdquo; or solve a problem. Manage
              comments, direct messages, and Page reviews from one quiet,
              organized space.
            </p>
          }
          visual={<FacebookInboxVisual />}
        />

        <TechnicalLedger
          subtitle="Publishing Capabilities"
          items={[
            {
              icon: Crop,
              title: "Image Cropping",
              description:
                "Crop to square, landscape, portrait, or story. Ensure your visuals look professional on every device.",
            },
            {
              icon: Tv,
              title: "Reels & Stories",
              description:
                "Publish images or videos up to 1 minute long. Keep your Page active with ephemeral content.",
            },
            {
              icon: Layers,
              title: "Link Carousels",
              description:
                "Drive traffic. Publish carousels with titles, descriptions, and URLs.",
            },
            {
              icon: Type,
              title: "Status Updates",
              description:
                "Sometimes the message is simple. Publish text-only posts to keep your community informed.",
            },
            {
              icon: Users,
              title: "Tag Pages",
              description:
                "Build connections. Tag other Facebook Pages by typing @ to increase visibility.",
            },
            {
              icon: MapPin,
              title: "Location Tagging",
              description:
                "Put yourself on the map. Search and add locations to your posts to drive local discovery.",
            },
            {
              icon: Eye,
              title: "Post Preview",
              description:
                "See exactly how your post will look in the News Feed before you publish.",
            },
            {
              icon: CheckCircle2,
              title: "Accessibility",
              description:
                "Add accessible Alt Text to your images. Ensure your content is inclusive for everyone.",
            },
          ]}
        />

        <UtilityDrawer
          tools={[
            {
              icon: Crop,
              title: "Image Resizer",
              description:
                "Don't let Facebook crop your heads off. Resize specifically for the feed (16:9) or stories (9:16).",
              href: "/tools/social-image-resizer",
              decoration: "corner",
            },
            {
              icon: Sparkles,
              title: "Screenshot Studio",
              description:
                "Turn boring screenshots into aesthetic assets. Add backgrounds, shadows, and device frames.",
              href: "/tools/screenshot-studio",
            },
          ]}
        />

        <FeatureCTA
          icon={CalendarRange}
          titlePrefix="Schedule your"
          titleHighlight="broadcast."
          description="Map out your month, queue up your best work, and let the system handle the rest."
          issueNumber="01"
          editionName="Late Edition"
        />
      </main>

      <LandingPageFooter />
    </div>
  );
}
