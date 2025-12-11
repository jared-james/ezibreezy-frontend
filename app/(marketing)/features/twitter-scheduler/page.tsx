// app/(marketing)/features/twitter-scheduler/page.tsx

import { Metadata } from "next";
import {
  Eye,
  MousePointer2,
  Heart,
  Repeat,
  MessageSquare,
  BarChart3,
  Crop,
  Type,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  AtSign,
  Sparkles,
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
import { TwitterHeroVisual, TwitterInboxVisual } from "./visuals";

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
        <FeatureMasthead
          title="Twitter / X"
          headline="The public square."
          subheadline="Brevity is the soul of wit."
        />

        <FeatureHero
          headline={
            <>
              The art of the
              <br />
              <span className="italic font-normal">short form.</span>
            </>
          }
          copy={
            <>
              <p>
                <span className="float-left text-5xl font-black mr-3 -mt-2">
                  W
                </span>
                riting simply is often harder than writing at length. Every
                character counts. Every word must earn its place.
              </p>
              <p>
                The <strong>Editorial Desk</strong> helps you craft clarity.
                Whether it&apos;s a single powerful statement or a thoughtfully
                woven thread, we give you the tools to structure your thoughts
                so they land with impact.
              </p>
            </>
          }
          ctaText="Compose Your Thread"
          ctaLink="/auth/signup"
          visual={<TwitterHeroVisual />}
        />

        <MarketIntelligence
          leadTitle={
            <>
              Measure the
              <br />
              <span className="italic text-brand-primary">resonance.</span>
            </>
          }
          leadCopy={
            <>
              <p>
                Twitter moves fast. Analytics allow you to see the ripples your
                words create in real-time.
              </p>
              <p className="text-sm text-foreground/70">
                Understand which topics spark conversation and which formats
                drive action. Turn the noise into a clear signal for your next
                move.
              </p>
            </>
          }
          metrics={[
            {
              icon: Eye,
              label: "Impressions",
              sublabel: "Visibility",
              description:
                "See how many timelines your thoughts have graced. The total reach of your voice.",
            },
            {
              icon: MousePointer2,
              label: "Profile Visits",
              sublabel: "Curiosity",
              description:
                "Track how many people stopped scrolling to learn more about who you are.",
            },
            {
              icon: Heart,
              label: "Likes",
              sublabel: "Appreciation",
              description:
                "A simple signal of agreement. See which sentiments resonate most.",
            },
            {
              icon: Repeat,
              label: "Retweets",
              sublabel: "Amplification",
              description:
                "The highest compliment. Track who is spreading your message to their own network.",
            },
            {
              icon: MessageSquare,
              label: "Replies",
              sublabel: "Conversation",
              description:
                "Track the discussions you ignite. Identify the topics that people want to talk about.",
            },
            {
              icon: BarChart3,
              label: "Link Clicks",
              sublabel: "Conversion",
              description:
                "See how effectively your content drives traffic to your work, newsletter, or portfolio.",
            },
          ]}
        />

        <SocialInbox
          description={
            <p>
              Our <strong>Unified Inbox</strong> gathers your Mentions, Replies,
              and DMs into a single stream. It allows you to participate in the
              dialogue without getting lost in the noise of the timeline.
            </p>
          }
          visual={<TwitterInboxVisual />}
        />

        <TechnicalLedger
          subtitle="Publishing Capabilities"
          items={[
            {
              icon: Crop,
              title: "Image Cropping",
              description:
                "Crop to square, landscape, portrait, or story. Ensure your media looks intentional, not accidental.",
            },
            {
              icon: Type,
              title: "Text Publishing",
              description:
                "Publish text-only posts. We handle the character count and threading logic for you.",
            },
            {
              icon: Video,
              title: "Video Support",
              description:
                "Publish videos up to 250MB. Share clips, animations, and moments directly to the feed.",
            },
            {
              icon: ImageIcon,
              title: "High-Res Images",
              description:
                "Publish images up to 5MB. Maintain the fidelity of your photos and graphics.",
            },
            {
              icon: CheckCircle2,
              title: "Multi-Image Grid",
              description:
                "Tell a visual story. Publish carousels with up to 4 images that display as a clean grid in the feed.",
            },
            {
              icon: Eye,
              title: "Alt Text",
              description:
                "Add accessible alt text to images. Make your content inclusive for everyone in your audience.",
            },
            {
              icon: AtSign,
              title: "Mention Users",
              description:
                "Tag collaborators and friends. Mention other Twitter accounts directly in the composer.",
            },
            {
              icon: Sparkles,
              title: "Post Preview",
              description:
                "Preview how your post will look once published. Check line breaks and media layout before you tweet.",
            },
          ]}
        />

        <UtilityDrawer
          tools={[
            {
              icon: Sparkles,
              title: "Screenshot Studio",
              description:
                "Turn screenshots into aesthetic Twitter assets. Add backgrounds, padding, and shadows.",
              href: "/tools/screenshot-studio",
              decoration: "corner",
            },
            {
              icon: ImageIcon,
              title: "Image Resizer",
              description:
                "Crop photos perfectly for the X feed (16:9). Avoid awkward cropping in the timeline.",
              href: "/tools/social-image-resizer",
            },
          ]}
        />

        <FeatureCTA
          icon={Sparkles}
          titlePrefix="Make your"
          titleHighlight="statement."
          description="The editorial desk is open. Schedule your threads, join the public discourse, and own the narrative."
          issueNumber="05"
          editionName="Public Edition"
        />
      </main>

      <LandingPageFooter />
    </div>
  );
}
