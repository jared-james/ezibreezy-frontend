// app/(marketing)/features/instagram-scheduler/page.tsx

import { Metadata } from "next";
import {
  Sparkles,
  Users,
  Clock,
  MousePointer2,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Type,
  Grid,
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
import { InstagramHeroVisual, InstagramInboxVisual } from "./visuals";

export const metadata: Metadata = {
  title: "Instagram Scheduler | Visual Planner, Inbox & Analytics",
  description:
    "The editorial workspace for Instagram. Plan your grid, understand your audience with deep analytics, and manage conversations from one desk.",
  alternates: {
    canonical: "/features/instagram-scheduler",
  },
  openGraph: {
    title: "Instagram Scheduler | EziBreezy",
    description:
      "The editorial workspace for Instagram. Plan, visualize, measure, and connect.",
    url: "https://www.ezibreezy.com/features/instagram-scheduler",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy Instagram Scheduler",
      },
    ],
    type: "website",
  },
};

export default function InstagramSchedulerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif selection:bg-brand-primary/20">
      <WebPageJsonLd
        title="Instagram Scheduler | Visual Grid Planner"
        description="The editorial workspace for Instagram. Visually plan your grid, schedule Reels, track analytics, and manage your inbox."
        url="https://www.ezibreezy.com/features/instagram-scheduler"
      />
      <SoftwareApplicationJsonLd
        name="EziBreezy Instagram Scheduler"
        applicationCategory="BusinessApplication"
        price="25"
        currency="USD"
      />

      <LandingPageHeader />

      <main className="grow w-full max-w-[1400px] mx-auto px-4 md:px-6 pb-24">
        <FeatureMasthead
          title="Instagram"
          headline="The visual portfolio."
          subheadline="Where consistency meets connection."
        />

        <FeatureHero
          headline={
            <>
              Don&apos;t just post.
              <br />
              <span className="italic font-normal">Tell a story.</span>
            </>
          }
          copy={
            <>
              <p>
                <span className="float-left text-5xl font-black mr-3 -mt-2">
                  W
                </span>
                e often mistake the feed for a billboard, shouting at strangers
                as they scroll by. But the feed is not a place for shouting. It
                is a place for resonance.
              </p>
              <p>
                The <strong>Visual Planner</strong> allows you to step back and
                see the bigger picture. It gives you the space to ensure that
                every piece of content isn&apos;t just filling a slot, but
                contributing to the feeling you want to leave behind.
              </p>
            </>
          }
          ctaText="Start Your Grid"
          ctaLink="/auth/signup"
          visual={<InstagramHeroVisual />}
        />

        <MarketIntelligence
          leadTitle={
            <>
              Data is simply
              <br />
              <span className="italic text-brand-primary">empathy.</span>
            </>
          }
          leadCopy={
            <>
              <p>
                Metrics are not just math. They are signals. They tell us who is
                listening, when they are awake, and what makes them lean in.
              </p>
              <p className="text-sm text-foreground/70">
                To understand your analytics is to understand your people. It is
                the practice of listening to the unsaid feedback of your
                community.
              </p>
            </>
          }
          metrics={[
            {
              icon: Users,
              label: "Total Followers",
              sublabel: "Growth",
              description:
                "See who is joining the circle and who is drifting away. Understand the net growth of your community.",
            },
            {
              icon: Users, // Fallback icon, overwritten by customIcon
              customIcon: (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-primary" />
                  <div className="w-2 h-2 rounded-full bg-orange-400" />
                </div>
              ),
              label: "Demographics",
              sublabel: "Insights",
              description:
                "See the gender, age, and location of your audience. Know exactly who you are speaking to.",
            },
            {
              icon: Clock,
              label: "Best Time to Post",
              sublabel: "Optimization",
              description:
                "Discover when your people are listening. Optimize your schedule for reach, likes, or comments.",
            },
            {
              icon: MousePointer2,
              label: "Profile Clicks",
              sublabel: "Conversion",
              description:
                "Track who moves from interest to action. See clicks on website, email, and text buttons.",
            },
            {
              icon: BarChart3,
              label: "Competitor Tracking",
              sublabel: "Benchmarks",
              description:
                "Monitor up to 10 peers. Learn from their wins and understand industry benchmarks.",
            },
            {
              icon: TrendingUp,
              label: "Reach & Impressions",
              sublabel: "Visibility",
              description:
                "Measure how far your story travels. Deep dives into hashtags and Story performance.",
            },
          ]}
        />

        <SocialInbox
          description={
            <p>
              Our <strong>Social Inbox</strong> captures every comment, mention,
              and direct message in one organized stream. Respond to customer
              queries and fan love efficiently, without ever opening the
              distracting mobile app.
            </p>
          }
          visual={<InstagramInboxVisual />}
        />

        <TechnicalLedger
          subtitle="Full Feature Index"
          items={[
            {
              icon: CheckCircle2,
              title: "Smart Stories",
              description:
                "Upload once. We automatically split long videos into 15-second segments so your narrative flows without interruption.",
            },
            {
              icon: CheckCircle2,
              title: "Reel Sovereignty",
              description:
                "Control where your work lives. Toggle feed visibility, upload custom covers, and select the perfect thumbnail frame.",
            },
            {
              icon: CheckCircle2,
              title: "First Comment",
              description:
                "Start the conversation or hide your hashtags. We auto-post your first comment the second your content goes live.",
            },
            {
              icon: CheckCircle2,
              title: "Collaborator Invites",
              description:
                "Community is built together. Invite another account to be a co-author on your post directly from the scheduler.",
            },
          ]}
        />

        <UtilityDrawer
          tools={[
            {
              icon: Type,
              title: "Font Generator",
              description:
                "Style your bio and captions with intention. Generate bold, italic, or script text.",
              href: "/tools/instagram-font-generator",
              decoration: "corner",
            },
            {
              icon: Grid,
              title: "Carousel Splitter",
              description:
                "Turn panoramas into seamless swipeable stories. Split one image into three perfectly.",
              href: "/tools/instagram-carousel-splitter",
            },
          ]}
        />

        <FeatureCTA
          icon={Sparkles}
          titlePrefix="Start your"
          titleHighlight="press run."
          description="The editorial desk is open. Plan your grid, visualize your aesthetic, and connect with your audience."
          issueNumber="02"
          editionName="Visual Edition"
        />
      </main>

      <LandingPageFooter />
    </div>
  );
}
