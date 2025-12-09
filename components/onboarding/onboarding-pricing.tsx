// components/onboarding/onboarding-pricing.tsx

"use client";

import { useState } from "react";
import { Loader2, Star, ArrowRight, ShieldCheck } from "lucide-react";
import type { PlanTier, BillingCycle } from "@/lib/types/billing";
import { PRICING_PLANS } from "@/lib/constants/pricing";
import { createOnboardingCheckout } from "@/app/actions/billing";
import posthog from "posthog-js";
import { cn } from "@/lib/utils";

interface OnboardingPricingProps {
  selectedRole: PlanTier;
  onBack: () => void;
}

export default function OnboardingPricing({
  selectedRole,
}: OnboardingPricingProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Override description for creator tier
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

  const handleSelectPlan = async (tier: PlanTier) => {
    setIsLoading(true);
    setError(null);

    const plan = PRICING_PLANS[tier];
    const priceId =
      billingCycle === "monthly" ? plan.monthlyPriceId : plan.yearlyPriceId;

    posthog.capture("onboarding_checkout_initiated", {
      role: tier,
      cycle: billingCycle,
      priceId,
    });

    const result = await createOnboardingCheckout({
      priceId,
      role: tier,
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
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-2">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-black/5 pb-6">
        <div className="text-left">
          <h1 className="font-serif text-3xl md:text-4xl text-foreground font-light leading-tight">
            Select your <span className="italic font-bold">tariff</span>.
          </h1>
          <p className="font-serif text-base text-muted-foreground mt-2 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Your 14-day free trial is ready. No charge today.
          </p>
        </div>

        {/* Billing Cycle Switch */}
        <div className="flex items-center p-1 bg-surface border border-black/10 rounded-sm self-start md:self-end shadow-sm">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "w-24 py-2 font-mono text-[10px] uppercase tracking-widest transition-all rounded-[2px]",
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
              "w-24 py-2 font-mono text-[10px] uppercase tracking-widest transition-all rounded-[2px] relative",
              billingCycle === "yearly"
                ? "bg-foreground text-background font-bold shadow-sm"
                : "bg-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Yearly
            <span
              className={cn(
                "absolute -top-3 -right-2 text-[9px] px-1.5 py-0.5 border bg-brand-primary text-white border-brand-primary/50 shadow-sm transition-opacity duration-300",
                billingCycle === "yearly" ? "opacity-100" : "opacity-80"
              )}
            >
              SAVE 17%
            </span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-3 border border-red-200 bg-red-50 text-center rounded-sm animate-in fade-in">
          <p className="font-serif text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        {plans.map((plan) => {
          const isRecommended = plan.tier === selectedRole;
          const price =
            billingCycle === "monthly"
              ? plan.monthlyPrice
              : Math.round(plan.yearlyPrice / 12);

          return (
            <div
              key={plan.tier}
              className={cn(
                "relative flex flex-col text-left transition-all duration-300",
                "bg-surface border-2",
                isRecommended
                  ? "border-brand-primary shadow-xl z-10 scale-[1.02]"
                  : "border-dashed border-black/10"
              )}
            >
              {/* Recommended Label */}
              {isRecommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-primary text-white px-4 py-1.5 border border-brand-primary shadow-md">
                  <span className="font-mono text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5">
                    <Star className="w-3 h-3 fill-current" /> Recommneded
                  </span>
                </div>
              )}

              {/* Card Header */}
              <div className="p-6 pb-4">
                <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="font-serif text-sm text-muted-foreground min-h-[40px] leading-relaxed">
                  {plan.description}
                </p>
              </div>

              {/* Price Section */}
              <div className="px-6 py-4 border-t border-b border-dashed border-black/10 bg-black/[0.02]">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-4xl font-bold text-foreground tabular-nums">
                    ${price}
                  </span>
                  <div className="flex flex-col leading-none justify-center">
                    <span className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      / Month
                    </span>
                    {/* Always render this span to preserve height, toggle opacity */}
                    <span
                      className={cn(
                        "font-mono text-[9px] text-muted-foreground/60 uppercase tracking-wide pt-1 transition-opacity duration-200",
                        billingCycle === "yearly" ? "opacity-100" : "opacity-0"
                      )}
                    >
                      Billed Annually
                    </span>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="p-6 space-y-3 flex-1">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1.5 w-1 h-1 rounded-full bg-brand-primary/60 shrink-0" />
                    <span className="font-serif text-sm text-foreground/90 leading-snug">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Limits / Specs Grid */}
              <div className="mt-auto border-t border-dashed border-black/10">
                <div className="grid grid-cols-2 divide-x divide-dashed divide-black/10">
                  <div className="p-2.5 text-center border-b border-dashed border-black/10 hover:bg-black/[0.02] transition-colors">
                    <span className="block font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
                      Users
                    </span>
                    <span className="block font-serif text-base font-bold tabular-nums">
                      {plan.limits.users}
                    </span>
                  </div>
                  <div className="p-2.5 text-center border-b border-dashed border-black/10 hover:bg-black/[0.02] transition-colors">
                    <span className="block font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
                      Workspaces
                    </span>
                    <span className="block font-serif text-base font-bold tabular-nums">
                      {plan.limits.workspaces}
                    </span>
                  </div>
                  <div className="p-2.5 text-center hover:bg-black/[0.02] transition-colors">
                    <span className="block font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
                      Integrations
                    </span>
                    <span className="block font-serif text-base font-bold tabular-nums">
                      {plan.limits.integrations}
                    </span>
                  </div>
                  <div className="p-2.5 text-center hover:bg-black/[0.02] transition-colors">
                    <span className="block font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
                      Storage
                    </span>
                    <span className="block font-serif text-base font-bold tabular-nums">
                      {plan.limits.storage}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button Area */}
              <div className="p-4 border-t border-black/10 bg-white">
                <button
                  onClick={() => handleSelectPlan(plan.tier)}
                  disabled={isLoading}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3.5 transition-all duration-200 border border-transparent rounded-sm group/btn shadow-sm",
                    isRecommended
                      ? "bg-brand-primary text-white hover:bg-brand-primary-hover shadow-brand-primary/20"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  )}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-mono text-xs uppercase tracking-[0.15em] font-bold">
                      {isLoading ? "Processing..." : "Start 14-Day Free Trial"}
                    </span>
                  </div>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  )}
                </button>
                <div className="text-center mt-2.5">
                  <p className="font-serif text-[10px] text-muted-foreground/80 italic">
                    Then ${price}/mo. Cancel anytime.
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Text */}
      <div className="mt-12 text-center border-t border-dashed border-black/10 pt-6 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 border border-black/5">
          <ShieldCheck className="w-3 h-3 text-muted-foreground" />
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            Secure payment via Stripe · No commitment
          </p>
        </div>
      </div>
    </div>
  );
}
