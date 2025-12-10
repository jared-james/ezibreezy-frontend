// components/onboarding/onboarding-pricing.tsx

"use client";

import { useState } from "react";
import { Loader2, ArrowRight, Check, ShieldCheck } from "lucide-react";
import type { PlanTier, BillingCycle } from "@/lib/types/billing";
import { PRICING_PLANS } from "@/lib/constants/pricing";
import { createOnboardingCheckout } from "@/app/actions/billing";
import posthog from "posthog-js";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingPricingProps {
  selectedRole: PlanTier;
  organizationName: string;
  workspaceName: string;
  timezone: string;
  onBack: () => void;
}

export default function OnboardingPricing({
  selectedRole,
  organizationName,
  workspaceName,
  timezone,
}: OnboardingPricingProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [loadingTier, setLoadingTier] = useState<PlanTier | null>(null);
  const [error, setError] = useState<string | null>(null);

  const plans = Object.values(PRICING_PLANS).map((plan) => {
    if (plan.tier === "creator") {
      return {
        ...plan,
        description: "For solo creators and business owners.",
      };
    }
    return plan;
  });

  const handleSelectPlan = async (tier: PlanTier) => {
    setLoadingTier(tier);
    setError(null);

    const plan = PRICING_PLANS[tier];
    const priceId =
      billingCycle === "monthly" ? plan.monthlyPriceId : plan.yearlyPriceId;

    posthog.capture("onboarding_checkout_initiated", {
      role: tier,
      cycle: billingCycle,
      priceId,
      organizationName,
      workspaceName,
    });

    const result = await createOnboardingCheckout({
      priceId,
      role: tier,
      organizationName,
      workspaceName,
      timezone,
    });

    if (result.success && result.url) {
      localStorage.setItem(
        "onboarding_data",
        JSON.stringify({
          role: tier,
          billingCycle,
          selectedPriceId: priceId,
          sessionId: result.sessionId,
        })
      );
      if (typeof window !== "undefined") {
        window.location.assign(result.url);
      }
    } else {
      setError(result.error || "Failed to create checkout session");
      setLoadingTier(null);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      {/* HEADER SECTION: Title & Toggle Only */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
        <div className="max-w-xl">
          <h1 className="font-serif text-4xl md:text-5xl font-light leading-[1.1] text-foreground">
            Select your <span className="italic font-bold">plan.</span>
          </h1>
          <p className="font-serif text-lg text-muted-foreground mt-4">
            Your 7-day free trial is ready. No charge today.
          </p>
        </div>

        {/* MECHANICAL TOGGLE */}
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
                -20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-8 p-4 border-l-4 border-red-500 bg-red-50 text-red-700 animate-in fade-in">
          <p className="font-serif text-sm font-medium">{error}</p>
        </div>
      )}

      {/* PRICING GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          // If the user selected a role in the previous step, highlight it, otherwise standard logic
          // (Assuming we want to highlight the plan matching selectedRole)
          const isRecommended = plan.tier === selectedRole;
          const price =
            billingCycle === "monthly"
              ? plan.monthlyPrice
              : Math.round(plan.yearlyPrice / 12);

          return (
            <div
              key={plan.tier}
              className={cn(
                "relative flex flex-col p-8 transition-all duration-300 bg-surface",
                // Borders
                "border-2",
                isRecommended
                  ? "border-brand-primary bg-brand-primary/[0.03] shadow-md z-10"
                  : "border-dashed border-foreground/20 hover:border-brand-primary/30"
              )}
            >
              {/* RECOMMENDED BADGE */}
              {isRecommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-brand-primary text-white px-3 py-1 font-mono text-[9px] uppercase tracking-widest font-bold shadow-sm">
                    Recommended
                  </span>
                </div>
              )}

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
              <div className="flex-1 space-y-4 mb-12">
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
                          "mt-1 flex h-4 w-4 items-center justify-center rounded-full border border-foreground/20 shrink-0",
                          isInclusiveLine
                            ? "bg-brand-primary text-white border-brand-primary"
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
                <button
                  onClick={() => handleSelectPlan(plan.tier)}
                  disabled={loadingTier !== null}
                  className={cn(
                    "group relative flex w-full items-center justify-center gap-2 overflow-hidden border-2 px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all",
                    // Outline default, Green Hover
                    "border-foreground bg-transparent text-foreground",
                    "hover:bg-brand-primary hover:text-white hover:border-brand-primary",
                    // Disabled state
                    loadingTier !== null && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {loadingTier === plan.tier ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Processing
                      </>
                    ) : (
                      <>
                        Start Trial <ArrowRight className="h-3 w-3" />
                      </>
                    )}
                  </span>
                </button>
                <p className="mt-3 text-center font-mono text-[9px] text-foreground/40 uppercase tracking-widest">
                  Then ${price}/mo • Cancel Anytime
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER NOTE */}
      <div className="mt-12 flex justify-center">
        <div className="flex items-center gap-4 border-t border-foreground pt-4 px-8 opacity-60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3 h-3" />
            <span className="font-mono text-[10px] uppercase tracking-widest">
              Secure Stripe Payment
            </span>
          </div>
          <span className="h-3 w-px bg-foreground/50" />
          <span className="font-mono text-[10px] uppercase tracking-widest">
            No Commitment
          </span>
        </div>
      </div>
    </div>
  );
}
