// components/onboarding/onboarding-branding.tsx

"use client";

export default function OnboardingBranding() {
  return (
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
  );
}
