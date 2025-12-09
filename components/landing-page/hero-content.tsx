// components/landing-page/hero-content.tsx

"use client";

import { useState } from "react";
import {
  ArrowRight,
  Star,
  Scissors,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { signupForWaitlist } from "@/app/actions/early-access";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroContent() {
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
        const errorMessage =
          result.error || "Signup failed due to an unknown error.";
        setError(errorMessage);

        // Show user-friendly toast messages
        if (
          errorMessage.toLowerCase().includes("already on the waitlist") ||
          errorMessage.toLowerCase().includes("already exists")
        ) {
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
    <div className="flex flex-col justify-center lg:col-span-7">
      {/* "Late Breaking" Tag */}
      <div className="relative mb-4 inline-flex w-fit items-center gap-2 px-3 py-1">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-primary">
          Inspire. Create. Publish.
        </span>
      </div>

      <h1 className="mb-8 font-serif text-5xl font-bold leading-[1.1] tracking-tight md:text-6xl">
        The social media scheduler that goes beyond scheduling
      </h1>

      {/* Editorial Copy */}
      <div className="prose prose-lg mb-10 max-w-xl font-serif leading-relaxed text-foreground/80">
        <p>
          <span className="mr-3 -mt-1.5 float-left font-serif text-5xl font-bold">
            W
          </span>
          e are building the editorial desk for the modern creator. polished,
          intuitive, and unmistakably enjoyable to create in.
        </p>

        <p className="mt-6 border-l-4 border-foreground pl-4 text-base italic text-foreground/60">
          “The problem isn&apos;t hitting schedule, it&apos;s sitting in front
          of a blank page with a million ideas and no starting point. I
          don&apos;t need another{" "}
          <span className="line-through decoration-foreground/40 opacity-50">
            cross-posting omni-channel marketing platform
          </span>
          ...{" "}
          <span className="font-bold text-foreground/80 not-italic">
            *ahem*
          </span>{" "}
          ... I need one place that helps me turn ideas into content, repurpose
          it, and get it out across every channel.”
        </p>
      </div>

      {/* Email Capture Section */}
      <div className="mt-2 max-w-md overflow-hidden p-1">
        {/* The "Cut Line" */}
        <div className="mb-2 flex items-center gap-2 text-foreground/40">
          <Scissors className="h-4 w-4 -rotate-90" />
          <div className="flex-1 border-b border-dashed border-foreground/40" />
          <span className="font-mono text-[10px] uppercase tracking-widest">
            {isSuccess ? "Dispatched" : "Detach & Return"}
          </span>
        </div>

        <div className="relative min-h-[100px]">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form
                key="signup-form"
                onSubmit={handleJoin}
                className="group relative"
                // The Exit Animation (The Train Leaving)
                exit={{
                  x: "100%",
                  opacity: 0,
                  transition: {
                    duration: 0.8,
                    ease: "backIn",
                  },
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

                <div className="relative border-2 border-dashed border-foreground bg-surface p-4 transition-all hover:bg-surface-hover">
                  <div className="flex flex-col items-stretch gap-3 sm:flex-row">
                    <div className="flex flex-1 flex-col justify-end">
                      <label
                        htmlFor="email"
                        className="mb-1 pl-1 font-mono text-[10px] uppercase tracking-widest text-foreground"
                      >
                        Early Access Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="go.viral@everyday.com"
                        value={email}
                        disabled={isLoading}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border-b-2 border-dotted border-foreground/30 bg-transparent px-1 py-1 font-serif text-lg placeholder:text-foreground/20 focus:border-foreground focus:outline-none focus:ring-0 transition-colors disabled:opacity-50"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`
                        relative flex min-w-[140px] items-center justify-center gap-2 overflow-hidden px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all
                        ${
                          isLoading
                            ? "bg-white/10 text-foreground cursor-wait"
                            : "bg-brand-primary text-white hover:bg-brand-primary-hover"
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

                      <span className="relative z-10 flex items-center gap-2">
                        {isLoading ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            DISPATCHING...
                          </>
                        ) : (
                          <>
                            DISPATCH <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                  {error && (
                    <p className="mt-2 font-serif text-sm text-red-600">
                      {error}
                    </p>
                  )}
                </div>
              </motion.form>
            ) : (
              // The Thank You State
              <motion.div
                key="success-message"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex h-full flex-col justify-center border-2 border-dashed border-brand-primary/20 bg-brand-primary/5 p-6 text-center"
              >
                <div className="flex flex-col items-center gap-2 text-foreground">
                  <div className="flex items-center gap-2 font-serif text-xl italic">
                    <CheckCircle2 className="h-5 w-5 text-brand-primary" />
                    <span>Received. Thank you.</span>
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/50">
                    Your spot is secured
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-3 pl-1 font-mono text-[10px] uppercase tracking-wide text-foreground/50">
          * Limited spots available for early access.
        </p>
      </div>
    </div>
  );
}
