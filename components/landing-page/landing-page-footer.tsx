// components/landing-page/landing-page-footer.tsx

import Link from "next/link";

export default function LandingPageFooter() {
  return (
    <footer className="bg-[--background] px-4 pb-10 pt-12 mt-16">
      <div className="mx-auto w-full max-w-5xl">
        {/* Top footer bar – mirrors header top bar */}
        <div className="mb-4 flex items-center justify-between border-t-2 border-[--foreground] pt-2 text-xs uppercase tracking-wider">
          <span className="text-[--foreground] font-serif font-normal tracking-[0.15em]">
            Breezy Times
          </span>

          <div className="flex items-center space-x-6">
            <Link
              href="/privacy"
              className="hover:underline text-[--foreground]"
            >
              Privacy
            </Link>
            <Link href="/terms" className="hover:underline text-[--foreground]">
              Terms
            </Link>
          </div>
        </div>

        {/* Publication line – echoes the masthead border style */}
        <p className="border-t-4 border-double border-[--foreground] pt-3 text-center font-serif text-[0.7rem] md:text-xs uppercase tracking-[0.25em] text-[--muted-foreground]">
          Edition No. 01 · EziBreezy · 2025 · All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
