// app/(marketing)/privacy/page.tsx

import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import LandingPageHeader from "@/components/landing-page/landing-page-header";

const sections = [
  {
    id: "information-collection",
    title: "Information We Collect",
    content: (
      <>
        <p className="font-serif text-lg text-foreground/80 mb-8 leading-relaxed">
          We collect information to provide our editorial and publishing
          services. This includes data you provide directly and data collected
          automatically via your interactions with the platform.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 border border-dashed border-foreground/30 bg-background-editorial">
            <h4 className="font-serif font-bold text-xl mb-3 text-foreground flex items-center gap-2">
              <span className="w-2 h-2 bg-brand-primary rounded-full" />
              Account & Identity
            </h4>
            <p className="font-serif text-sm text-foreground/70 leading-relaxed">
              We collect your <span className="font-bold">email address</span>,{" "}
              <span className="font-bold">display name</span>, and
              authentication IDs (via Supabase). If you purchase a subscription,
              our payment processor (Stripe) collects billing details; we do not
              store raw credit card numbers.
            </p>
          </div>

          <div className="p-6 border border-dashed border-foreground/30 bg-background-editorial">
            <h4 className="font-serif font-bold text-xl mb-3 text-foreground flex items-center gap-2">
              <span className="w-2 h-2 bg-brand-primary rounded-full" />
              Social Credentials
            </h4>
            <p className="font-serif text-sm text-foreground/70 leading-relaxed">
              To publish on your behalf, we store OAuth{" "}
              <span className="font-bold">access and refresh tokens</span> for
              connected platforms. These are stored using AES-256-GCM encryption
              at rest and are never shared with third parties other than the
              platforms themselves.
            </p>
          </div>

          <div className="p-6 border border-dashed border-foreground/30 bg-background-editorial">
            <h4 className="font-serif font-bold text-xl mb-3 text-foreground flex items-center gap-2">
              <span className="w-2 h-2 bg-brand-primary rounded-full" />
              Editorial Content
            </h4>
            <p className="font-serif text-sm text-foreground/70 leading-relaxed">
              We process your <span className="font-bold">prompts</span> sent to
              AI providers and store the resulting drafts, media files, and
              scheduled posts to manage your content library.
            </p>
          </div>

          <div className="p-6 border border-dashed border-foreground/30 bg-background-editorial">
            <h4 className="font-serif font-bold text-xl mb-3 text-foreground flex items-center gap-2">
              <span className="w-2 h-2 bg-brand-primary rounded-full" />
              Usage & Log Data
            </h4>
            <p className="font-serif text-sm text-foreground/70 leading-relaxed">
              Our servers automatically record information ("Log Data") such as
              your IP address, browser type, referring domain, and pages
              visited. This helps us prevent abuse and improve platform
              stability.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "platform-integrations",
    title: "Platform Integrations",
    content: (
      <>
        <p className="font-serif text-lg text-foreground/80 mb-6 leading-relaxed">
          Our service acts as a bridge to third-party platforms. By connecting
          these accounts, you acknowledge that your data is processed according
          to their respective policies.
        </p>

        <div className="space-y-6">
          {/* YouTube / Google Block - CRITICAL for Compliance */}
          <div className="p-6 border-l-4 border-brand-primary bg-surface/50">
            <h4 className="font-serif font-bold text-lg mb-2">
              YouTube & Google API Services
            </h4>
            <p className="font-serif text-sm text-foreground/80 leading-relaxed mb-4">
              We use YouTube API Services to upload videos and retrieve
              analytics. By using this integration, you agree to be bound by the{" "}
              <a
                href="https://www.youtube.com/t/terms"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-brand-primary/50 hover:text-brand-primary font-bold"
              >
                YouTube Terms of Service
              </a>
              . Your data is processed in accordance with the{" "}
              <a
                href="http://www.google.com/policies/privacy"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-brand-primary/50 hover:text-brand-primary font-bold"
              >
                Google Privacy Policy
              </a>
              .
            </p>
            <div className="bg-background-editorial p-3 border border-foreground/10 inline-block">
              <p className="font-mono text-xs text-foreground/70">
                <strong>Revoke Access:</strong> You can remove our access via
                the{" "}
                <a
                  href="https://security.google.com/settings/security/permissions"
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-brand-primary"
                >
                  Google Security Settings page
                </a>
                .
              </p>
            </div>
          </div>

          {/* Meta (Facebook/Instagram) */}
          <div className="p-6 border border-dashed border-foreground/20">
            <h4 className="font-serif font-bold text-lg mb-2">
              Meta (Facebook & Instagram)
            </h4>
            <p className="font-serif text-sm text-foreground/80 leading-relaxed">
              We access your Page IDs, usernames, and insights via the Meta
              Graph API to schedule posts and report performance. Please refer
              to the{" "}
              <a
                href="https://www.facebook.com/privacy/policy"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-brand-primary"
              >
                Meta Privacy Policy
              </a>
              . You can manage app permissions in your{" "}
              <a
                href="https://www.facebook.com/settings?tab=business_tools"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-brand-primary"
              >
                Facebook Business Integrations
              </a>
              .
            </p>
          </div>

          {/* TikTok */}
          <div className="p-6 border border-dashed border-foreground/20">
            <h4 className="font-serif font-bold text-lg mb-2">TikTok</h4>
            <p className="font-serif text-sm text-foreground/80 leading-relaxed">
              We access your profile information and video metrics to enable
              publishing and analytics. Refer to the{" "}
              <a
                href="https://www.tiktok.com/legal/page/row/privacy-policy/en"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-brand-primary"
              >
                TikTok Privacy Policy
              </a>
              .
            </p>
          </div>

          {/* LinkedIn & Pinterest */}
          <div className="p-6 border border-dashed border-foreground/20">
            <h4 className="font-serif font-bold text-lg mb-2">
              LinkedIn & Pinterest
            </h4>
            <p className="font-serif text-sm text-foreground/80 leading-relaxed">
              We utilize OAuth tokens to post content to your profile/boards.
              Data handling is subject to the{" "}
              <a
                href="https://www.linkedin.com/legal/privacy-policy"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-brand-primary"
              >
                LinkedIn Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="https://policy.pinterest.com/en/privacy-policy"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-brand-primary"
              >
                Pinterest Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies & Processors",
    content: (
      <div className="space-y-6">
        <p className="font-serif text-lg text-foreground/80 leading-relaxed">
          We use cookies to maintain your session and improve the service. We do
          not sell your data. We only share data with specific "Processors"
          necessary to run the application:
        </p>
        <div className="border-t border-b border-double border-foreground/20 py-8">
          <ul className="grid gap-4">
            <li className="flex items-start gap-4">
              <span className="font-mono text-xs font-bold text-brand-primary mt-1.5 min-w-[80px]">
                Infrastructure
              </span>
              <p className="font-serif text-foreground/80 text-sm leading-relaxed">
                <span className="font-bold">Supabase</span> (Database & Auth),{" "}
                <span className="font-bold">Vercel</span> (Hosting), and{" "}
                <span className="font-bold">Cloudflare R2</span> (Media
                Storage).
              </p>
            </li>
            <li className="flex items-start gap-4">
              <span className="font-mono text-xs font-bold text-brand-primary mt-1.5 min-w-[80px]">
                Analytics
              </span>
              <p className="font-serif text-foreground/80 text-sm leading-relaxed">
                <span className="font-bold">PostHog</span>. We use this to
                understand which features are popular. Data is aggregated and
                anonymized where possible.
              </p>
            </li>
            <li className="flex items-start gap-4">
              <span className="font-mono text-xs font-bold text-brand-primary mt-1.5 min-w-[80px]">
                Payments
              </span>
              <p className="font-serif text-foreground/80 text-sm leading-relaxed">
                <span className="font-bold">Stripe</span>. Payment data is
                provided directly to Stripe. We do not access or store full card
                numbers.
              </p>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "security-retention",
    title: "Security & Retention",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 border-2 border-dashed border-foreground/20 bg-foreground/[0.02]">
          <h4 className="font-serif font-bold text-lg mb-3">Data Retention</h4>
          <p className="font-serif text-sm text-foreground/80 leading-relaxed mb-2">
            <strong>Active Accounts:</strong> We retain your content library and
            connection tokens as long as your account is active.
          </p>
          <p className="font-serif text-sm text-foreground/80 leading-relaxed">
            <strong>Deletion:</strong> Upon account deletion, all personal data
            is removed from our live databases within 30 days. Logs may be
            retained for up to 90 days for security auditing.
          </p>
        </div>
        <div className="p-8 border-2 border-dashed border-foreground/20 bg-foreground/[0.02]">
          <h4 className="font-serif font-bold text-lg mb-3">
            International Transfers
          </h4>
          <p className="font-serif text-sm text-foreground/80 leading-relaxed">
            Our infrastructure is primarily located in the United States. By
            using our service, you acknowledge that your data may be transferred
            to and processed in the US, where data protection laws may differ
            from your local jurisdiction.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "contact",
    title: "Contact & Rights",
    content: (
      <p className="font-serif text-lg text-foreground/80 leading-relaxed">
        You may request the deletion of your account and all associated data at
        any time via your account settings. For privacy-related questions or to
        exercise your rights (GDPR/CCPA/DPA), please contact our Data Protection
        Officer at:{" "}
        <a
          href="mailto:support@ezibreezy.app"
          className="text-brand-primary hover:text-foreground font-bold underline decoration-brand-primary/30 underline-offset-4 transition-all"
        >
          support@ezibreezy.app
        </a>
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="relative bg-background-editorial text-foreground min-h-screen">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <LandingPageHeader />

      <main className="relative container mx-auto px-6 pt-24 pb-32 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 pb-8 border-b-4 border-double border-foreground/20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-brand-primary" />
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-brand-primary">
                Legal Reference
              </p>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-medium leading-[0.9] tracking-tight text-foreground">
              Privacy <span className="italic">Policy</span>
            </h1>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-widest opacity-60 mb-1">
              Last Updated
            </p>
            <p className="font-serif text-xl font-bold">December 11, 2025</p>
          </div>
        </div>

        <div className="mb-20">
          <div className="relative p-8 md:p-12 border-l-4 border-brand-primary bg-surface/50">
            <p className="font-serif text-xl md:text-2xl text-foreground leading-relaxed italic">
              "We value your sovereignty. This document outlines exactly how we
              handle your data, the third parties we trust, and how you retain
              control over your digital footprint across all connected
              platforms."
            </p>
          </div>
        </div>

        <div className="space-y-24">
          {sections.map((section, index) => {
            return (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-32 group"
              >
                <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                  <div className="md:w-1/4 shrink-0">
                    <span className="inline-block px-3 py-1 border border-foreground/20 font-mono text-xs font-bold text-brand-primary uppercase tracking-widest mb-4">
                      Section 0{index + 1}
                    </span>
                    <h2 className="font-serif text-3xl font-bold text-foreground leading-tight">
                      {section.title}
                    </h2>
                  </div>

                  <div className="md:w-3/4 pt-2">{section.content}</div>
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <LandingPageFooter />
    </div>
  );
}
