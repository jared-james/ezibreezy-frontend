// components/settings/integrations/modals/connect-account-modal.tsx

// app/(app)/settings/integrations/components/connect-account-modal.tsx

"use client";

import { useState } from "react";
import {
  X,
  AlertCircle,
  Loader2,
  Scissors,
  Link2,
  CheckCircle2,
} from "lucide-react";
import { useWorkspaceStore } from "@/lib/store/workspace-store";

interface ConnectAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  platformName: string;
  platformIcon: React.ElementType;
  platformId: string;
  workspaceIdOverride?: string;
  nextUrl?: string;
}

export default function ConnectAccountModal({
  isOpen,
  onClose,
  platformName,
  platformIcon: Icon,
  platformId,
  workspaceIdOverride,
  nextUrl,
}: ConnectAccountModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const { currentWorkspace } = useWorkspaceStore();

  if (!isOpen) return null;

  const handleConnectClick = () => {
    const workspaceParam = workspaceIdOverride || currentWorkspace?.slug || currentWorkspace?.id;

    if (!workspaceParam) {
      console.error("No workspace selected");
      return;
    }

    setIsConnecting(true);
    try {
      window.sessionStorage.setItem("connecting_platform", platformId);
    } catch (e) {
      console.error("Could not save to sessionStorage", e);
    }

    // Build the connect URL
    let connectUrl = `/api/${workspaceParam}/integrations/${platformId}/connect`;

    if (nextUrl) {
      connectUrl += `?next=${encodeURIComponent(nextUrl)}`;
    }

    window.location.href = connectUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#e5e5e0]/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* 
        Container: 
        - Editorial paper color
        - Standard soft shadow
        - Clean border
      */}
      <div
        className="
          relative w-full max-w-md 
          bg-[#fdfbf7] 
          border border-black/10
          shadow-2xl rounded-lg
          flex flex-col overflow-hidden
        "
        role="dialog"
        aria-modal="true"
      >
        {/* Header Section */}
        <div className="p-8 border-b border-black/5 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                System // Integration
              </p>
              <h2 className="headline text-3xl font-bold tracking-tight text-foreground">
                Connect Account
              </h2>
            </div>
            <button
              onClick={onClose}
              disabled={isConnecting}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-4 font-serif text-sm text-foreground/80 leading-relaxed border-l-2 border-brand-primary pl-3">
            Connecting to{" "}
            <span className="font-bold border-b border-black/20 border-dotted">
              {platformName}
            </span>
            .
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 pt-6">
          <div className="space-y-6">
            {/* Visual Indicator of Connection */}

            {/* Warning / Info Box */}
            <div className="border border-amber-200 bg-amber-50/50 p-4 flex items-start gap-3 rounded-sm">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="font-mono text-xs font-bold text-amber-700 uppercase tracking-wide">
                  Session Verification
                </p>
                <p className="font-serif text-sm text-amber-800/80 leading-relaxed">
                  {platformName} will authenticate using your currently
                  signed-in browser session. Please ensure you are logged into
                  the correct profile before continuing.
                </p>
              </div>
            </div>

            {/* "Cut Line" Separator */}
            <div className="flex items-center gap-2 text-black/20 py-2">
              <Scissors className="h-4 w-4 -rotate-90" />
              <div className="flex-1 border-b-2 border-dashed border-black/10" />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isConnecting}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConnectClick}
                disabled={isConnecting}
                className="btn btn-primary flex-[2]"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin mr-2" />
                    Redirecting...
                  </>
                ) : (
                  <>Authorize & Connect</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
