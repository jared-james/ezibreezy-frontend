// app/auth/signup/ComingSoonSignUp.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signupForWaitlist } from "@/app/actions/early-access";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import LandingPageHeader from "@/components/landing-page/landing-page-header";

export default function ComingSoonSignUp() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Honeypot state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // HONEYPOT CHECK: If the honeypot field is filled, treat as bot and exit silently.
    if (honeypot.length > 0) {
      // Fail silently without error message or submission
      // To confuse the bot, we can optionally set a short timeout and pretend success,
      // but for simplicity, we just stop processing immediately.
      setIsLoading(false);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const result = await signupForWaitlist({
        email,
      });

      if (result.success) {
        setIsSubmitted(true);
      } else {
        setError(result.error || "Signup failed due to an unknown error.");
      }
    } catch {
      setError("A critical network error occurred during signup.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col min-h-screen">
        <LandingPageHeader />
        <main className="flex-grow bg-[--background] py-16 px-4 flex items-center justify-center">
          <div className="mx-auto w-full max-w-5xl">
            <div className="max-w-md mx-auto text-center space-y-6">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-[--success]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="font-serif text-3xl uppercase tracking-wider">
                You&rsquo;re on the list
              </h1>
              <p className="font-serif text-lg text-[--muted] leading-relaxed">
                We&rsquo;ll notify you as soon as we launch.
              </p>
              <Link href="/" className="btn btn-outline w-full mt-4">
                Return Home
              </Link>
            </div>
          </div>
        </main>
        <LandingPageFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <LandingPageHeader />
      <main className="flex-grow bg-[--background] py-16 px-4 flex items-center justify-center">
        <div className="mx-auto w-full max-w-5xl">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="w-20 h-24 mx-auto mb-4 flex items-center justify-center">
              <Image
                src="/logo_smile.webp"
                alt="EziBreezy Logo"
                width={80}
                height={96}
                className="object-contain"
              />
            </div>
            <h1 className="font-serif text-3xl uppercase tracking-wider">
              Ready for some EziBreezy content creation?
            </h1>
            <p className="font-serif text-lg text-[--muted] leading-relaxed">
              Currently in development
            </p>
            <form onSubmit={handleWaitlistSubmit} className="space-y-4">
              {/* HONEYPOT FIELD: Hidden from users, but visible to bots */}
              <div
                style={{
                  position: "absolute",
                  left: "-5000px",
                  top: "auto",
                  width: "1px",
                  height: "1px",
                  overflow: "hidden",
                }}
                aria-hidden="true"
              >
                <label htmlFor="company-name">Company Name (Ignore)</label>
                <input
                  id="company-name"
                  name="company-name"
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              {/* END HONEYPOT FIELD */}

              <div className="border-b-2 border-[--foreground] pb-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-transparent border-none font-serif text-[--foreground] focus:outline-none placeholder:text-[--muted-foreground] placeholder:italic text-center"
                  disabled={isLoading}
                />
              </div>
              {error && (
                <p className="font-serif text-sm text-[--error]">{error}</p>
              )}
              <button
                type="submit"
                className="btn btn-primary w-full py-3"
                disabled={isLoading}
              >
                {isLoading ? "Joining..." : "Get Early Access"}
              </button>
            </form>
            <p className="font-serif text-xs text-[--muted-foreground] italic">
              Limited spots available for our launch cohort
            </p>
            <Link href="/" className="btn btn-outline w-full mt-4">
              Return Home
            </Link>
          </div>
        </div>
      </main>
      <LandingPageFooter />
    </div>
  );
}
