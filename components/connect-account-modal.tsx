// components/connect-account-modal.tsx

"use client";
import { X, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

interface ConnectAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  platformName: string;
  platformIcon: React.ElementType;
  platformId: string;
}

export default function ConnectAccountModal({
  isOpen,
  onClose,
  platformName,
  platformIcon: Icon,
  platformId,
}: ConnectAccountModalProps) {
  if (!isOpen) return null;

  const handleConnectClick = () => {
    try {
      window.sessionStorage.setItem("connecting_platform", platformId);
    } catch (e) {
      console.error("Could not save to sessionStorage", e);
    }
    window.location.href = `/api/integrations/${platformId}/connect`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-surface border border-foreground shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {/* Icon - no border */}
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center bg-background">
              <Icon className="w-8 h-8 text-foreground" />
            </div>
          </div>

          {/* Eyebrow */}
          <p className="eyebrow text-center mb-2">Integration</p>

          {/* Title */}
          <h2 className="text-center font-serif text-3xl font-bold uppercase tracking-tight text-foreground mb-6">
            Connect to {platformName}
          </h2>

          {/* Body - Simplified */}
          <div className="space-y-5 text-foreground mb-8">
            {/* Main instruction */}
            <p className="text-center font-serif text-base leading-relaxed"></p>

            {/* Important notice - thin border */}
            <div className="border-l-2 border-foreground bg-surface-hover p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-foreground flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm leading-relaxed">
                  <p className="font-semibold">Account Selection</p>
                  <p>
                    {platformName} will open and use your currently signed-in
                    account. Make sure you're logged into the profile you want
                    to connect.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="outline"
              onClick={onClose}
              className="min-w-[7rem] font-serif uppercase tracking-[0.12em]"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConnectClick}
              className="min-w-[12rem] font-serif uppercase tracking-[0.12em]"
            >
              Continue to {platformName}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
