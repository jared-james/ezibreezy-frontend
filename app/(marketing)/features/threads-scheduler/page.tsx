// app/(marketing)/features/threads-scheduler/page.tsx

import { Metadata } from "next";
import {
  Heart,
  MessageCircle,
  Repeat,
  UserPlus,
  Hash,
  Sparkles,
  Crop,
  Layers,
  Image as ImageIcon,
  Type,
  GalleryHorizontal,
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
import { ThreadsHeroVisual, ThreadsInboxVisual } from "./visuals";

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
        <FeatureMasthead
          title="Threads"
          headline="The modern salon."
          subheadline="Where dialogue flows without friction."
        />

        <FeatureHero
          headline={
            <>
              Start a conversation,
              <br />
              <span className="italic font-normal">not a monologue.</span>
            </>
          }
          copy={
            <>
              <p>
                <span className="float-left text-5xl font-black mr-3 -mt-2">
                  T
                </span>
                hreads feels different. It is intimate. It is immediate. It is
                less about broadcasting to the masses and more about sitting in
                a circle with your community.
              </p>
              <p>
                The <strong>Editorial Desk</strong> removes the friction of
                participation. Write your thoughts naturally, and let our tools
                handle the splitting, tagging, and formatting so you can focus
                on the flow.
              </p>
            </>
          }
          ctaText="Start a Thread"
          ctaLink="/auth/signup"
          visual={<ThreadsHeroVisual />}
        />

        <MarketIntelligence
          leadTitle={
            <>
              Read the
              <br />
              <span className="italic text-brand-primary">room.</span>
            </>
          }
          leadCopy={
            <>
              <p>
                In a conversation, listening is as important as speaking.
                Analytics help you listen at scale.
              </p>
              <p className="text-sm text-foreground/70">
                Our intelligence report shows you which topics ignite dialogue,
                helping you steer the conversation where it naturally wants to
                go.
              </p>
            </>
          }
          metrics={[
            {
              icon: UserPlus,
              label: "Followers",
              sublabel: "Circle Growth",
              description:
                "See how many people have pulled up a chair to listen to what you have to say.",
            },
            {
              icon: Heart,
              label: "Likes",
              sublabel: "Resonance",
              description:
                "Track the moments of agreement. See which sentiments connect instantly.",
            },
            {
              icon: MessageCircle,
              label: "Replies",
              sublabel: "Dialogue",
              description:
                "The heart of Threads. Track the depth of the conversations you start.",
            },
            {
              icon: Repeat,
              label: "Reposts",
              sublabel: "Amplification",
              description:
                "See who is taking your message and sharing it with their own circle.",
            },
            {
              icon: Hash,
              label: "Topic Tags",
              sublabel: "Discovery",
              description:
                "Analyze which tags are helping you reach new audiences outside your following.",
            },
            {
              icon: Sparkles,
              label: "Engagement",
              sublabel: "Activity Rate",
              description:
                "The pulse of your profile. Measure the overall liveliness of your presence.",
            },
          ]}
        />

        <SocialInbox
          description={
            <p>
              Our <strong>Social Inbox</strong> ensures you never miss a beat.
              Reply to comments and mentions from a calm, focused environment,
              turning casual interactions into lasting connections.
            </p>
          }
          visual={<ThreadsInboxVisual />}
        />

        <TechnicalLedger
          subtitle="Publishing Capabilities"
          items={[
            {
              icon: Crop,
              title: "Image Cropping",
              description:
                "Crop to square, landscape, portrait, or story. Ensure your visuals look intentional.",
            },
            {
              icon: MessageCircle,
              title: "Auto-Threading",
              description:
                "Write as much as you need. We automatically split long text into a connected chain of posts.",
            },
            {
              icon: Layers,
              title: "Carousel Publishing",
              description:
                "Tell a visual story. Publish carousels with up to 10 images or videos that users can swipe through.",
            },
            {
              icon: ImageIcon,
              title: "Mixed Media",
              description:
                "Combine photos and videos in the same post or carousel. We handle the formatting.",
            },
            {
              icon: Hash,
              title: "Topic Tags",
              description:
                "Join the wider conversation. Add one Topic Tag per post to help your content get discovered.",
            },
            {
              icon: Type,
              title: "Text Publishing",
              description:
                "Keep it simple. Publish text-only updates when you want to spark a discussion without visuals.",
            },
          ]}
        />

        <UtilityDrawer
          tools={[
            {
              icon: GalleryHorizontal,
              title: "Carousel Splitter",
              description:
                "Create seamless panoramic swipes. Split wide images into perfect 1080x1350 segments.",
              href: "/tools/instagram-carousel-splitter",
              decoration: "corner",
            },
            {
              icon: Type,
              title: "Font Generator",
              description:
                "Add emphasis to your threads. Generate bold or italic unicode text.",
              href: "/tools/instagram-font-generator",
            },
          ]}
        />

        <FeatureCTA
          icon={Sparkles}
          titlePrefix="Find your"
          titleHighlight="circle."
          description="The editorial desk is open. Schedule your thoughts, start the conversation, and engage with your community."
          issueNumber="07"
          editionName="Dialogue Edition"
        />
      </main>

      <LandingPageFooter />
    </div>
  );
}
