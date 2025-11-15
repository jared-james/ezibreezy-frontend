// components/landing-page/landing-page-header.tsx

import Link from "next/link";

export default function LandingPageHeader() {
  return (
    <header className="bg-[--background] px-4 pt-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* Top bar */}
        <div className="mb-4 flex items-center justify-between border-b-2 border-[--foreground] pb-2 text-xs uppercase tracking-wider">
          <span className="text-[--foreground] font-serif font-normal tracking-[0.15em]">
            Breezy Times
          </span>

          <div className="flex items-center space-x-6">
            <Link
              href="/auth/signup"
              className="hover:underline text-[--foreground]"
            >
              Sign Up
            </Link>
            <Link
              href="/auth/login"
              className="hover:underline text-[--foreground]"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Masthead */}
        <h1 className="mb-8 border-b-4 border-double border-[--foreground] pb-4 text-center font-serif text-6xl md:text-8xl font-bold uppercase tracking-tight">
          EziBreezy
        </h1>
      </div>
    </header>
  );
}
