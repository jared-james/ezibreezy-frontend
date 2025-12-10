// components/onboarding/onboarding-role.tsx

"use client";

import { Check, ArrowRight, User, Users, Building2 } from "lucide-react";
import type { PlanTier } from "@/lib/types/billing";
import { ROLE_OPTIONS } from "@/lib/constants/pricing";
import { cn } from "@/lib/utils";

interface OnboardingRoleProps {
  selectedRole: PlanTier | null;
  onSelectRole: (role: PlanTier) => void;
}

const Icons = {
  creator: User,
  agency: Users,
  scale: Building2,
};

export default function OnboardingRole({
  selectedRole,
  onSelectRole,
}: OnboardingRoleProps) {
  return (
    <div className="w-full max-w-5xl mx-auto mt-8">
      {/* Main Question Headline */}
      <div className="mb-10 text-left space-y-4">
        <h1 className="font-serif text-4xl md:text-5xl text-foreground font-light leading-[1.1]">
          How will you use <span className="italic font-bold">The Desk</span>?
        </h1>
        <p className="font-serif text-lg text-muted-foreground max-w-2xl">
          Select the profile that best matches your operational scale to
          configure your workspace.
        </p>
      </div>

      {/* Role Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ROLE_OPTIONS.map((option, index) => {
          const isSelected = selectedRole === option.tier;
          const Icon = Icons[option.tier as keyof typeof Icons] || User;

          return (
            <div
              key={option.tier}
              onClick={() => onSelectRole(option.tier)}
              className={cn(
                "group relative flex flex-col p-8 cursor-pointer transition-all duration-300 bg-surface",
                // Base Borders: 2px wide
                "border-2",
                // State Logic:
                // - Selected: Solid Green Border, Green tint bg
                // - Default: Dashed Grey Border
                // - Hover: Dashed Green Border (No black)
                isSelected
                  ? "border-brand-primary bg-brand-primary/[0.03] shadow-sm"
                  : "border-dashed border-foreground/20 hover:border-brand-primary/50 hover:bg-brand-primary/[0.01]"
              )}
            >
              {/* Card Header: Label & Check */}
              <div className="w-full flex justify-between items-start mb-6">
                <span
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-widest transition-colors",
                    isSelected
                      ? "text-brand-primary font-bold"
                      : "text-foreground/40 group-hover:text-brand-primary/70"
                  )}
                >
                  Option 0{index + 1}
                </span>

                {/* Visual "Check" Stamp */}
                <div
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full border transition-all duration-300",
                    isSelected
                      ? "bg-brand-primary border-brand-primary text-white scale-100 opacity-100"
                      : "bg-transparent border-foreground/20 text-transparent scale-90 opacity-0 group-hover:border-brand-primary/30"
                  )}
                >
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Icon & Content */}
              <div className="flex-1 mb-8">
                <div
                  className={cn(
                    "mb-6 transition-colors duration-300",
                    isSelected
                      ? "text-brand-primary"
                      : "text-foreground/40 group-hover:text-brand-primary/70"
                  )}
                >
                  <Icon strokeWidth={1.5} className="w-8 h-8" />
                </div>

                <h3
                  className={cn(
                    "font-serif text-2xl font-bold mb-3 transition-colors",
                    isSelected
                      ? "text-foreground"
                      : "text-foreground group-hover:text-brand-primary"
                  )}
                >
                  {option.title}
                </h3>
                <p className="font-serif text-sm text-foreground/70 leading-relaxed">
                  {option.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-auto">
                <button
                  className={cn(
                    "relative flex w-full items-center justify-center gap-2 overflow-hidden border px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-all rounded-sm",
                    isSelected
                      ? "bg-brand-primary text-white border-brand-primary"
                      : "bg-transparent text-foreground/60 border-dashed border-foreground/30 group-hover:border-brand-primary/50 group-hover:text-brand-primary"
                  )}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isSelected ? "Selected" : "Select Profile"}
                    <ArrowRight
                      className={cn(
                        "h-3 w-3 transition-transform duration-300",
                        isSelected
                          ? "translate-x-0"
                          : "-translate-x-1 group-hover:translate-x-0"
                      )}
                    />
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="mt-12 flex justify-center">
        <div className="flex items-center gap-4 border-t border-dashed border-foreground/30 pt-4 px-8 opacity-60">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Flexible Configurations
          </span>
          <span className="h-3 w-px bg-foreground/20" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Change Anytime
          </span>
        </div>
      </div>
    </div>
  );
}
