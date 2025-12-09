// app/onboarding/pricing/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingPricing from "@/components/onboarding/onboarding-pricing";
import type { PlanTier } from "@/lib/types/billing";

export default function PricingPage() {
  const router = useRouter();

  // Initialize state from localStorage
  const [selectedRole] = useState<PlanTier | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("onboarding_role");
      if (saved) {
        return saved as PlanTier;
      }
      // No role selected, redirect to role selection
      setTimeout(() => router.push("/onboarding/role"), 0);
      return null;
    }
    return null;
  });

  const handleBack = () => {
    router.push("/onboarding/role");
  };

  // Show loading while we restore the role
  if (!selectedRole) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
          <p className="mt-4 font-serif text-foreground/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <OnboardingPricing selectedRole={selectedRole} onBack={handleBack} />
    </div>
  );
}
