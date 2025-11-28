// components/landing-page/landing-page-footer.tsx

"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Scissors,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { signupForWaitlist } from "@/app/actions/early-access";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingPageFooter() {
  const contactEmail = "support@thegridmaster.com";
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
    <footer className="relative bg-background-editorial overflow-hidden">
      {/* FINAL CTA SECTION - "The Bold Statement" */}
      <div className="relative border-t-4 border-foreground bg-foreground text-background">
        {/* Abstract texture for the dark background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="mx-auto w-full max-w-7xl px-6 py-20 md:py-32 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:items-end justify-between">
            {/* Left Side: The Hook */}
            <div className="max-w-3xl">
              <div className="mb-8">
                {/* THE RED TAG */}
                <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] font-bold border border-white/20 shadow-[4px_4px_0_0_rgba(255,255,255,0.2)]">
                  <AlertCircle className="w-4 h-4 fill-current" />
                  <span>Late Breaking News</span>
                </div>
              </div>

              <h2 className="font-serif text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.85] mb-8 tracking-tighter text-white">
                Don't get left <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
                  Behind.
                </span>
              </h2>

              <p className="font-serif text-xl md:text-2xl text-white/80 max-w-2xl leading-relaxed border-l-4 border-brand-primary pl-6">
                Your competition is still trying to figure out which hashtag to
                use. We are building the engine that makes them obsolete.
              </p>
            </div>

            {/* Right Side: The Capture */}
            <div className="w-full max-w-md lg:pb-4">
              {/* The "Cut Line" - Inverted for dark mode */}
              <div className="mb-3 flex items-center gap-2 text-white/40">
                <Scissors className="h-4 w-4 -rotate-90" />
                <div className="flex-1 border-b border-dashed border-white/30" />
                <span className="font-mono text-[10px] uppercase tracking-widest">
                  {isSuccess ? "Dispatched" : "Secure Your Spot"}
                </span>
              </div>

              <div className="relative min-h-[100px]">
                <AnimatePresence mode="wait">
                  {!isSuccess ? (
                    <motion.form
                      key="signup-form"
                      onSubmit={handleJoin}
                      className="group relative"
                      exit={{
                        x: "100%",
                        opacity: 0,
                        transition: { duration: 0.8, ease: "backIn" },
                      }}
                    >
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
                        <label htmlFor="footer-company-name">
                          Company Name (Ignore)
                        </label>
                        <input
                          id="footer-company-name"
                          name="company-name"
                          type="text"
                          value={honeypot}
                          onChange={(e) => setHoneypot(e.target.value)}
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </div>
                      {/* END HONEYPOT FIELD */}

                      <div className="relative border-2 border-dashed border-white/30 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-white/50 backdrop-blur-sm">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col">
                            <label
                              htmlFor="footer-email"
                              className="mb-2 pl-1 font-mono text-[10px] uppercase tracking-widest text-brand-primary font-bold"
                            >
                              Subscriber Email
                            </label>
                            <input
                              id="footer-email"
                              type="email"
                              placeholder="you@future-winner.com"
                              value={email}
                              disabled={isLoading}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full border-b-2 border-white/20 bg-transparent px-1 py-2 font-serif text-2xl text-white placeholder:text-white/20 focus:border-brand-primary focus:outline-none focus:ring-0 transition-colors disabled:opacity-50"
                              required
                            />
                          </div>

                          {error && (
                            <p className="font-serif text-sm text-red-400">
                              {error}
                            </p>
                          )}

                          {/* THE GREEN BUTTON */}
                          <button
                            type="submit"
                            disabled={isLoading}
                            className={`
                              relative flex w-full items-center justify-center gap-2 overflow-hidden px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all
                              border border-transparent
                              ${
                                isLoading
                                  ? "bg-white/10 text-white cursor-wait"
                                  : "bg-brand-primary text-white hover:bg-brand-primary-hover shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:shadow-[2px_2px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
                              }
                            `}
                          >
                            {isLoading && (
                              <div
                                className="absolute inset-0 opacity-20"
                                style={{
                                  backgroundImage:
                                    "repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 20px)",
                                }}
                              />
                            )}

                            <span className="relative z-10 flex items-center gap-3">
                              {isLoading ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  PROCESSING...
                                </>
                              ) : (
                                <>
                                  Get Early Access{" "}
                                  <ArrowRight className="h-4 w-4" />
                                </>
                              )}
                            </span>
                          </button>
                        </div>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success-message"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="flex h-full flex-col justify-center border-2 border-dashed border-brand-primary/50 bg-brand-primary/10 p-8 text-center"
                    >
                      <div className="flex flex-col items-center gap-3 text-white">
                        <div className="flex items-center gap-2 font-serif text-2xl italic text-brand-primary">
                          <CheckCircle2 className="h-6 w-6" />
                          <span>We received it.</span>
                        </div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">
                          Welcome to the inner circle
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER LINKS (Back to Editorial Style) */}
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

        <p className="border-t-4 border-double border-foreground/20 pt-4 text-center font-serif text-[0.7rem] md:text-xs uppercase tracking-[0.25em] text-foreground">
          EziBreezy Editorial Desk · Est. 2025 · All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
