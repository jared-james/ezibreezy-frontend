// components/onboarding/onboarding-role.tsx

"use client";

import { Check, ArrowRight } from "lucide-react";
import type { PlanTier } from "@/lib/types/billing";
import { ROLE_OPTIONS } from "@/lib/constants/pricing";
import { cn } from "@/lib/utils";

interface OnboardingRoleProps {
  selectedRole: PlanTier | null;
  onSelectRole: (role: PlanTier) => void;
}

export default function OnboardingRole({
  selectedRole,
  onSelectRole,
}: OnboardingRoleProps) {
  return (
    <div className="w-full max-w-3xl mx-auto mt-2">
      {/* Section Headline */}
      <div className="mb-6 text-left">
        <h1 className="font-serif text-3xl md:text-4xl text-foreground font-light">
          How will you use <span className="italic font-bold">The Desk</span>?
        </h1>
        <p className="font-serif text-base text-muted-foreground mt-2 max-w-xl">
          Select the profile that best matches your operational scale.
        </p>
      </div>

      {/* Role "Tickets" */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {ROLE_OPTIONS.map((option, index) => {
          const isSelected = selectedRole === option.tier;

          return (
            <div
              key={option.tier}
              className={cn(
                "group relative flex flex-col text-left transition-all duration-300",
                "bg-surface rounded-sm border-2",
                isSelected
                  ? "border-brand-primary shadow-lg scale-[1.02] z-10"
                  : "border-dashed border-black/10 hover:border-black/30"
              )}
            >
              {/* Card Header: Option Label */}
              <div className="w-full flex justify-between items-start p-6 pb-2">
                <span
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-widest transition-colors",
                    isSelected
                      ? "text-brand-primary font-bold"
                      : "text-muted-foreground"
                  )}
                >
                  Option 0{index + 1}
                </span>

                {/* Visual "Check" Stamp (Only visible if previously selected) */}
                <div
                  className={cn(
                    "flex items-center justify-center w-5 h-5 rounded-full transition-all duration-300",
                    isSelected
                      ? "bg-brand-primary text-white scale-100 opacity-100"
                      : "bg-transparent scale-90 opacity-0"
                  )}
                >
                  <Check className="w-3 h-3" />
                </div>
              </div>

              {/* Text Content */}
              <div className="p-6 pt-2 flex-1">
                <h3
                  className={cn(
                    "font-serif text-2xl font-bold mb-3 transition-colors",
                    isSelected ? "text-brand-primary" : "text-foreground"
                  )}
                >
                  {option.title}
                </h3>
                <p className="font-serif text-sm text-muted-foreground leading-relaxed">
                  {option.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="p-4 border-t border-black/10 bg-white rounded-b-sm">
                <button
                  onClick={() => onSelectRole(option.tier)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 transition-all duration-200 border border-transparent rounded-sm group/btn",
                    isSelected
                      ? "bg-brand-primary text-white shadow-md hover:bg-brand-primary-hover"
                      : "bg-black/5 text-foreground hover:bg-black/10 hover:border-black/20"
                  )}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold">
                    {isSelected ? "Selected" : "Select Profile"}
                  </span>
                  <ArrowRight
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isSelected
                        ? "translate-x-0"
                        : "group-hover/btn:translate-x-1"
                    )}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="mt-8 pt-4 border-t border-dashed border-black/10 text-center md:text-left">
        <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
          Note: You can adjust your plan tier at any time in settings.
        </p>
      </div>
    </div>
  );
}
