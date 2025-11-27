// components/landing-page/landing-page-hero.tsx

"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Star, Scissors } from "lucide-react";
import Image from "next/image";
import { signupForWaitlist } from "@/app/actions/early-access";
import { toast } from "sonner";
import { motion } from "framer-motion";
// Generate a barcode pattern - alternating thick and thin bars
const generateBarcodePattern = (seed: string) => {
  const bars = [];
  for (let i = 0; i < seed.length; i++) {
    const charCode = seed.charCodeAt(i);
    // Create 3-5 bars per character with varying widths for better fill
    const numBars = (charCode % 3) + 3;
    for (let j = 0; j < numBars; j++) {
      bars.push({
        width: ((charCode + j) % 3) + 2, // Width between 2-4
        index: bars.length,
      });
    }
  }
  return bars;
};

const BARCODE_SEED = "EZ-BREEZY-DEV-ACCESS-70";
const BARCODE_PATTERN = generateBarcodePattern(BARCODE_SEED);

export default function LandingPageHero() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Counter animation - starts after 500ms delay
  useEffect(() => {
    const timer = setTimeout(() => setProgress(70), 500);
    return () => clearTimeout(timer);
  }, []);

  // Calculate total animation duration for barcode
  const ANIMATION_DURATION = 2000; // 2 seconds to match counter

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const result = await signupForWaitlist({ email });
      if (result.success) {
        toast.success("Welcome to the club. You're on the list.");
        setEmail("");
      } else {
        toast.error(result.error || "Something went wrong.");
      }
    } catch {
      toast.error("Failed to join. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative w-full bg-background-editorial text-foreground overflow-hidden ">
      {/* Background Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 pt-12 pb-24 md:pb-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* LEFT COLUMN: The Lead Story */}
          <div className="flex flex-col justify-center lg:col-span-7">
            {/* "Late Breaking" Tag */}
            <div className="mb-8 inline-flex w-fit items-center gap-2 border-2 border-foreground bg-brand-primary px-3 py-1 text-brand-primary-foreground shadow-[4px_4px_0_0_var(--brand-primary)]">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Late Breaking News
              </span>
            </div>

            <h2 className="mb-8 font-serif text-5xl font-bold leading-[1.1] tracking-tight md:text-6xl">
              Social media shouldn't feel like a second job.
            </h2>

            {/* Editorial Copy */}
            <div className="prose prose-lg mb-10 max-w-xl font-serif leading-relaxed text-foreground/80">
              <p>
                <span className="mr-3 mt-[-6px] float-left font-serif text-5xl font-bold">
                  W
                </span>
                e are building the editorial desk for the modern creator. Think
                through what you want to say, capture it quickly, and turn it
                into posts without the burnout.
              </p>
              <p className="mt-6 border-l-4 border-foreground pl-4 text-base italic text-foreground/60">
                "Finally, a tool that respects the creative process instead of
                just the algorithm."
              </p>
            </div>

            {/* Email Capture Form - "The Coupon" Style */}
            <div className="mt-2 max-w-md">
              <div className="mb-2 flex items-center gap-2 text-foreground/40">
                <Scissors className="h-4 w-4 -rotate-90" />
                <div className="flex-1 border-b border-dashed border-foreground/40" />
                <span className="font-mono text-[10px] uppercase tracking-widest">
                  Detach & Return
                </span>
              </div>

              <form onSubmit={handleJoin} className="group relative">
                <div className="relative border-2 border-dashed border-foreground bg-surface p-4 transition-all hover:bg-surface-hover">
                  <div className="flex flex-col items-stretch gap-3 sm:flex-row">
                    <div className="flex flex-1 flex-col justify-end">
                      <label
                        htmlFor="email"
                        className="mb-1 pl-1 font-mono text-[10px] uppercase tracking-widest text-foreground/50"
                      >
                        Subscriber Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="write.here@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border-b-2 border-dotted border-foreground/30 bg-transparent px-1 py-1 font-serif text-lg placeholder:text-foreground/20 focus:border-foreground focus:outline-none focus:ring-0 transition-colors"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 bg-foreground px-6 py-3 text-xs font-bold uppercase tracking-wider text-background transition-all hover:bg-foreground/90 disabled:opacity-70 shadow-[4px_4px_0_0_var(--brand-primary)]"
                    >
                      {isLoading ? "..." : "Send"}{" "}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </form>

              <p className="mt-3 pl-1 font-mono text-[10px] uppercase tracking-wide text-foreground/50">
                * Limited spots available for early access cohort.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: The Press Pass Visual */}
          <div className="relative hidden lg:col-span-5 lg:block">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm rotate-3 cursor-default transition-transform duration-500 ease-out hover:rotate-0">
              {/* Card Shadow */}
              <div className="absolute inset-0 translate-x-4 translate-y-4 bg-foreground" />

              {/* Card Body */}
              <div className="relative flex h-full flex-col justify-between border-4 border-foreground bg-background-editorial p-6">
                {/* Hole Punch */}
                <div className="absolute left-1/2 top-[-20px] z-20 flex h-8 w-6 -translate-x-1/2 items-center justify-center rounded-b-full border-x-4 border-b-4 border-foreground bg-background-editorial">
                  <div className="mb-2 h-2 w-2 rounded-full bg-foreground" />
                </div>

                {/* Card Header */}
                <div className="mt-6 border-b-4 border-foreground pb-4 text-center">
                  <h3 className="font-serif text-4xl font-black uppercase tracking-tighter">
                    Press Pass
                  </h3>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em]">
                    Authorized Creator
                  </p>
                </div>

                {/* Central Graphic */}
                <div className="flex flex-1 items-center justify-center py-4">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-foreground/20 opacity-20 animate-ping scale-[2.2]" />
                    <Image
                      src="/select_a_channel.webp"
                      alt="Select channels illustration"
                      width={150}
                      height={150}
                      className="object-contain pointer-events-none select-none"
                    />
                  </div>
                </div>

                {/* Card Details */}
                <div className="space-y-3 border-t-4 border-foreground pt-4 font-mono text-xs uppercase">
                  <div className="flex justify-between">
                    <span className="text-foreground/50">Access Level</span>
                    <span className="font-bold">Editorial</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/50">Status</span>
                    <span className="border border-foreground bg-brand-primary px-2 py-0.5 text-[10px] font-bold text-brand-primary-foreground shadow-[2px_2px_0_0_black]">
                      Waitlist
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/50">Valid Until</span>
                    <span className="font-bold">Launch Day</span>
                  </div>
                </div>

                {/* --- TYPOGRAPHIC BARCODE ANIMATION --- */}
                <div className="mt-5 flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-foreground/60">
                    <span>System Check</span>
                    <span className="font-bold text-foreground">
                      <Counter from={0} to={70} />%
                    </span>
                  </div>

                  <div className="relative flex w-full items-center justify-center overflow-hidden">
                    {/* The Barcode Container */}
                    <div className="flex w-full gap-px items-end h-6">
                      {BARCODE_PATTERN.map((bar, index) => {
                        // Calculate if this specific bar is within the 70% threshold
                        const totalBars = BARCODE_PATTERN.length;
                        const threshold = Math.floor(totalBars * 0.7);
                        const isActive = index <= threshold;
                        const isLastActiveBar = index === threshold;

                        // Calculate delay to spread animation evenly over 2 seconds
                        const barDelay = (index / threshold) * ANIMATION_DURATION;

                        return (
                          <motion.div
                            key={index}
                            initial={{
                              backgroundColor: "var(--foreground)",
                              opacity: 0.2,
                              boxShadow: "none",
                            }}
                            animate={
                              isActive
                                ? isLastActiveBar
                                  ? {
                                      opacity: [1, 0.4, 1],
                                      backgroundColor: "var(--brand-primary)",
                                      boxShadow: [
                                        "0px 0px 6px rgb(36 99 57 / 0.4)",
                                        "0px 0px 12px rgb(36 99 57 / 0.8)",
                                        "0px 0px 6px rgb(36 99 57 / 0.4)",
                                      ],
                                    }
                                  : {
                                      opacity: 1,
                                      backgroundColor: "var(--brand-primary)",
                                      boxShadow: "0px 0px 6px rgb(36 99 57 / 0.4)",
                                    }
                                : {}
                            }
                            transition={
                              isLastActiveBar
                                ? {
                                    duration: 0.1,
                                    delay: (barDelay / 1000) + 0.5,
                                    opacity: {
                                      duration: 1,
                                      repeat: Infinity,
                                      ease: "easeInOut",
                                      delay: (barDelay / 1000) + 0.5 + 0.3, // Start pulsing after initial animation
                                    },
                                    boxShadow: {
                                      duration: 1,
                                      repeat: Infinity,
                                      ease: "easeInOut",
                                      delay: (barDelay / 1000) + 0.5 + 0.3,
                                    },
                                  }
                                : {
                                    duration: 0.1,
                                    delay: (barDelay / 1000) + 0.5,
                                  }
                            }
                            style={{
                              width: `${bar.width}px`,
                              height: "100%",
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
                {/* --- END BARCODE --- */}
              </div>
            </div>

            {/* Decorative Red Tape */}
            <div className="absolute -top-6 -right-6 z-20 flex h-12 w-40 rotate-12 items-center justify-center border-2 border-foreground/20 bg-[#9b2c2c] shadow-sm">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-white opacity-90">
                Confidential
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Helper for the number counter
function Counter({ from, to }: { from: number; to: number }) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    // Sync duration roughly with the barcode staggered animation
    // 25 chars * 0.08 delay = 2 seconds approx
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    const increment = (to - from) / steps;

    let current = from;
    const timer = setInterval(() => {
      current += increment;
      if (current >= to) {
        setCount(to);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [from, to]);

  return <>{count}</>;
}
