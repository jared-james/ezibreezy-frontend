// components/onboarding/onboarding-container.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { completeOnboarding } from "@/app/actions/user";
import { cn } from "@/lib/utils";
import OnboardingBranding from "./onboarding-branding";
import OnboardingForm from "./onboarding-form";
import OnboardingConnect from "./onboarding-connect";
import SubmittingState from "./submitting-state";
import SuccessState from "./success-state";

type OnboardingState = "form" | "submitting" | "connect" | "success";

const TIMEZONE_OPTIONS = [
  { value: "UTC", label: "UTC (Universal Time)" },
  { value: "America/New_York", label: "Eastern Time (US & Canada)" },
  { value: "America/Chicago", label: "Central Time (US & Canada)" },
  { value: "America/Denver", label: "Mountain Time (US & Canada)" },
  { value: "America/Los_Angeles", label: "Pacific Time (US & Canada)" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Paris", label: "Paris" },
  { value: "Europe/Berlin", label: "Berlin" },
  { value: "Asia/Tokyo", label: "Tokyo" },
  { value: "Asia/Shanghai", label: "Shanghai" },
  { value: "Asia/Singapore", label: "Singapore" },
  { value: "Australia/Sydney", label: "Sydney" },
  { value: "Pacific/Auckland", label: "Auckland" },
];

export default function OnboardingContainer() {
  const router = useRouter();
  const [state, setState] = useState<OnboardingState>("form");
  const [error, setError] = useState<string | null>(null);

  // Form data
  const [organizationName, setOrganizationName] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [timezone, setTimezone] = useState("");

  const [createdWorkspace, setCreatedWorkspace] = useState<{
    id: string;
    slug: string;
  } | null>(null);

  // Auto-detect timezone on mount
  useState(() => {
    try {
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (TIMEZONE_OPTIONS.some((opt) => opt.value === detectedTimezone)) {
        setTimezone(detectedTimezone);
      } else {
        setTimezone("UTC");
      }
    } catch {
      setTimezone("UTC");
    }
  });

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
      });

      if (!result.success) {
        setError(result.error || "Failed to complete onboarding");
        setState("form");
        posthog.capture("onboarding_failed", {
          error: result.error,
        });
        return;
      }

      posthog.capture("onboarding_workspace_created", {
        organizationName,
        workspaceName,
        timezone,
      });

      const targetSlug = result.targetWorkspaceSlug || result.targetWorkspaceId;
      setCreatedWorkspace({
        id: result.targetWorkspaceId,
        slug: targetSlug,
      });

      // Transition to Connect step
      setTimeout(() => {
        setState("connect");
      }, 1500);
    } catch (err) {
      setError("An unexpected error occurred");
      setState("form");
      posthog.capture("onboarding_error", {
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  const handleSkipConnection = () => {
    if (!createdWorkspace) return;

    posthog.capture("onboarding_connection_skipped");
    setState("success");

    // Redirect to dashboard
    setTimeout(() => {
      router.push(`/${createdWorkspace.slug}/dashboard`);
    }, 1500);
  };

  const isExpandedMode = state === "connect" || state === "success";

  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground transition-colors duration-500">
      <main className="grow flex items-center justify-center py-8 md:py-16 px-4 relative">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="w-full max-w-6xl relative z-10">
          <div className="bg-surface border border-foreground shadow-2xl relative overflow-hidden transition-all duration-500 rounded-sm">
            {/* Increased min-height to 700px to prevent crunching */}
            <div className="flex flex-col md:flex-row min-h-[700px] w-full relative">
              {/* LEFT COLUMN */}
              <div
                className={cn(
                  "relative border-b md:border-b-0 md:border-r border-dashed border-foreground/30 bg-surface overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]",
                  isExpandedMode
                    ? "md:w-0 md:opacity-0 md:border-r-0 h-0 md:h-auto py-0"
                    : "w-full md:w-1/2 opacity-100"
                )}
              >
                <div className="absolute inset-0 w-full h-full min-w-[500px]">
                  <OnboardingBranding organizationName={organizationName} />
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div
                className={cn(
                  "relative bg-surface-hover/30 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]",
                  // Only center vertically if NOT expanded (form state).
                  // If expanded, align to top (via default flex-start) and add padding top.
                  !isExpandedMode && "justify-center",
                  isExpandedMode
                    ? "w-full md:w-full p-6 md:p-10 pt-12 md:pt-16"
                    : "w-full md:w-1/2 p-8 md:p-12"
                )}
              >
                <div
                  className={cn(
                    "w-full mx-auto relative min-h-[400px] flex flex-col transition-all duration-700",
                    !isExpandedMode && "justify-center", // Also un-center the inner wrapper
                    isExpandedMode ? "max-w-4xl h-full" : "max-w-sm"
                  )}
                >
                  {/* --- STATE 1: FORM --- */}
                  <div
                    className={cn(
                      "transition-all duration-500 absolute inset-0 flex flex-col justify-center",
                      state === "form"
                        ? "opacity-100 translate-x-0 pointer-events-auto"
                        : "opacity-0 -translate-x-8 pointer-events-none"
                    )}
                  >
                    <OnboardingForm
                      organizationName={organizationName}
                      setOrganizationName={setOrganizationName}
                      workspaceName={workspaceName}
                      setWorkspaceName={setWorkspaceName}
                      timezone={timezone}
                      setTimezone={setTimezone}
                      state={
                        state === "form" || state === "submitting"
                          ? state
                          : "form"
                      }
                      error={error}
                      onSubmit={handleSubmit}
                      timezoneOptions={TIMEZONE_OPTIONS}
                    />
                  </div>

                  {/* --- STATE 2: SUBMITTING --- */}
                  <div
                    className={cn(
                      "transition-all duration-500 absolute inset-0 flex flex-col items-center justify-center text-center space-y-6",
                      state === "submitting"
                        ? "opacity-100 translate-x-0 transform scale-100"
                        : "opacity-0 translate-y-4 transform scale-95 pointer-events-none"
                    )}
                  >
                    <SubmittingState />
                  </div>

                  {/* --- STATE 3: CONNECT --- */}
                  <div
                    className={cn(
                      "transition-all duration-700 delay-200 absolute inset-0 flex flex-col",
                      state === "connect"
                        ? "opacity-100 translate-x-0 transform scale-100 pointer-events-auto"
                        : state === "success"
                        ? "opacity-0 -translate-x-8 transform scale-95 pointer-events-none"
                        : "opacity-0 translate-x-8 transform scale-95 pointer-events-none"
                    )}
                  >
                    {createdWorkspace && (
                      <OnboardingConnect
                        workspaceId={createdWorkspace.id}
                        workspaceSlug={createdWorkspace.slug}
                        onSkip={handleSkipConnection}
                      />
                    )}
                  </div>

                  {/* --- STATE 4: SUCCESS --- */}
                  <div
                    className={cn(
                      "transition-all duration-700 delay-100 absolute inset-0 flex flex-col items-center justify-center text-center space-y-6",
                      state === "success"
                        ? "opacity-100 translate-x-0 transform scale-100"
                        : "opacity-0 translate-x-8 transform scale-95 pointer-events-none"
                    )}
                  >
                    <SuccessState />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
