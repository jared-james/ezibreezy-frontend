// components/landing-page/landing-page-pricing.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { PRICING_PLANS } from "@/lib/constants/pricing";
import type { BillingCycle } from "@/lib/types/billing";
import { cn } from "@/lib/utils";

export default function LandingPagePricing() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  // Override description for creator tier if needed, otherwise use constant
  const plans = Object.values(PRICING_PLANS).map((plan) => {
    if (plan.tier === "creator") {
      return {
        ...plan,
        description:
          "For solo creators and business owners building their brand.",
      };
    }
    return plan;
  });

  return (
    <section className="w-full py-24 bg-background border-t border-black/5">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16 space-y-6">
          <h2 className="font-serif text-4xl md:text-5xl text-foreground font-light leading-tight">
            Simple, transparent{" "}
            <span className="italic font-bold">pricing</span>.
          </h2>
          <p className="font-serif text-lg text-muted-foreground max-w-xl mx-auto">
            Start with a 7-day free trial. No credit card required for sign up.
            Cancel anytime.
          </p>

          {/* Billing Cycle Switch */}
          <div className="flex items-center p-1 bg-surface border border-black/10 rounded-sm shadow-sm mt-4">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "w-28 py-2.5 font-mono text-[11px] uppercase tracking-widest transition-all rounded-[2px]",
                billingCycle === "monthly"
                  ? "bg-foreground text-background font-bold shadow-sm"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={cn(
                "w-28 py-2.5 font-mono text-[11px] uppercase tracking-widest transition-all rounded-[2px] relative",
                billingCycle === "yearly"
                  ? "bg-foreground text-background font-bold shadow-sm"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Yearly
              <span
                className={cn(
                  "absolute -top-3 -right-3 text-[9px] px-1.5 py-0.5 border bg-brand-primary text-white border-brand-primary/50 shadow-sm transition-opacity duration-300",
                  billingCycle === "yearly" ? "opacity-100" : "opacity-80"
                )}
              >
                SAVE 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const isRecommended = plan.tier === "creator";
            const price =
              billingCycle === "monthly"
                ? plan.monthlyPrice
                : Math.round(plan.yearlyPrice / 12);

            return (
              <div
                key={plan.tier}
                className={cn(
                  "relative flex flex-col text-left transition-all duration-300 group",
                  "bg-surface border-2",
                  isRecommended
                    ? "border-brand-primary shadow-xl z-10 scale-[1.02] md:-translate-y-2"
                    : "border-dashed border-black/10 hover:border-black/20 hover:shadow-lg"
                )}
              >
                {/* Recommended Label */}
                {isRecommended && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-primary text-white px-4 py-1.5 border border-brand-primary shadow-md">
                    <span className="font-mono text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5">
                      <Star className="w-3 h-3 fill-current" /> Most Popular
                    </span>
                  </div>
                )}

                {/* Card Header */}
                <div className="p-8 pb-6">
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                    {plan.name}
                  </h3>
                  <p className="font-serif text-sm text-muted-foreground min-h-[40px] leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Price Section */}
                <div className="px-8 py-6 border-t border-b border-dashed border-black/10 bg-black/[0.02]">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-5xl font-bold text-foreground tabular-nums">
                      ${price}
                    </span>
                    <div className="flex flex-col leading-none justify-center">
                      <span className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        USD / Month
                      </span>
                      <span
                        className={cn(
                          "font-mono text-[9px] text-muted-foreground/60 uppercase tracking-wide pt-1 transition-opacity duration-200",
                          billingCycle === "yearly"
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      >
                        Billed Annually
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="p-8 space-y-4 flex-1">
                  {plan.features.map((feature, i) => {
                    // Logic to detect the "Everything in X" line
                    const isInclusiveLine = feature.startsWith("Everything in");

                    return (
                      <div
                        key={i}
                        className={cn(
                          "flex items-start gap-3",
                          // Add a little bottom spacing after the inclusive line to separate it from new features
                          isInclusiveLine && "mb-2"
                        )}
                      >
                        <div
                          className={cn(
                            "mt-1.5 p-0.5 rounded-full shrink-0",
                            isInclusiveLine
                              ? "bg-transparent text-foreground p-0 mt-1"
                              : "bg-brand-primary/10 text-brand-primary"
                          )}
                        >
                          <Check
                            className={cn(
                              "w-2.5 h-2.5",
                              isInclusiveLine && "w-3.5 h-3.5 stroke-[3px]"
                            )}
                          />
                        </div>
                        <span
                          className={cn(
                            "font-serif text-sm leading-snug",
                            isInclusiveLine
                              ? "font-bold text-foreground"
                              : "text-foreground/90"
                          )}
                        >
                          {feature}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Action Button Area - Moved to bottom (mt-auto) and removed Users/Workspace grid */}
                <div className="p-5 border-t border-black/10 bg-white mt-auto">
                  <Link
                    href={`/register?plan=${plan.tier}&cycle=${billingCycle}`}
                    className={cn(
                      "w-full flex items-center justify-between px-6 py-4 transition-all duration-200 border border-transparent rounded-sm group/btn shadow-sm",
                      isRecommended
                        ? "bg-brand-primary text-white hover:bg-brand-primary-hover shadow-brand-primary/20"
                        : "bg-foreground text-background hover:bg-foreground/90"
                    )}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-mono text-xs uppercase tracking-[0.15em] font-bold">
                        Start 7 day free trial
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                  <div className="text-center mt-3">
                    <p className="font-serif text-[10px] text-muted-foreground/80 italic">
                      No credit card required.
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Text */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 border border-black/5">
            <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              Secure payment via Stripe
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
