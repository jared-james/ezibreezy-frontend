// components/onboarding/onboarding-checkout.tsx

"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { verifyCheckoutSession } from "@/app/actions/billing";
import posthog from "posthog-js";

interface OnboardingCheckoutProps {
  sessionId: string;
  onVerified: () => void;
  onError: (error: string) => void;
}

export default function OnboardingCheckout({
  sessionId,
  onVerified,
  onError,
}: OnboardingCheckoutProps) {
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const result = await verifyCheckoutSession(sessionId);

        if (result.success && result.verified) {
          setStatus("success");
          posthog.capture("onboarding_payment_verified", {
            sessionId,
          });

          // Wait a moment to show success state, then proceed to polling
          setTimeout(() => {
            onVerified();
          }, 1500);
        } else {
          setStatus("error");
          const error = result.error || "Payment verification failed";
          setErrorMessage(error);
          posthog.capture("onboarding_payment_failed", {
            error,
          });
          onError(error);
        }
      } catch (err) {
        setStatus("error");
        const error = err instanceof Error ? err.message : "Unknown error";
        setErrorMessage(error);
        posthog.capture("onboarding_payment_failed", {
          error,
        });
        onError(error);
      }
    };

    verifyPayment();
  }, [sessionId, onVerified, onError]);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 min-h-[400px]">
      {status === "verifying" && (
        <>
          <div className="relative">
            <Loader2 className="w-16 h-16 text-brand-primary animate-spin" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Verifying Payment
            </h2>
            <p className="font-serif text-foreground/60">
              Please wait while we confirm your subscription...
            </p>
          </div>
        </>
      )}

      {status === "success" && (
        <>
          <div className="relative">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Payment Confirmed!
            </h2>
            <p className="font-serif text-foreground/60">
              Your trial has started. Setting up your workspace...
            </p>
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <div className="relative">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <div className="text-center space-y-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Verification Failed
            </h2>
            <p className="font-serif text-foreground/60 max-w-md">
              {errorMessage ||
                "We couldn't verify your payment. Please try again or contact support."}
            </p>
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.assign("/onboarding");
                }
              }}
              className="inline-block bg-brand-primary text-white px-6 py-3 font-mono text-xs uppercase tracking-wider hover:bg-brand-primary-hover transition-colors"
            >
              Try Again
            </button>
          </div>
        </>
      )}
    </div>
  );
}
