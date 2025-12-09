"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { redirect } from "next/navigation";
import OnboardingCheckout from "@/components/onboarding/onboarding-checkout";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id");

  // No session ID → redirect back to pricing
  if (!sessionId) {
    redirect("/onboarding/pricing");
  }

  const handleVerified = (verifiedSessionId: string) => {
    // Cache verification in localStorage
    localStorage.setItem("onboarding_verified_session", verifiedSessionId);
    // Redirect to workspace creation
    router.push("/onboarding/workspace");
  };

  const handleError = (error: string) => {
    console.error("Verification failed:", error);
    // Error is shown in the checkout component
    // User can retry or go back to pricing
  };

  return (
    <div className="animate-in fade-in duration-700 ease-out">
      <OnboardingCheckout
        sessionId={sessionId}
        onVerified={handleVerified}
        onError={handleError}
      />
    </div>
  );
}
