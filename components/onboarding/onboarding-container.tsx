// components/onboarding/onboarding-container.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { completeOnboarding } from "@/app/actions/user";
import type { PlanTier } from "@/lib/types/billing";
import { OnboardingHeader } from "./onboarding-header";
import OnboardingRole from "./onboarding-role";
import OnboardingPricing from "./onboarding-pricing";
import OnboardingCheckout from "./onboarding-checkout";
import OnboardingForm from "./onboarding-form";
import OnboardingConnect from "./onboarding-connect";
import SubmittingState from "./submitting-state";
import SuccessState from "./success-state";
import { useTimezone } from "@/lib/hooks/use-timezone";

type OnboardingState =
  | "role"
  | "pricing"
  | "checkout"
  | "form"
  | "submitting"
  | "connect"
  | "success";

export default function OnboardingContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Billing state
  const [selectedRole, setSelectedRole] = useState<PlanTier | null>(null);
  const [verifiedSessionId, setVerifiedSessionId] = useState<string | null>(
    null
  );

  // Form data
  const [organizationName, setOrganizationName] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");

  // Timezone logic handled by hook (auto-detects browser time)
  const { timezone, setTimezone } = useTimezone();

  const [createdWorkspace, setCreatedWorkspace] = useState<{
    id: string;
    slug: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize state based on URL params
  const [state, setState] = useState<OnboardingState>(() => {
    const sessionId = searchParams?.get("session_id");
    const canceled = searchParams?.get("canceled");
    if (sessionId) return "checkout";
    if (canceled) return "pricing";
    return "role";
  });

  useEffect(() => {
    // Restore saved state from local storage if available
    const savedData = localStorage.getItem("onboarding_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.role) setSelectedRole(parsed.role);
      } catch (err) {
        console.error("Failed to parse onboarding data:", err);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setState("submitting");

    if (organizationName.trim().length < 3) {
      setError("Organization name must be at least 3 characters");
      setState("form");
      return;
    }
    if (workspaceName.trim().length < 3) {
      setError("Workspace name must be at least 3 characters");
      setState("form");
      return;
    }
    if (!timezone) {
      setError("Please select a timezone");
      setState("form");
      return;
    }

    posthog.capture("onboarding_attempt", {
      organizationName,
      workspaceName,
      timezone,
    });

    try {
      const result = await completeOnboarding({
        organizationName: organizationName.trim(),
        workspaceName: workspaceName.trim(),
        timezone,
        sessionId: verifiedSessionId || undefined,
      });

      if (!result.success) {
        setError(result.error || "Failed to complete onboarding");
        setState("form");
        return;
      }

      setCreatedWorkspace({
        id: result.targetWorkspaceId,
        slug: result.targetWorkspaceSlug || result.targetWorkspaceId,
      });
      localStorage.removeItem("onboarding_data");

      setTimeout(() => setState("connect"), 1500);
    } catch (err) {
      setError("An unexpected error occurred");
      setState("form");
    }
  };

  const handleSkipConnection = () => {
    if (!createdWorkspace) return;
    setState("success");
    setTimeout(() => {
      router.push(`/${createdWorkspace.slug}/editorial`);
    }, 1500);
  };

  const handleSelectRole = (role: PlanTier) => {
    setSelectedRole(role);
    setState("pricing");
  };

  const handleBackToPricing = () => setState("role");
  const handleBackToRole = () => setState("role"); // For header usage

  const handlePaymentVerified = (sessionId: string) => {
    setVerifiedSessionId(sessionId);
    setState("form");
  };

  const handlePaymentError = (errorMsg: string) => setError(errorMsg);

  // --- DERIVE HEADER PROPS ---
  let stepNumber = 1;
  const totalSteps = 4;
  let stepName = "Identification";
  let showBack = false;
  let onBackAction = undefined;

  switch (state) {
    case "role":
      stepNumber = 1;
      stepName = "Identification";
      showBack = false;
      break;
    case "pricing":
      stepNumber = 2;
      stepName = "Subscription";
      showBack = true;
      onBackAction = handleBackToRole;
      break;
    case "checkout":
      stepNumber = 2;
      stepName = "Verification";
      break;
    case "form":
      stepNumber = 3;
      stepName = "Workspace Setup";
      break;
    case "submitting":
      stepNumber = 3;
      stepName = "Provisioning";
      break;
    case "connect":
      stepNumber = 4;
      stepName = "Integration";
      break;
    case "success":
      stepNumber = 4;
      stepName = "Complete";
      break;
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-foreground selection:bg-brand-accent/20">
      <OnboardingHeader
        currentStep={stepNumber}
        totalSteps={totalSteps}
        stepName={stepName}
        onBack={showBack ? onBackAction : undefined}
      />

      <main className="w-full max-w-5xl mx-auto px-4 md:px-0 pb-20">
        <div
          key={state}
          className={
            state === "connect" || state === "success"
              ? "animate-in fade-in duration-700 ease-out"
              : "animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out"
          }
        >
          {state === "role" && (
            <OnboardingRole
              selectedRole={selectedRole}
              onSelectRole={handleSelectRole}
            />
          )}

          {state === "pricing" && selectedRole && (
            <OnboardingPricing
              selectedRole={selectedRole}
              onBack={handleBackToRole}
            />
          )}

          {state === "checkout" && searchParams?.get("session_id") && (
            <OnboardingCheckout
              sessionId={searchParams.get("session_id")!}
              onVerified={handlePaymentVerified}
              onError={handlePaymentError}
            />
          )}

          {state === "form" && (
            <OnboardingForm
              organizationName={organizationName}
              setOrganizationName={setOrganizationName}
              workspaceName={workspaceName}
              setWorkspaceName={setWorkspaceName}
              timezone={timezone}
              setTimezone={setTimezone}
              state="form"
              error={error}
              onSubmit={handleSubmit}
            />
          )}

          {state === "submitting" && <SubmittingState />}

          {state === "connect" && createdWorkspace && (
            <OnboardingConnect
              workspaceId={createdWorkspace.id}
              workspaceSlug={createdWorkspace.slug}
              onSkip={handleSkipConnection}
            />
          )}

          {state === "success" && <SuccessState />}
        </div>
      </main>
    </div>
  );
}
