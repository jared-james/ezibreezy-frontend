// app/(app)/onboarding/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, CheckCircle2, Building2, Briefcase, Globe, Sparkles } from "lucide-react";
import posthog from "posthog-js";
import { completeOnboarding } from "@/app/actions/user";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function OnboardingPage() {
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
              <div className="p-8 md:p-12 flex flex-col relative border-b md:border-b-0 md:border-r border-dashed border-foreground/30 bg-surface">
                <div className="mb-8">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 border border-foreground/20 px-2 py-1">
                    System Setup
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-center space-y-6">
                  <h1 className="font-serif text-4xl md:text-5xl font-light leading-[1.1]">
                    Welcome to <br />
                    <span className="font-bold italic">The Desk.</span>
                  </h1>
                  <p className="font-serif text-lg text-foreground/70 leading-relaxed max-w-sm">
                    Let&rsquo;s set up your editorial workspace. Your organization is your publishing house. Your workspace is where the magic happens.
                  </p>
                </div>

                <div className="mt-auto pt-12">
                  <p className="font-serif text-xs font-bold uppercase tracking-[0.2em] opacity-30">
                    EziBreezy Systems · Est. 2025
                  </p>
                </div>
              </div>

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
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="space-y-8">
                        {/* ORGANIZATION NAME */}
                        <div className="group">
                          <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-foreground/50 mb-2">
                            <Building2 className="w-3 h-3" />
                            Organization Name
                          </label>
                          <input
                            type="text"
                            required
                            minLength={3}
                            value={organizationName}
                            onChange={(e) => setOrganizationName(e.target.value)}
                            placeholder="Acme Publishing Co."
                            className="w-full bg-transparent border-b-2 border-dotted border-foreground/30 py-2 font-serif text-xl text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground transition-colors"
                            disabled={state !== "form"}
                          />
                          <p className="mt-1 text-[10px] text-foreground/40 font-mono">
                            Min. 3 chars
                          </p>
                        </div>

                        {/* WORKSPACE NAME */}
                        <div className="group">
                          <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-foreground/50 mb-2">
                            <Briefcase className="w-3 h-3" />
                            Workspace Name
                          </label>
                          <input
                            type="text"
                            required
                            minLength={3}
                            value={workspaceName}
                            onChange={(e) => setWorkspaceName(e.target.value)}
                            placeholder="Main Desk"
                            className="w-full bg-transparent border-b-2 border-dotted border-foreground/30 py-2 font-serif text-xl text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground transition-colors"
                            disabled={state !== "form"}
                          />
                          <p className="mt-1 text-[10px] text-foreground/40 font-mono">
                            Min. 3 chars
                          </p>
                        </div>

                        {/* TIMEZONE */}
                        <div className="group">
                          <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-foreground/50 mb-2">
                            <Globe className="w-3 h-3" />
                            Timezone
                          </label>
                          <Select
                            value={timezone}
                            onValueChange={setTimezone}
                            disabled={state !== "form"}
                          >
                            <SelectTrigger className="w-full h-[50px] px-4 bg-transparent border-b-2 border-dotted border-foreground/30 font-serif text-base focus:ring-0 focus:border-foreground transition-colors rounded-none">
                              <SelectValue placeholder="Select Timezone" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px] bg-surface border border-foreground shadow-xl font-serif">
                              {TIMEZONE_OPTIONS.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                  className="cursor-pointer focus:bg-foreground/5 focus:text-foreground"
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {error && (
                        <div className="p-3 border border-red-200 bg-red-50 text-center animate-in fade-in slide-in-from-top-2">
                          <p className="font-serif text-sm text-red-600">
                            {error}
                          </p>
                        </div>
                      )}

                      <div className="pt-4">
                        <button
                          type="submit"
                          className="w-full bg-brand-primary text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-brand-primary-hover transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                          disabled={state !== "form"}
                        >
                          {state === "submitting" ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Setting up...
                            </>
                          ) : (
                            <>
                              Create Workspace
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-center">
                        <p className="font-serif text-xs text-foreground/50 italic">
                          This sets up your publishing environment
                        </p>
                      </div>
                    </form>
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
                    {/* Animated Typewriter / Printing Press */}
                    <div className="relative">
                      {/* Outer rotating border */}
                      <div className="w-24 h-24 rounded-full border-[3px] border-dashed border-foreground/20 flex items-center justify-center animate-[spin_3s_linear_infinite]">
                        {/* Inner pulsing circle */}
                        <div className="absolute inset-4 rounded-full bg-brand-primary/10 animate-pulse" />
                      </div>
                      {/* Center icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-brand-primary animate-pulse" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-serif text-2xl text-foreground font-medium animate-in fade-in slide-in-from-bottom-2 duration-300">
                        Setting Up Your Desk
                      </h3>
                      <div className="space-y-1">
                        <p className="font-mono text-xs uppercase tracking-widest text-foreground/60">
                          Creating organization...
                        </p>
                        <p className="font-mono text-xs uppercase tracking-widest text-foreground/60">
                          Building workspace...
                        </p>
                        <p className="font-mono text-xs uppercase tracking-widest text-foreground/60">
                          Warming up the printing press...
                        </p>
                      </div>
                    </div>

                    {/* Progress dots */}
                    <div className="flex gap-2 justify-center pt-4">
                      <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" />
                    </div>
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
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-foreground/20 flex items-center justify-center animate-[spin_10s_linear_infinite]">
                        {/* Decorative outer ring */}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-green-600 animate-in zoom-in duration-300" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-serif text-2xl text-foreground font-medium">
                        Workspace Created
                      </h3>
                      <p className="font-mono text-xs uppercase tracking-widest text-foreground/50 animate-pulse">
                        Entering the newsroom...
                      </p>
                    </div>

                    <div className="flex gap-2 justify-center opacity-50 pt-4">
                      {/* Fake progress indicators */}
                      <div className="w-2 h-2 rounded-full bg-foreground animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-2 h-2 rounded-full bg-foreground animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-2 h-2 rounded-full bg-foreground animate-bounce" />
                    </div>
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
