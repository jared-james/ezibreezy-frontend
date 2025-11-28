// components/landing-page/landing-page-footer.tsx

import Link from "next/link";

export default function LandingPageFooter() {
  const contactEmail = "support@thegridmaster.com";

  return (
    <footer className="relative bg-background-editorial overflow-hidden">
      {/* FOOTER LINKS */}
      <div className="relative mx-auto w-full max-w-7xl px-6 pb-10 pt-12 text-foreground">
        <div className="mb-4 flex flex-col md:flex-row items-center justify-between border-t-2 border-foreground pt-4 text-[10px] md:text-xs font-mono uppercase tracking-wider gap-4 md:gap-0">
          <span className="text-foreground/60 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Systems Operational
          </span>

          <div className="flex items-center space-x-6">
            <Link
              href="/privacy"
              className="hover:text-brand-primary transition-colors"
            >
              Privacy Protocol
            </Link>
            <Link
              href="/terms"
              className="hover:text-brand-primary transition-colors"
            >
              Terms of Service
            </Link>

            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="hover:text-brand-primary transition-colors"
              >
                Help Desk
              </a>
            )}
          </div>
        </div>

        <p className="border-t-4 border-double border-foreground/20 pt-4 text-center font-serif text-[0.7rem] md:text-xs uppercase tracking-[0.25em] text-foreground/40">
          EziBreezy Editorial Desk · Est. 2025 · All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
