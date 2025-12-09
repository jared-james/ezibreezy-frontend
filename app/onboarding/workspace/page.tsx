// app/onboarding/workspace/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OnboardingForm from "@/components/onboarding/onboarding-form";
import { completeOnboarding, syncUser } from "@/app/actions/user";
import { storePaymentSession } from "@/app/actions/billing";
import { useTimezone } from "@/lib/hooks/use-timezone";

type OnboardingState = "form" | "submitting" | "success";

export default function WorkspacePage() {
  const router = useRouter();
  const { timezone, setTimezone } = useTimezone();

  const [organizationName, setOrganizationName] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [state, setState] = useState<OnboardingState>("form");
  const [error, setError] = useState<string | null>(null);

  // Check if user already has a workspace (prevent back navigation)
  useEffect(() => {
    const checkExistingWorkspace = async () => {
      try {
        const result = await syncUser();
        if (result.targetWorkspaceId && result.targetWorkspaceSlug) {
          // User already has a workspace, redirect to connect
          router.replace("/onboarding/connect");
        }
      } catch (error) {
        console.error("Failed to check existing workspace:", error);
      }
    };

    checkExistingWorkspace();
  }, [router]);

  // Store payment session immediately when page loads if sessionId exists
  useEffect(() => {
    const sessionId = localStorage.getItem("onboarding_verified_session");

    if (sessionId) {
      console.log("[WorkspacePage] Found sessionId, storing payment session immediately");

      storePaymentSession(sessionId)
        .then((result) => {
          if (result.success && result.verified) {
            console.log("[WorkspacePage] Payment session stored successfully");
          } else {
            console.warn("[WorkspacePage] Failed to store payment session:", result.error);
          }
        })
        .catch((error) => {
          console.error("[WorkspacePage] Error storing payment session:", error);
        });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("submitting");
    setError(null);

    try {
      const sessionId = localStorage.getItem("onboarding_verified_session");
      const result = await completeOnboarding({
        organizationName,
        workspaceName,
        timezone,
        sessionId: sessionId || undefined,
      });

      if (result.success) {
        // Store workspace data for connect page
        if (result.targetWorkspaceId && result.targetWorkspaceSlug) {
          localStorage.setItem("onboarding_workspace_data", JSON.stringify({
            id: result.targetWorkspaceId,
            slug: result.targetWorkspaceSlug,
          }));
        }

        // Clear onboarding data from localStorage
        localStorage.removeItem("onboarding_role");
        localStorage.removeItem("onboarding_data");
        localStorage.removeItem("onboarding_sessionId");
        localStorage.removeItem("onboarding_verified_session");

        setState("success");
        // Redirect to connect page (replace to prevent back navigation)
        router.replace("/onboarding/connect");
      } else {
        setError(result.error || "Failed to create workspace");
        setState("form");
      }
    } catch (err) {
      console.error("Workspace creation error:", err);
      setError("An unexpected error occurred");
      setState("form");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <OnboardingForm
        organizationName={organizationName}
        setOrganizationName={setOrganizationName}
        workspaceName={workspaceName}
        setWorkspaceName={setWorkspaceName}
        timezone={timezone}
        setTimezone={setTimezone}
        state={state}
        error={error}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
