// app/auth/signup/page.tsx

"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setIsSubmitted(true);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[--background] px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="bg-[#f5f0e8] border-2 border-[--success] shadow-lg relative">
            <div className="absolute top-4 right-4 w-20 h-24 border-2 border-[--success] bg-green-50 flex items-center justify-center">
              <div className="text-center">
                <svg
                  className="w-12 h-12 text-[--success] mx-auto"
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
            </div>

            <div className="grid md:grid-cols-2 min-h-[500px]">
              <div className="p-8 md:p-10 border-r-2 border-[--success] flex flex-col">
                <div className="mb-6">
                  <h1
                    className="font-serif text-2xl uppercase tracking-wider text-[--muted]"
                    style={{ fontWeight: 400, letterSpacing: "0.2em" }}
                  >
                    Sign Up
                  </h1>
                </div>

                <div className="flex-1 flex items-center">
                  <div className="space-y-1">
                    <p
                      className="font-serif text-2xl md:text-3xl"
                      style={{
                        fontStyle: "italic",
                        fontWeight: 300,
                        lineHeight: 1.4,
                        color: "#4a4a4a",
                      }}
                    >
                      Check your
                    </p>
                    <p
                      className="font-serif text-2xl md:text-3xl"
                      style={{
                        fontStyle: "italic",
                        fontWeight: 300,
                        lineHeight: 1.4,
                        color: "#4a4a4a",
                      }}
                    >
                      mailbox for
                    </p>
                    <p
                      className="font-serif text-2xl md:text-3xl"
                      style={{
                        fontStyle: "italic",
                        fontWeight: 300,
                        lineHeight: 1.4,
                        color: "#4a4a4a",
                      }}
                    >
                      your invitation
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-6">
                  <p className="font-serif text-sm font-bold uppercase tracking-[0.2em]">
                    EziBreezy
                  </p>
                </div>
              </div>

              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="space-y-4">
                  <p className="font-serif text-lg leading-relaxed text-[--foreground]">
                    We've sent a confirmation link to your email address.
                  </p>
                  <p className="font-serif text-sm text-[--muted]">
                    Click the link in the email to complete your registration
                    and access your account.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-[--border]">
                  <Link href="/" className="btn btn-outline w-full">
                    Return Home
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="font-serif text-xs text-[--muted-foreground] uppercase tracking-wider">
              Est. 2025 · All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[--background] px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="bg-[#f5f0e8] border-2 border-[--foreground] shadow-lg relative">
          <div className="absolute top-4 right-4 w-20 h-24 flex items-center justify-center p-2">
            <Image
              src="/logo_smile.webp"
              alt="EziBreezy Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>

          <div className="grid md:grid-cols-2 min-h-[500px]">
            <div className="p-8 md:p-10 border-r-2 border-[--foreground] flex flex-col">
              <div className="mb-6">
                <h1
                  className="font-serif text-2xl uppercase tracking-wider text-[--muted]"
                  style={{ fontWeight: 400, letterSpacing: "0.2em" }}
                >
                  Sign Up
                </h1>
              </div>

              <div className="flex-1 flex items-center">
                <div className="space-y-1">
                  <p
                    className="font-serif text-2xl md:text-3xl"
                    style={{
                      fontStyle: "italic",
                      fontWeight: 300,
                      lineHeight: 1.4,
                      color: "#4a4a4a",
                    }}
                  >
                    Join us and start
                  </p>
                  <p
                    className="font-serif text-2xl md:text-3xl"
                    style={{
                      fontStyle: "italic",
                      fontWeight: 300,
                      lineHeight: 1.4,
                      color: "#4a4a4a",
                    }}
                  >
                    creating content
                  </p>
                  <p
                    className="font-serif text-2xl md:text-3xl"
                    style={{
                      fontStyle: "italic",
                      fontWeight: 300,
                      lineHeight: 1.4,
                      color: "#4a4a4a",
                    }}
                  >
                    with ease
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-6">
                <p className="font-serif text-sm font-bold uppercase tracking-[0.2em]">
                  EziBreezy
                </p>
              </div>
            </div>

            <div className="p-8 md:p-10 flex flex-col">
              <form onSubmit={handleSignUp} className="flex-1 flex flex-col">
                <div className="flex-1"></div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="border-b border-[--muted] pb-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="w-full bg-transparent border-none font-serif text-[--foreground] focus:outline-none placeholder:text-[--muted-foreground] placeholder:italic"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="border-b border-[--muted] pb-2">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="password (min. 6 characters)"
                        className="w-full bg-transparent border-none font-serif text-[--foreground] focus:outline-none placeholder:text-[--muted-foreground] placeholder:italic"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 border border-[--error] bg-red-50 mt-4">
                    <p className="font-serif text-xs text-[--error]">{error}</p>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-full py-3"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </button>
                </div>

                <div className="pt-2">
                  <p className="font-serif text-[0.65rem] text-[--muted-foreground] text-center italic">
                    By creating an account, you agree to our Terms & Privacy
                  </p>
                </div>
              </form>

              <div className="mt-6 pt-6 border-t border-[--border]">
                <p className="text-center font-serif text-sm text-[--muted]">
                  Already a member?{" "}
                  <Link
                    href="/auth/login"
                    className="font-bold text-[--foreground] hover:underline"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="font-serif text-sm text-[--muted-foreground] hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
