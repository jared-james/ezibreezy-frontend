// app/auth/signup/ComingSoonSignUp.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signupForWaitlist } from "@/app/actions/early-access";

export default function ComingSoonSignUp() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Use the secure Server Action to call the backend waitlist endpoint
      const result = await signupForWaitlist({
        email,
      });

      if (result.success) {
        setIsSubmitted(true);
      } else {
        // Display the error message returned from the Server Action/Backend
        setError(result.error || "Signup failed due to an unknown error.");
      }
    } catch {
      // Catch any unhandled network errors
      setError("A critical network error occurred during signup.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[--background] flex items-center justify-center p-8">
        <div className="max-w-md text-center space-y-6">
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
            We&rsquo;ll notify you as soon as we launch. Get ready to create
            content with ease.
          </p>
          <Link href="/" className="btn btn-outline w-full mt-4">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[--background] flex items-center justify-center p-8">
      <div className="max-w-md text-center space-y-6">
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
          Join the Waitlist
        </h1>
        <p className="font-serif text-lg text-[--muted] leading-relaxed">
          Be among the first to experience a new way to create and share
          content. Exclusive early access coming soon.
        </p>
        <form onSubmit={handleWaitlistSubmit} className="space-y-4">
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
  );
}
