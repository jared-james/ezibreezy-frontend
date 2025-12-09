// components/onboarding/onboarding-header.tsx

"use client";

import { ArrowLeft, Scissors } from "lucide-react";

interface OnboardingHeaderProps {
  currentStep: number;
  totalSteps: number;
  stepName: string;
  onBack?: () => void;
}

export function OnboardingHeader({
  currentStep,
  totalSteps,
  stepName,
  onBack,
}: OnboardingHeaderProps) {
  return (
    // Reduced vertical padding from pt-8 pb-12 to pt-6 pb-4
    <header className="w-full max-w-5xl mx-auto pt-6 pb-4 px-4 md:px-0">
      <div className="flex items-end justify-between border-b-2 border-black/10 pb-4">
        {/* Left: Navigation & Branding */}
        <div className="flex flex-col items-start gap-3">
          <div className="flex items-center gap-3">
            <div className="h-px w-6 bg-foreground/20" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40">
              EziBreezy Systems
            </span>
          </div>

          {onBack ? (
            <button
              onClick={onBack}
              className="group flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span className="font-serif text-sm italic">Go Back</span>
            </button>
          ) : (
            <div className="h-5" />
          )}
        </div>

        {/* Right: Step Indicator */}
        <div className="text-right">
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-0.5">
            Section {currentStep.toString().padStart(2, "0")} /{" "}
            {totalSteps.toString().padStart(2, "0")}
          </p>
          <h2 className="font-serif text-lg font-bold text-foreground">
            {stepName}
          </h2>
        </div>
      </div>

      {/* Decorative Cut Marks */}
      <div className="relative w-full h-px mt-1">
        <Scissors className="absolute -right-1.5 -top-2.5 w-3 h-3 text-black/20 rotate-180" />
      </div>
    </header>
  );
}
