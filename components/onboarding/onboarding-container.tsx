// components/onboarding/onboarding-container.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { completeOnboarding } from "@/app/actions/user";
import { cn } from "@/lib/utils";
import Image from "next/image";
import OnboardingBranding from "./onboarding-branding";
import OnboardingForm from "./onboarding-form";
import SubmittingState from "./submitting-state";
import SuccessState from "./success-state";

type OnboardingState = "form" | "submitting" | "success";

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

  // Auto-detect timezone on mount
  useState(() => {
    try {
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (TIMEZONE_OPTIONS.some(opt => opt.value === detectedTimezone)) {
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

    // Validation
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

    // Track onboarding attempt
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

      // Track success
      posthog.capture("onboarding_completed", {
        organizationName,
        workspaceName,
        timezone,
      });

      setState("success");

      // Redirect to workspace dashboard
      const targetSlug = result.targetWorkspaceSlug || result.targetWorkspaceId;
      setTimeout(() => {
        router.push(`/${targetSlug}/dashboard`);
      }, 1500);
    } catch (err) {
      setError("An unexpected error occurred");
      setState("form");
      posthog.capture("onboarding_error", {
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground transition-colors duration-500">
      <main className="grow flex items-center justify-center py-16 px-4 relative">
        {/* Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="w-full max-w-5xl relative z-10">
          <div className="bg-surface border border-foreground shadow-2xl relative overflow-hidden transition-all duration-500">
            <div className="grid md:grid-cols-2 min-h-[600px]">
              {/* LEFT COLUMN: BRANDING */}
              <OnboardingBranding />

              {/* RIGHT COLUMN: FORM */}
              <div className="p-8 md:p-12 flex flex-col relative bg-surface-hover/30 justify-center">
                {/* DECORATIVE STAMP */}
                <div
                  className={cn(
                    "absolute top-8 right-8 pointer-events-none select-none transition-all duration-700",
                    state === "success"
                      ? "scale-125 opacity-100 rotate-12"
                      : "opacity-80 rotate-3"
                  )}
                >
                  <div className="relative w-24 h-28 border-[3px] border-dotted border-foreground/20 bg-background-editorial flex items-center justify-center shadow-sm">
                    <Image
                      src="/logo_smile.webp"
                      alt="Stamp"
                      width={60}
                      height={60}
                      className="grayscale contrast-125"
                    />
                    {/* Green overlay on success */}
                    <div
                      className={cn(
                        "absolute inset-0 transition-colors duration-500",
                        state === "success"
                          ? "bg-green-500/10 mix-blend-multiply"
                          : "bg-transparent"
                      )}
                    />
                  </div>
                </div>

                {/* CONTENT SWITCHER */}
                <div className="max-w-sm w-full mx-auto relative min-h-[400px] flex flex-col justify-center">
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
                      state={state}
                      error={error}
                      onSubmit={handleSubmit}
                      timezoneOptions={TIMEZONE_OPTIONS}
                    />
                  </div>

                  {/* --- STATE 2: SUBMITTING / PROCESSING --- */}
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

                  {/* --- STATE 3: SUCCESS --- */}
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
