// components/landing-page/landing-page-footer.tsx

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPageFooter() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const user = "support";
    const domain = "ezibreezy";
    const tld = "com";
    setEmail(`${user}@${domain}.${tld}`);
  }, []);

  return (
    <footer className="bg-background px-6 pb-10 pt-12 mt-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-4 flex items-center justify-between border-t-2 border-foreground pt-2 text-xs uppercase tracking-wider">
          <span className="text-foreground font-serif font-normal tracking-[0.15em]">
            IN DEVELOPMENT
          </span>

          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:underline text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:underline text-foreground">
              Terms
            </Link>

            {email && (
              <a
                href={`mailto:${email}`}
                className="hover:underline text-foreground"
              >
                {email}
              </a>
            )}
          </div>
        </div>

        <p className="border-t-4 border-double border-foreground pt-3 text-center font-serif text-[0.7rem] md:text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Edition No. 01 · EziBreezy · 2025 · All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
