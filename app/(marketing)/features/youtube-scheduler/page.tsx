// app/(marketing)/features/youtube-scheduler/page.tsx

import { Metadata } from "next";
import {
  Users,
  Play,
  Eye,
  Smartphone,
  BarChart3,
  Sparkles,
  Lock,
  Type,
  FileText,
  Image as ImageIcon,
  Monitor,
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
import { YouTubeHeroVisual, YouTubeInboxVisual } from "./visuals";

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
        <FeatureMasthead
          title="YouTube"
          headline="The broadcast station."
          subheadline="Where stories become legacy."
        />

        <FeatureHero
          headline={
            <>
              Your content is
              <br />
              <span className="italic font-normal">an asset.</span>
            </>
          }
          copy={
            <>
              <p>
                <span className="float-left text-5xl font-black mr-3 -mt-2">
                  V
                </span>
                ideo is not just another post type. It is an investment. It
                requires time, craft, and vision.
              </p>
              <p>
                The <strong>Editorial Desk</strong> treats your uploads with the
                care they deserve. We handle the technical details—metadata,
                thumbnails, privacy settings—so you can focus on the story you
                are trying to tell.
              </p>
            </>
          }
          ctaText="Schedule Your Premiere"
          ctaLink="/auth/signup"
          visual={<YouTubeHeroVisual />}
        />

        <MarketIntelligence
          leadTitle={
            <>
              Listen to the
              <br />
              <span className="italic text-brand-primary">signal.</span>
            </>
          }
          leadCopy={
            <>
              <p>
                Views are validation, but retention is truth. Analytics tell you
                not just how many people clicked, but how many people cared.
              </p>
              <p className="text-sm text-foreground/70">
                Our intelligence report helps you understand your
                audience&apos;s behavior, so you can create more of what they
                love.
              </p>
            </>
          }
          metrics={[
            {
              icon: Users,
              label: "Subscribers",
              sublabel: "Loyalty",
              description:
                "Track the growth of your dedicated audience. See who is signing up for the long haul.",
            },
            {
              icon: Play,
              label: "Video Views",
              sublabel: "Reach",
              description:
                "See the total footprint of your library. Track which videos continue to perform over time.",
            },
            {
              icon: Eye,
              label: "Impressions",
              sublabel: "Discovery",
              description:
                "Understand how often your thumbnails are appearing in search and recommendations.",
            },
            {
              icon: Smartphone,
              label: "Shorts Views",
              sublabel: "Momentum",
              description:
                "Track the performance of your short-form content in the Shorts Feed.",
            },
            {
              icon: BarChart3,
              label: "Watch Time",
              sublabel: "Attention",
              description:
                "The metric that matters most. See how many hours your audience has spent with you.",
            },
            {
              icon: Sparkles,
              label: "Engagement",
              sublabel: "Interaction",
              description:
                "Track likes, comments, and shares to see which videos spark a reaction.",
            },
          ]}
        />

        <SocialInbox
          description={
            <p>
              Our <strong>Social Inbox</strong> helps you manage the
              conversation. Reply to comments, heart the best ones, and build
              the kind of community that shows up for every upload.
            </p>
          }
          visual={<YouTubeInboxVisual />}
        />

        <TechnicalLedger
          subtitle="Broadcast Capabilities"
          items={[
            {
              icon: Smartphone,
              title: "Shorts Publishing",
              description:
                "Capture the vertical feed. Publish videos up to 60 seconds long. We automatically detect the format.",
            },
            {
              icon: Lock,
              title: "Privacy Control",
              description:
                "Control the release. Set your status to Private for drafts, Unlisted for exclusive access, or Public.",
            },
            {
              icon: Type,
              title: "Optimized Titles",
              description:
                "Write titles that get clicked. Use our integrated checker to ensure your hook doesn't get truncated.",
            },
            {
              icon: FileText,
              title: "Rich Descriptions",
              description:
                "Add context, links, and timestamps. Format your description to help SEO.",
            },
            {
              icon: ImageIcon,
              title: "Community Posts",
              description:
                "Engage between uploads. Publish image carousels (up to 10 slides) to your Community Tab.",
            },
            {
              icon: Sparkles,
              title: "Custom Thumbnails",
              description:
                "The first impression matters. Upload custom high-res thumbnails that stand out.",
            },
          ]}
        />

        <UtilityDrawer
          tools={[
            {
              icon: Type,
              title: "Title Checker",
              description:
                "Don't let your hook get cut off. Preview truncation and CTR potential before you publish.",
              href: "/tools/youtube-title-checker",
              decoration: "corner",
            },
            {
              icon: Monitor,
              title: "Thumbnail Resizer",
              description:
                "Ensure your thumbs look perfect. Crop to 1280x720 (16:9) for maximum clickability.",
              href: "/tools/social-image-resizer",
            },
          ]}
        />

        <FeatureCTA
          icon={Sparkles}
          titlePrefix="Own your"
          titleHighlight="channel."
          description="The editorial desk is open. Organize your library, schedule your premieres, and grow your legacy."
          issueNumber="06"
          editionName="Broadcast Edition"
        />
      </main>

      <LandingPageFooter />
    </div>
  );
}
