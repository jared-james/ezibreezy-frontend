// app/onboarding/page.tsx

import { Suspense } from "react";
import OnboardingContainer from "@/components/onboarding/onboarding-container";

export default async function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fdfbf7]" />}>
      <OnboardingContainer />
    </Suspense>
  );
}
