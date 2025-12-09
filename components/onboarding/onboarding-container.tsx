// components/onboarding/onboarding-container.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { PlanTier } from "@/lib/types/billing";
import { OnboardingHeader } from "./onboarding-header";
import OnboardingRole from "./onboarding-role";
import OnboardingPricing from "./onboarding-pricing";
import OnboardingCheckout from "./onboarding-checkout";
import OnboardingForm from "./onboarding-form";
import OnboardingProvisioning from "./onboarding-provisioning";
import SuccessState from "./success-state";
import { useTimezone } from "@/lib/hooks/use-timezone";

type OnboardingState =
  | "role"
  | "pricing"
  | "checkout"
  | "form"
  | "provisioning"
  | "success";

export default function OnboardingContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Billing state
  const [selectedRole, setSelectedRole] = useState<PlanTier | null>(null);

  // Form data
  const [organizationName, setOrganizationName] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");

  // Timezone logic handled by hook (auto-detects browser time)
  const { timezone, setTimezone } = useTimezone();

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

  const handleProvisioningComplete = (workspaceId: string, workspaceSlug: string) => {
    // Store workspace data for the /onboarding/connect page
    localStorage.setItem(
      "onboarding_workspace_data",
      JSON.stringify({
        id: workspaceId,
        slug: workspaceSlug,
      })
    );
    localStorage.removeItem("onboarding_data");

    // Redirect to the connect page (social accounts)
    router.push("/onboarding/connect");
  };

  const handleSelectRole = (role: PlanTier) => {
    setSelectedRole(role);
    setState("form");
  };

  const handleFormComplete = () => {
    // Validate form data before proceeding
    if (organizationName.trim().length < 3) {
      setError("Organization name must be at least 3 characters");
      return;
    }
    if (workspaceName.trim().length < 3) {
      setError("Workspace name must be at least 3 characters");
      return;
    }
    if (!timezone) {
      setError("Please select a timezone");
      return;
    }

    setError(null);
    setState("pricing");
  };

  const handleBackToForm = () => setState("form");
  const handleBackToRole = () => setState("role");

  const handlePaymentVerified = () => {
    // Payment verified - webhook will handle provisioning
    // Start polling for completion
    setState("provisioning");
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
    case "form":
      stepNumber = 2;
      stepName = "Workspace Setup";
      showBack = true;
      onBackAction = handleBackToRole;
      break;
    case "pricing":
      stepNumber = 3;
      stepName = "Subscription";
      showBack = true;
      onBackAction = handleBackToForm;
      break;
    case "checkout":
      stepNumber = 3;
      stepName = "Verification";
      break;
    case "provisioning":
      stepNumber = 4;
      stepName = "Building Workspace";
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
            state === "provisioning" || state === "success"
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
              onSubmit={(e) => {
                e.preventDefault();
                handleFormComplete();
              }}
            />
          )}

          {state === "pricing" && selectedRole && (
            <OnboardingPricing
              selectedRole={selectedRole}
              organizationName={organizationName}
              workspaceName={workspaceName}
              timezone={timezone}
              onBack={handleBackToForm}
            />
          )}

          {state === "checkout" && searchParams?.get("session_id") && (
            <OnboardingCheckout
              sessionId={searchParams.get("session_id")!}
              onVerified={handlePaymentVerified}
              onError={handlePaymentError}
            />
          )}

          {state === "provisioning" && (
            <OnboardingProvisioning onComplete={handleProvisioningComplete} />
          )}

          {state === "success" && <SuccessState />}
        </div>
      </main>
    </div>
  );
}
