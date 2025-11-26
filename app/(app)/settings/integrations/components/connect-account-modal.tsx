// app/(app)/settings/integrations/components/connect-account-modal.tsx

"use client";

import { useState } from "react";
import { X, AlertCircle, Loader2 } from "lucide-react";

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
    window.location.href = `/api/integrations/${platformId}/connect`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-surface border border-border shadow-2xl rounded-lg overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          disabled={isConnecting}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-sm hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 md:p-10 text-center">
          {/* Top Icon - Circle Design */}
          <div className="inline-flex items-center justify-center w-14 h-14 mb-6 rounded-full border border-brand-primary/20 bg-brand-primary/5 shadow-sm">
            <Icon className="w-7 h-7 text-brand-primary" />
          </div>

          <div className="space-y-3 mb-8">
            <p className="eyebrow text-brand-primary">Integration Setup</p>
            <h2 className="headline text-2xl md:text-3xl">
              {isConnecting ? `Connecting...` : `Connect ${platformName}`}
            </h2>
          </div>

          <div className="relative bg-surface-hover border border-dashed border-border rounded-sm p-5 text-left mb-6">
            <div className="flex gap-3.5">
              <div className="shrink-0 mt-0.5 text-muted-foreground">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <p className="font-serif text-sm font-semibold text-foreground tracking-tight">
                  Check your active account
                </p>
                <p className="font-serif text-sm leading-relaxed text-muted-foreground">
                  {platformName} will authenticate using your currently
                  signed-in browser session. Please ensure you are logged into
                  the correct profile before continuing.
                </p>
              </div>
            </div>
          </div>

          {/* The "Line in the middle" - Short & Dotted */}
          <hr className="w-16 mx-auto border-t-2 border-dotted border-border mb-8" />

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
            <button
              onClick={onClose}
              disabled={isConnecting}
              className="btn btn-outline flex-1 py-3"
            >
              Cancel
            </button>
            <button
              onClick={handleConnectClick}
              disabled={isConnecting}
              className="btn btn-primary flex-1 py-3 group relative overflow-hidden"
            >
              {isConnecting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Redirecting
                </span>
              ) : (
                `Continue to ${platformName}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
