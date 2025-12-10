// app/(marketing)/terms/page.tsx

import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import Link from "next/link";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: (
      <p className="font-serif text-lg text-foreground/80 leading-relaxed">
        By accessing or using the ezibreezy web application ("Service"), you
        agree to be bound by these Terms of Service ("Terms"). If you do not
        agree to all of these Terms, do not use the Service. These Terms
        constitute a binding legal agreement between you and ezibreezy.
      </p>
    ),
  },
  {
    id: "service-description",
    title: "2. Service & AI Content",
    content: (
      <div className="space-y-6">
        <div className="p-6 border border-dashed border-foreground/30 bg-background-editorial">
          <h4 className="font-serif font-bold text-xl mb-3 text-foreground">
            AI Generation
          </h4>
          <p className="font-serif text-sm text-foreground/70 leading-relaxed">
            The Service utilizes third-party Artificial Intelligence models
            (e.g., OpenAI, Gemini) to generate text and media ("AI Content"). We
            make <span className="font-bold">no guarantees</span> regarding the
            accuracy, originality, or suitability of AI Content. You acknowledge
            that AI Content may require human review, editing, and fact-checking
            before publishing.
          </p>
        </div>
        <div className="p-6 border border-dashed border-foreground/30 bg-background-editorial">
          <h4 className="font-serif font-bold text-xl mb-3 text-foreground">
            Publishing Responsibility
          </h4>
          <p className="font-serif text-sm text-foreground/70 leading-relaxed">
            We act solely as a tool to schedule and publish content. You are
            solely responsible for all content published on your behalf,
            ensuring it complies with the terms and policies of the target
            social media platforms (e.g., X/Twitter, LinkedIn).
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "platform-terms",
    title: "3. Platform Integration Terms",
    content: (
      <>
        <p className="font-serif text-lg text-foreground/80 mb-6 leading-relaxed">
          Our Service integrates with third-party platforms. By using these
          integrations, you agree to be bound by their respective terms:
        </p>
        <div className="border-l-4 border-brand-primary pl-6 py-2 space-y-4 bg-surface/50">
          <p className="font-serif text-sm text-foreground/80">
            <strong>YouTube:</strong> By using our YouTube integration, you
            agree to be bound by the{" "}
            <a
              href="https://www.youtube.com/t/terms"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-brand-primary"
            >
              YouTube Terms of Service
            </a>
            .
          </p>
          <p className="font-serif text-sm text-foreground/80">
            <strong>Google:</strong> Your use is subject to the{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-brand-primary"
            >
              Google Privacy Policy
            </a>
            .
          </p>
          <p className="font-serif text-sm text-foreground/80">
            <strong>Meta (Facebook/Instagram):</strong> You agree to the{" "}
            <a
              href="https://www.facebook.com/terms.php"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-brand-primary"
            >
              Meta Terms of Service
            </a>
            .
          </p>
          <p className="font-serif text-sm text-foreground/80">
            <strong>TikTok:</strong> You agree to the{" "}
            <a
              href="https://www.tiktok.com/legal/page/row/terms-of-service/en"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-brand-primary"
            >
              TikTok Terms of Service
            </a>
            .
          </p>
          <p className="font-serif text-sm text-foreground/80">
            <strong>LinkedIn:</strong> You agree to the{" "}
            <a
              href="https://www.linkedin.com/legal/user-agreement"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-brand-primary"
            >
              LinkedIn User Agreement
            </a>
            .
          </p>
        </div>
      </>
    ),
  },
  {
    id: "subscriptions",
    title: "4. Subscriptions & Billing",
    content: (
      <div className="space-y-4">
        <p className="font-serif text-lg text-foreground/80 leading-relaxed">
          <strong>Auto-Renewal:</strong> Your subscription will automatically
          renew at the end of each billing cycle unless you cancel it before the
          renewal date.
        </p>
        <p className="font-serif text-lg text-foreground/80 leading-relaxed">
          <strong>Cancellation:</strong> You may cancel your subscription at any
          time via your account settings. Cancellation will take effect at the
          end of the current paid period.
        </p>
        <p className="font-serif text-lg text-foreground/80 leading-relaxed">
          <strong>Refunds:</strong> All fees are non-refundable except as
          required by law. We do not provide refunds for partial subscription
          periods.
        </p>
      </div>
    ),
  },
  {
    id: "content-rights",
    title: "5. User Content & License",
    content: (
      <>
        <p className="font-serif text-lg text-foreground/80 mb-4 leading-relaxed">
          <strong>Ownership:</strong> You retain all rights and ownership of
          your User Prompts, original content, and the resulting AI Content and
          media you upload ("User Content").
        </p>
        <p className="font-serif text-lg text-foreground/80 leading-relaxed">
          <strong>License to ezibreezy:</strong> By using the Service, you grant
          us a non-exclusive, worldwide, royalty-free license to use, reproduce,
          modify, and display your User Content{" "}
          <span className="italic">solely</span> for the purpose of operating,
          improving, and providing the Service (e.g., processing drafts,
          scheduling posts via APIs).
        </p>
      </>
    ),
  },
  {
    id: "prohibitions",
    title: "6. Prohibited Use",
    content: (
      <div className="p-6 border-2 border-dashed border-foreground/20 bg-foreground/[0.02]">
        <p className="font-serif text-sm text-foreground/80 mb-2">
          You agree not to use the Service to upload or publish content that is:
        </p>
        <ul className="list-disc pl-5 space-y-1 font-serif text-sm text-foreground/70">
          <li>Illegal, fraudulent, or promotes illegal acts.</li>
          <li>
            Infringing on any third party's intellectual property or privacy
            rights.
          </li>
          <li>
            Harmful, threatening, abusive, harassing, defamatory, or hateful.
          </li>
          <li>
            In violation of the terms of service of any integrated social media
            platform.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "liability",
    title: "7. Disclaimer & Liability",
    content: (
      <div className="space-y-4">
        <p className="font-serif text-sm text-foreground/70 uppercase tracking-wide">
          THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE." WE EXPRESSLY
          DISCLAIM ALL WARRANTIES OF ANY KIND.
        </p>
        <p className="font-serif text-lg text-foreground/80 leading-relaxed">
          IN NO EVENT SHALL EZIBREEZY BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
          SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING DAMAGES FOR
          LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING OUT OF YOUR USE OF
          THE SERVICE OR THE AI CONTENT GENERATED.
        </p>
      </div>
    ),
  },
  {
    id: "termination",
    title: "8. Termination",
    content: (
      <p className="font-serif text-lg text-foreground/80 leading-relaxed">
        We may terminate or suspend your access to the Service immediately,
        without prior notice or liability, for any reason, including if you
        breach these Terms. Upon termination, your right to use the Service will
        cease immediately.
      </p>
    ),
  },
  {
    id: "contact",
    title: "9. Contact",
    content: (
      <p className="font-serif text-lg text-foreground/80 leading-relaxed">
        For any questions regarding these Terms, please contact us at:{" "}
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

export default function TermsPage() {
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
                Legal Contract
              </p>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-medium leading-[0.9] tracking-tight text-foreground">
              Terms of <span className="italic">Service</span>
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
              "These terms govern your use of ezibreezy. By using our tool to
              generate and publish content, you agree to these rules, ensuring a
              safe and compliant environment for all creators."
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
                      {section.title.replace(/^\d+\.\s/, "")}
                      {/* Removing the number from title for display if needed, or keeping it */}
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
