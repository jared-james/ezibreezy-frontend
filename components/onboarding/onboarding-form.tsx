// components/onboarding/onboarding-form.tsx

"use client";

import { ArrowRight, Loader2, Building2, Briefcase, Globe } from "lucide-react";
import TimeZoneSelect from "@/components/time-zone-select/time-zone-select";

type OnboardingState = "form" | "submitting" | "success";

interface OnboardingFormProps {
  organizationName: string;
  setOrganizationName: (value: string) => void;
  workspaceName: string;
  setWorkspaceName: (value: string) => void;
  timezone: string;
  setTimezone: (value: string) => void;
  state: OnboardingState;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

export default function OnboardingForm({
  organizationName,
  setOrganizationName,
  workspaceName,
  setWorkspaceName,
  timezone,
  setTimezone,
  state,
  error,
  onSubmit,
}: OnboardingFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8 max-w-2xl mx-auto mt-12">
      <div className="space-y-8">
        {/* ORGANIZATION NAME */}
        <div className="group">
          <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-foreground font-bold mb-2">
            <Building2 className="w-4 h-4" />
            Organization Name
          </label>
          <input
            type="text"
            required
            minLength={3}
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            placeholder="Midnight Briefs Club"
            className="w-full bg-transparent border-b-2 border-dotted border-foreground/30 py-2 font-serif text-xl text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground transition-colors"
            disabled={state !== "form"}
          />
          <p className="mt-1 text-[10px] text-foreground/40 font-mono">
            Min. 3 chars
          </p>
        </div>

        {/* WORKSPACE NAME */}
        <div className="group">
          <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-foreground font-bold mb-2">
            <Briefcase className="w-4 h-4" />
            Workspace Name
          </label>
          <input
            type="text"
            required
            minLength={3}
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            placeholder="Chicken Nuggie"
            className="w-full bg-transparent border-b-2 border-dotted border-foreground/30 py-2 font-serif text-xl text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground transition-colors"
            disabled={state !== "form"}
          />
          <p className="mt-1 text-[10px] text-foreground/40 font-mono">
            Min. 3 chars
          </p>
        </div>

        {/* TIMEZONE */}
        <div className="group relative z-20">
          <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-foreground font-bold mb-2">
            <Globe className="w-4 h-4" />
            Timezone
          </label>

          <TimeZoneSelect
            value={timezone}
            onChange={setTimezone}
            disabled={state !== "form"}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 border border-red-200 bg-red-50 text-center animate-in fade-in slide-in-from-top-2">
          <p className="font-serif text-sm text-red-600">{error}</p>
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
              Continue to Pricing
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
  );
}
