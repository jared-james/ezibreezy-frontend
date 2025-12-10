// components/landing-page/landing-page-pricing.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PRICING_PLANS } from "@/lib/constants/pricing";
import type { BillingCycle } from "@/lib/types/billing";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingPagePricing() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  const plans = Object.values(PRICING_PLANS).map((plan) => {
    if (plan.tier === "creator") {
      return {
        ...plan,
        description: "For solo creators and business owners building a legacy.",
      };
    }
    return plan;
  });

  return (
    <section className="relative w-full bg-background-editorial text-foreground border-t border-foreground overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-24">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 pb-8 border-b-4 border-double border-foreground/20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-brand-primary" />
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-brand-primary">
                The Financial Ledger
              </p>
            </div>
            <h2 className="font-serif text-5xl md:text-6xl font-medium leading-[0.9] tracking-tight">
              A modest investment in <br />
              <span className="italic">your own sovereignty.</span>
            </h2>
          </div>

          {/* MECHANICAL TOGGLE - DOTTED BORDER */}
          <div className="flex flex-col items-end gap-2">
            <p className="font-mono text-[10px] uppercase tracking-widest opacity-60">
              Billing Frequency
            </p>
            <div className="flex border-2 border-dotted border-foreground/40 bg-background-editorial p-1 gap-1">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={cn(
                  "px-6 py-2 font-mono text-xs uppercase tracking-widest transition-all",
                  billingCycle === "monthly"
                    ? "bg-foreground text-background font-bold"
                    : "hover:bg-foreground/5 text-foreground/60"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={cn(
                  "relative px-6 py-2 font-mono text-xs uppercase tracking-widest transition-all",
                  billingCycle === "yearly"
                    ? "bg-foreground text-background font-bold"
                    : "hover:bg-foreground/5 text-foreground/60"
                )}
              >
                Yearly
                {/* SAVINGS BADGE */}
                <span className="absolute -top-3 -right-2 bg-brand-primary text-white text-[9px] px-1.5 py-0.5 font-bold z-10">
                  -17%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* PRICING GRID - "The Newspaper Columns" */}
        <div className="grid grid-cols-1 lg:grid-cols-3 border-2 border-foreground bg-background-editorial shadow-sm">
          {plans.map((plan, index) => {
            const price =
              billingCycle === "monthly"
                ? plan.monthlyPrice
                : Math.round(plan.yearlyPrice / 12);

            return (
              <div
                key={plan.tier}
                className={cn(
                  "relative flex flex-col p-8 md:p-10 transition-colors duration-300",
                  // Borders logic to create grid lines
                  index !== plans.length - 1
                    ? "border-b-2 lg:border-b-0 lg:border-r-2 border-foreground"
                    : ""
                )}
              >
                {/* HEADER */}
                <div className="mb-8">
                  <h3 className="font-serif text-3xl font-bold mb-2">
                    {plan.name}
                  </h3>
                  <p className="font-serif text-sm text-foreground/70 leading-relaxed min-h-[40px]">
                    {plan.description}
                  </p>
                </div>

                {/* PRICE */}
                <div className="mb-8 pb-8 border-b border-dashed border-foreground/30">
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-6xl font-medium tracking-tighter">
                      ${price}
                    </span>
                    <span className="font-mono text-xs text-foreground/50 uppercase tracking-wider">
                      USD / mo
                    </span>
                  </div>
                  <AnimatePresence mode="wait">
                    {billingCycle === "yearly" && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 font-mono text-[10px] text-brand-primary uppercase tracking-wide"
                      >
                        Billed ${plan.yearlyPrice} yearly
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* FEATURES */}
                <div className="flex-1 space-y-4 mb-10">
                  {plan.features.map((feature, i) => {
                    const isInclusiveLine = feature.startsWith("Everything in");
                    return (
                      <div
                        key={i}
                        className={cn(
                          "flex items-start gap-3 text-sm font-serif",
                          isInclusiveLine
                            ? "font-bold text-foreground mt-6 pt-6 border-t border-dashed border-foreground/30"
                            : "text-foreground/80"
                        )}
                      >
                        <div
                          className={cn(
                            "mt-1 flex h-4 w-4 items-center justify-center rounded-full border border-foreground/20",
                            isInclusiveLine
                              ? "bg-foreground text-background border-foreground"
                              : "bg-transparent"
                          )}
                        >
                          <Check className="h-2.5 w-2.5" />
                        </div>
                        <span className="leading-snug">{feature}</span>
                      </div>
                    );
                  })}
                </div>

                {/* CTA BUTTON */}
                <div className="mt-auto">
                  <Link
                    href={`/register?plan=${plan.tier}&cycle=${billingCycle}`}
                    className={cn(
                      "group relative flex w-full items-center justify-center gap-2 overflow-hidden border-2 px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all",
                      // UNIFIED STATE: Outline default
                      "border-foreground bg-transparent text-foreground",
                      // UNIFIED HOVER: Brand Green
                      "hover:bg-brand-primary hover:text-white hover:border-brand-primary"
                    )}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Start Trial <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                  <p className="mt-3 text-center font-mono text-[9px] text-foreground/40 uppercase tracking-widest">
                    7 Days Free • Cancel Anytime
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER NOTE */}
        <div className="mt-12 flex justify-center">
          <div className="flex items-center gap-4 border-t border-foreground pt-4 px-8 opacity-60">
            <span className="font-mono text-[10px] uppercase tracking-widest">
              Secure Payment via Stripe
            </span>
            <span className="h-3 w-px bg-foreground/50" />
            <span className="font-mono text-[10px] uppercase tracking-widest">
              Encrypted Data
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
