// components/landing-page/press-pass-card.tsx

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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

// Calculate total animation duration for barcode
const ANIMATION_DURATION = 2000; // 2 seconds to match counter

export default function PressPassCard() {
  return (
    <div className="relative hidden lg:col-span-5 lg:block">
      <div className="relative mx-auto aspect-4/5 w-full max-w-sm rotate-3 cursor-default transition-transform duration-500 ease-out hover:rotate-0">
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
