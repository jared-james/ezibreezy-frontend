"use client";

import { usePathname } from "next/navigation";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";

const STEP_MAP: Record<string, { number: number; name: string }> = {
  "/onboarding/role": { number: 1, name: "Identification" },
  "/onboarding/pricing": { number: 2, name: "Subscription" },
  "/onboarding/checkout": { number: 2, name: "Verification" },
  "/onboarding/workspace": { number: 3, name: "Workspace Setup" },
  "/onboarding/connect": { number: 4, name: "Integration" },
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const step = STEP_MAP[pathname] || { number: 1, name: "Getting Started" };

  // Don't show layout header for /onboarding root - OnboardingContainer handles it
  const isRootOnboarding = pathname === "/onboarding";

  if (isRootOnboarding) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-foreground selection:bg-brand-accent/20">
      <OnboardingHeader
        currentStep={step.number}
        totalSteps={4}
        stepName={step.name}
      />
      <main className="w-full max-w-5xl mx-auto px-4 md:px-0 pb-20">
        {children}
      </main>
    </div>
  );
}
