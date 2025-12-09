// app/onboarding/page.tsx

import { Suspense } from "react";
import OnboardingContainer from "@/components/onboarding/onboarding-container";

// The container needs to be wrapped in Suspense because it uses useSearchParams
function OnboardingContent() {
  return <OnboardingContainer />;
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-background-editorial">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
            <p className="mt-4 font-serif text-foreground/60">Loading...</p>
          </div>
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
