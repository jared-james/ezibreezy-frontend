// app/auth/signup/ComingSoonSignUp.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Loader2, Check, Scissors } from "lucide-react";
import { signupForWaitlist } from "@/app/actions/early-access";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import MinimalHeader from "@/components/shared/minimal-header";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ComingSoonSignUp() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot.length > 0) {
      setIsLoading(false);
      return;
    }

    if (!email) return;

    setError(null);
    setIsLoading(true);

    try {
      const result = await signupForWaitlist({
        email,
      });

      if (result.success) {
        setIsSuccess(true);
        toast.success("Dispatched successfully.");
      } else {
        const errorMessage = result.error || "Signup failed due to an unknown error.";
        setError(errorMessage);

        // Show user-friendly toast messages
        if (errorMessage.toLowerCase().includes("already on the waitlist") ||
            errorMessage.toLowerCase().includes("already exists")) {
          toast.info("You're already on the list! We'll be in touch soon.");
        } else {
          toast.error(errorMessage);
        }
      }
    } catch {
      setError("A critical network error occurred during signup.");
      toast.error("Network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground">
      <MinimalHeader />

      <main className="grow flex items-center justify-center py-16 px-6">
        <div className="mx-auto w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="w-16 h-20 mx-auto mb-6 relative">
              <Image
                src="/logo_smile.webp"
                alt="EziBreezy Logo"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="font-serif text-3xl font-medium tracking-tight mb-2">
              Join the Waitlist
            </h1>
            <p className="font-serif text-base text-foreground/60 italic">
              We are finalizing the editorial desk.
            </p>
          </div>

          {/* THE CUT-OUT CARD */}
          <div className="relative">
            {/* Scissors Decoration */}
            <div className="absolute -top-3 left-0 w-full flex items-center gap-2 text-foreground/40 px-1">
              <div className="flex-1 border-b border-dashed border-foreground/40" />
              <span className="font-mono text-[9px] uppercase tracking-widest">
                Detach & Return
              </span>
            </div>

            <div className="border-x-2 border-b-2 border-dashed border-foreground/30 bg-surface/50 p-8 pt-10 backdrop-blur-sm">
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: 10 }}
                    onSubmit={handleWaitlistSubmit}
                    className="space-y-8"
                  >
                    {/* HONEYPOT */}
                    <div className="absolute left-[-9999px]" aria-hidden="true">
                      <input
                        type="text"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="block text-center font-mono text-[10px] uppercase tracking-widest text-foreground/50"
                      >
                        Enter Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="editor@example.com"
                        disabled={isLoading}
                        className="w-full bg-transparent border-b border-foreground/30 px-2 py-2 font-serif text-xl text-center placeholder:text-foreground/20 focus:border-foreground focus:outline-none focus:ring-0 transition-colors disabled:opacity-50"
                      />
                    </div>

                    {error && (
                      <div className="text-center">
                        <span className="inline-block border border-red-200 bg-red-50 px-2 py-1 font-serif text-xs text-red-600">
                          {error}
                        </span>
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* FLAT BASIC BUTTON */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative w-full overflow-hidden bg-brand-primary text-white py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-brand-primary-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {isLoading ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Processing
                            </>
                          ) : (
                            <>
                              Request Access
                              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                            </>
                          )}
                        </span>
                      </button>

                      <p className="text-center font-mono text-[9px] text-foreground/40 uppercase tracking-wide">
                        * No spam. Only updates.
                      </p>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-4 text-center space-y-4"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-foreground/20 bg-brand-primary/10 text-brand-primary">
                      <Check className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-medium">
                        Received
                      </h3>
                      <p className="mt-1 font-mono text-xs text-foreground/60 uppercase tracking-wide">
                        You are on the list.
                      </p>
                    </div>

                    <div className="pt-4">
                      <Link
                        href="/"
                        className="text-xs font-bold uppercase tracking-widest hover:text-brand-primary border-b border-transparent hover:border-brand-primary transition-all pb-0.5"
                      >
                        Back to Home
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <LandingPageFooter />
    </div>
  );
}
