// components/landing-page/landing-page-footer.tsx

"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { signupForWaitlist } from "@/app/actions/early-access";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingPageFooter() {
  const contactEmail = "support@ezibreezy.com";
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async (e: React.FormEvent) => {
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
        setError(result.error || "Signup failed due to an unknown error.");
        toast.error(result.error || "Signup failed.");
      }
    } catch {
      setError("A critical network error occurred during signup.");
      toast.error("Network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="relative bg-background-editorial border-t-2 border-foreground overflow-hidden font-serif">
      <div className="relative mx-auto w-full max-w-7xl px-6 pt-16 pb-8 text-foreground">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Column 1: Brand & Mission */}
          <div className="md:col-span-4 space-y-6">
            <Link href="/" className="block">
              <span className="font-serif text-2xl font-bold tracking-tight">
                EziBreezy.
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-foreground/80 max-w-xs">
              The editorial desk for the modern creator. polished, intuitive,
              and unmistakably enjoyable to create in.
            </p>
          </div>

          {/* Column 2: Free Tools (SEO Powerhouse) */}
          <div className="md:col-span-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest mb-6 text-foreground/50">
              Free Utilities
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/tools/instagram-font-generator"
                  className="hover:text-brand-primary hover:underline decoration-dotted underline-offset-4 transition-colors"
                >
                  Instagram Font Generator
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/instagram-grid-planner"
                  className="hover:text-brand-primary hover:underline decoration-dotted underline-offset-4 transition-colors"
                >
                  Grid Planner (Simulator)
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/instagram-grid-maker"
                  className="hover:text-brand-primary hover:underline decoration-dotted underline-offset-4 transition-colors"
                >
                  Grid Maker (Splitter)
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/instagram-carousel-splitter"
                  className="hover:text-brand-primary hover:underline decoration-dotted underline-offset-4 transition-colors"
                >
                  Carousel Splitter
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/social-image-resizer"
                  className="hover:text-brand-primary hover:underline decoration-dotted underline-offset-4 transition-colors"
                >
                  Social Image Resizer
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/screenshot-studio"
                  className="hover:text-brand-primary hover:underline decoration-dotted underline-offset-4 transition-colors"
                >
                  Screenshot Studio
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/linkedin-text-formatter"
                  className="hover:text-brand-primary hover:underline decoration-dotted underline-offset-4 transition-colors"
                >
                  LinkedIn Formatter
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/youtube-title-checker"
                  className="hover:text-brand-primary hover:underline decoration-dotted underline-offset-4 transition-colors"
                >
                  YouTube Title Checker
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/tools"
                  className="font-bold text-xs uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all"
                >
                  View All <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="md:col-span-2">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest mb-6 text-foreground/50">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-brand-primary hover:underline decoration-dotted underline-offset-4 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/editorial"
                  className="hover:text-brand-primary hover:underline decoration-dotted underline-offset-4 transition-colors"
                >
                  Editorial
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="hover:text-brand-primary hover:underline decoration-dotted underline-offset-4 transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/signup"
                  className="hover:text-brand-primary hover:underline decoration-dotted underline-offset-4 transition-colors"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Widget */}
          <div className="md:col-span-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest mb-6 text-foreground/50">
              The Dispatch
            </h4>
            <div className="bg-surface border border-dashed border-foreground/30 p-4 relative">
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleJoin}
                    className="space-y-3"
                  >
                    <p className="text-xs text-foreground/70 mb-2">
                      Get editorial tips and product updates. No spam.
                    </p>
                    <div className="absolute left-[-9999px]" aria-hidden="true">
                      <input
                        type="text"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="editor@ezibreezy.com"
                        disabled={isLoading}
                        className="w-full bg-background border-b border-foreground/30 py-1 text-sm placeholder:text-foreground/30 focus:outline-none focus:border-brand-primary transition-colors"
                      />
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="text-foreground hover:text-brand-primary disabled:opacity-50"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <ArrowRight className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {error && (
                      <span className="text-[10px] text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {error}
                      </span>
                    )}
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center text-center py-2"
                  >
                    <CheckCircle2 className="w-6 h-6 text-brand-primary mb-2" />
                    <p className="text-xs font-bold">
                      You&apos;re on the list.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Supported Platforms - SEO Section */}
        <div className="py-8 border-t border-dotted border-foreground/20">
          <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest mb-4 text-foreground/40 text-center">
            Supported Platforms
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-foreground/60">
            <Link
              href="/features/instagram-scheduler"
              className="hover:text-brand-primary hover:underline decoration-dotted underline-offset-4 transition-colors"
            >
              Instagram Scheduler
            </Link>
            <span className="text-foreground/20">•</span>
            <Link
              href="/features/linkedin-scheduler"
              className="hover:text-brand-primary hover:underline decoration-dotted underline-offset-4 transition-colors"
            >
              LinkedIn Scheduler
            </Link>
            <span className="text-foreground/20">•</span>
            <Link
              href="/features/tiktok-scheduler"
              className="hover:text-brand-primary hover:underline decoration-dotted underline-offset-4 transition-colors"
            >
              TikTok Scheduler
            </Link>
            <span className="text-foreground/20">•</span>
            <Link
              href="/features/twitter-scheduler"
              className="hover:text-brand-primary hover:underline decoration-dotted underline-offset-4 transition-colors"
            >
              Twitter Scheduler
            </Link>
            <span className="text-foreground/20">•</span>
            <Link
              href="/features/facebook-scheduler"
              className="hover:text-brand-primary hover:underline decoration-dotted underline-offset-4 transition-colors"
            >
              Facebook Scheduler
            </Link>
            <span className="text-foreground/20">•</span>
            <Link
              href="/features/youtube-scheduler"
              className="hover:text-brand-primary hover:underline decoration-dotted underline-offset-4 transition-colors"
            >
              YouTube Scheduler
            </Link>
            <span className="text-foreground/20">•</span>
            <Link
              href="/features/threads-scheduler"
              className="hover:text-brand-primary hover:underline decoration-dotted underline-offset-4 transition-colors"
            >
              Threads Scheduler
            </Link>
            <span className="text-foreground/20">•</span>
            <Link
              href="/features/pinterest-scheduler"
              className="hover:text-brand-primary hover:underline decoration-dotted underline-offset-4 transition-colors"
            >
              Pinterest Scheduler
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t-2 border-double border-foreground/20 pt-6 text-[10px] md:text-xs font-mono uppercase tracking-wider gap-4 md:gap-0">
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-brand-primary hover:underline decoration-dotted underline-offset-4 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-brand-primary hover:underline decoration-dotted underline-offset-4 transition-colors"
            >
              Terms
            </Link>
            <a
              href={`mailto:${contactEmail}`}
              className="hover:text-brand-primary hover:underline decoration-dotted underline-offset-4 transition-colors"
            >
              Support
            </a>
          </div>

          <p className="text-foreground/40">
            EziBreezy Editorial Desk · Est. 2025
          </p>

          <span className="text-foreground/60 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Systems Operational
          </span>
        </div>
      </div>
    </footer>
  );
}
