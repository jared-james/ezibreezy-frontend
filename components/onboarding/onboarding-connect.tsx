// components/onboarding/onboarding-connect.tsx

"use client";

import { useState } from "react";
import { ArrowRight, Scissors } from "lucide-react";
import { platformDefinitions } from "@/components/settings/integrations/constants";
import { InstagramConnectOptionsModal } from "@/components/settings/integrations/modals/instagram-connect-modal";
import ConnectAccountModal from "@/components/settings/integrations/modals/connect-account-modal";
import { cn } from "@/lib/utils";
import type { PlatformDefinition } from "@/components/settings/integrations/types";

interface OnboardingConnectProps {
  workspaceId: string;
  workspaceSlug: string;
  onSkip: () => void;
}

export default function OnboardingConnect({
  workspaceId,
  workspaceSlug,
  onSkip,
}: OnboardingConnectProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformDefinition | null>(null);

  const nextUrl = `/${workspaceSlug}/settings/integrations`;

  const handlePlatformClick = (platform: PlatformDefinition) => {
    setSelectedPlatform(platform);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto opacity-100">
      {/* Header */}
      <div className="mb-8 text-center space-y-3">
        <h2 className="headline text-4xl md:text-5xl font-bold text-foreground">
          Connect a Channel
        </h2>
        <p className="font-serif text-lg text-foreground/70 leading-relaxed max-w-xl mx-auto">
          Link a primary account to start publishing immediately.
          <br />
          You can add more channels later in settings.
        </p>
      </div>

      {/* Grid */}
      <div className="flex-1 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {platformDefinitions.map((platform) => {
            const Icon = platform.icon;
            const isSelected = selectedPlatform?.id === platform.id;

            return (
              <button
                key={platform.id}
                onClick={() => handlePlatformClick(platform)}
                className={cn(
                  "group relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-sm transition-all duration-300 min-h-[140px]",
                  isSelected
                    ? "border-brand-primary bg-brand-primary/5"
                    : "border-foreground/20 bg-surface hover:border-foreground hover:bg-surface-hover"
                )}
              >
                <div
                  className={cn(
                    "mb-4 flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-300",
                    isSelected
                      ? "bg-white border-brand-primary/20 scale-110"
                      : "bg-white border-foreground/10 group-hover:scale-110 group-hover:border-foreground/30"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-7 w-7 transition-colors duration-300",
                      isSelected
                        ? "text-brand-primary"
                        : "text-foreground group-hover:text-foreground"
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "font-serif text-lg transition-colors duration-300",
                    isSelected
                      ? "text-brand-primary font-bold"
                      : "text-foreground group-hover:text-foreground font-medium"
                  )}
                >
                  {platform.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer / Skip Action */}
      <div className="mt-auto flex flex-col items-center gap-4">
        {/* Decorative Scissor Line */}
        <div className="w-full flex items-center gap-2 opacity-30 mb-2">
          <div className="h-px bg-foreground flex-1 border-t border-dashed border-foreground" />
          <Scissors className="w-4 h-4 text-foreground" />
          <div className="h-px bg-foreground flex-1 border-t border-dashed border-foreground" />
        </div>

        <button
          onClick={onSkip}
          className="group flex items-center gap-2 px-6 py-3 rounded-sm text-foreground/60 hover:text-foreground transition-all"
        >
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] border-b border-transparent group-hover:border-foreground/50 transition-all">
            I&apos;ll Do This Later
          </span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {selectedPlatform?.id === "instagram" && (
        <InstagramConnectOptionsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPlatform(null);
          }}
          platform={selectedPlatform}
          workspaceIdOverride={workspaceId}
          nextUrl={nextUrl}
        />
      )}

      {selectedPlatform && selectedPlatform.id !== "instagram" && (
        <ConnectAccountModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPlatform(null);
          }}
          platformName={selectedPlatform.name}
          platformIcon={selectedPlatform.icon}
          platformId={selectedPlatform.id}
          workspaceIdOverride={workspaceId}
          nextUrl={nextUrl}
        />
      )}
    </div>
  );
}
