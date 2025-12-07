// components/settings/integrations/modals/instagram-connect-modal.tsx

"use client";

import { Instagram, X, Facebook, Check, AlertCircle } from "lucide-react";
import { PlatformDefinition } from "../types";
import { useWorkspaceStore } from "@/lib/store/workspace-store";

interface InstagramConnectOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: PlatformDefinition;
  workspaceIdOverride?: string;
  nextUrl?: string;
}

export const InstagramConnectOptionsModal: React.FC<
  InstagramConnectOptionsModalProps
> = ({ isOpen, onClose, platform, workspaceIdOverride, nextUrl }) => {
  const { currentWorkspace } = useWorkspaceStore();

  const targetWorkspaceId = workspaceIdOverride || currentWorkspace?.id;

  if (!isOpen) return null;

  const handleConnect = (
    authType: "facebook_business" | "instagram_business"
  ) => {
    if (!targetWorkspaceId) {
      console.error("No workspace selected");
      return;
    }

    try {
      window.sessionStorage.setItem("connecting_platform", platform.id);
    } catch (e) {
      console.error("Could not save to sessionStorage", e);
    }

    const routePlatformId =
      authType === "instagram_business"
        ? "instagram-direct"
        : "instagram-facebook";

    let connectUrl = `/api/integrations/${routePlatformId}/connect?workspaceId=${targetWorkspaceId}`;

    if (nextUrl) {
      connectUrl += `&next=${encodeURIComponent(nextUrl)}`;
    }

    window.location.href = connectUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#e5e5e0]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="
          relative w-full max-w-3xl 
          bg-[#fdfbf7] 
          border border-black/10 
          shadow-2xl rounded-lg 
          overflow-hidden flex flex-col max-h-[90vh]
        "
        role="dialog"
        aria-modal="true"
      >
        {/* Header Section - Reduced padding */}
        <div className="relative p-6 border-b border-dashed border-black/10 text-center bg-[#fdfbf7] shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-sm hover:bg-black/5"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Icon - Smaller */}
          <div className="inline-flex items-center justify-center w-10 h-10 mb-3 rounded-full border border-black/10 bg-white shadow-sm">
            <Instagram className="w-5 h-5 text-foreground" />
          </div>

          <div className="space-y-1">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Integration Setup
            </p>
            <h2 className="headline text-2xl font-bold tracking-tight">
              Connect Instagram
            </h2>
            <p className="font-serif text-sm text-muted-foreground max-w-lg mx-auto">
              Choose your preferred connection method below.
            </p>
          </div>
        </div>

        {/* Options Container - Reduced padding & gap */}
        <div className="p-6 overflow-y-auto bg-[#fdfbf7]">
          <div className="grid md:grid-cols-2 gap-4 items-stretch">
            {/* Option 1: Facebook (Recommended) */}
            <div className="relative flex flex-col p-5 border-2 border-dashed border-brand-primary/30 bg-white hover:border-brand-primary/50 transition-colors duration-300 rounded-sm">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#fdfbf7] px-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-brand-primary/20 rounded-full bg-brand-primary/10 text-brand-primary text-[0.6rem] font-bold uppercase tracking-wider shadow-sm">
                  <Check className="w-2.5 h-2.5" /> Recommended
                </span>
              </div>

              <div className="flex flex-col items-center text-center gap-2 mb-3 mt-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1877F2] text-white border border-black/10 shadow-sm">
                  <Facebook className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    Facebook Login
                  </h3>
                  <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
                    Best for Business
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-4 text-center">
                <p className="font-serif text-sm leading-relaxed text-muted-foreground">
                  Connect Instagram Business or Creator accounts linked to a
                  Facebook Page.
                </p>
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-serif text-foreground/80">
                    <Check className="w-3 h-3 text-brand-primary" />{" "}
                    Auto-publishing
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-serif text-foreground/80">
                    <Check className="w-3 h-3 text-brand-primary" /> Analytics
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-2">
                <hr className="w-12 mx-auto border-t-2 border-dotted border-black/10 mb-4" />
                <button
                  onClick={() => handleConnect("facebook_business")}
                  className="btn btn-primary w-full shadow-sm py-2 text-xs"
                >
                  Connect via Facebook
                </button>
              </div>
            </div>

            {/* Option 2: Instagram Direct */}
            <div className="flex flex-col p-5 border-2 border-dashed border-black/10 hover:border-black/30 transition-colors duration-300 rounded-sm bg-white/50">
              <div className="flex flex-col items-center text-center gap-2 mb-3 mt-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-sm border border-transparent">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    Instagram Login
                  </h3>
                  <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
                    Direct Connection
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-4 text-center">
                <p className="font-serif text-sm leading-relaxed text-muted-foreground">
                  For accounts <strong>not</strong> connected to a Facebook
                  Page.
                </p>

                <div className="px-3 py-2 bg-amber-50/50 border border-dotted border-amber-200/50 rounded-sm">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-amber-800 mb-1 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Limitations
                  </p>
                  <p className="font-serif text-[11px] text-amber-900/70 italic leading-snug">
                    No analytics, product tagging, or location tagging
                    available.
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-2">
                <hr className="w-12 mx-auto border-t-2 border-dotted border-black/10 mb-4" />
                <button
                  onClick={() => handleConnect("instagram_business")}
                  className="btn btn-outline w-full bg-transparent border-black/20 hover:bg-black/5 py-2 text-xs"
                >
                  Connect via Instagram
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
