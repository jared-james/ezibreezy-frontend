// components/connect-account-modal.tsx

"use client";
import { X, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

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
  const [isConnecting, setIsConnecting] = useState(false);

  if (!isOpen) return null;

  const handleConnectClick = () => {
    setIsConnecting(true);
    try {
      window.sessionStorage.setItem("connecting_platform", platformId);
    } catch (e) {
      console.error("Could not save to sessionStorage", e);
    }
    // This simple call handles all non-Instagram platforms correctly
    // (X, LinkedIn, YouTube) and directs to the default backend flow.
    window.location.href = `/api/integrations/${platformId}/connect`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-surface border border-foreground shadow-2xl">
        {/* Close button - disabled during loading */}
        <button
          onClick={onClose}
          disabled={isConnecting}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            {isConnecting
              ? `Opening ${platformName}...`
              : `Connect to ${platformName}`}
          </h2>

          {/* Body - Simplified */}
          <div className="space-y-5 text-foreground mb-8">
            {/* Main instruction */}
            <p className="text-center font-serif text-base leading-relaxed"></p>

            {/* Important notice - thin border */}
            <div className="border-l-2 border-foreground bg-surface-hover p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-foreground shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm leading-relaxed">
                  <p className="font-semibold">Account selection</p>
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
              disabled={isConnecting}
              className="min-w-28 font-serif uppercase tracking-[0.12em]"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConnectClick}
              disabled={isConnecting}
              className="min-w-48 font-serif uppercase tracking-[0.12em]"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                `Continue to ${platformName}`
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
