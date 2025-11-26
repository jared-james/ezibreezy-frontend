// app/(app)/settings/integrations/components/instagram-connect-modal.tsx

// components/instagram-connect-modal.tsx
"use client";

import { Instagram, X, Facebook, Check, AlertCircle } from "lucide-react";
import { PlatformDefinition } from "../types";

interface InstagramConnectOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: PlatformDefinition;
}

export const InstagramConnectOptionsModal: React.FC<
  InstagramConnectOptionsModalProps
> = ({ isOpen, onClose, platform }) => {
  if (!isOpen) return null;

  const handleConnect = (
    authType: "facebook_business" | "instagram_business"
  ) => {
    try {
      window.sessionStorage.setItem("connecting_platform", platform.id);
    } catch (e) {
      console.error("Could not save to sessionStorage", e);
    }

    const routePlatformId =
      authType === "instagram_business"
        ? "instagram-direct"
        : "instagram-facebook";

    const connectUrl = `/api/integrations/${routePlatformId}/connect`;
    window.location.href = connectUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-surface border border-border shadow-2xl rounded-lg overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Section */}
        <div className="relative p-8 md:p-10 border-b border-dashed border-border text-center bg-surface">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-sm hover:bg-surface-hover"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Icon - Circle Design */}
          <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-full border border-brand-primary/20 bg-brand-primary/5 shadow-sm">
            <Instagram className="w-6 h-6 text-brand-primary" />
          </div>

          <div className="space-y-2">
            <p className="eyebrow text-brand-primary">Integration Setup</p>
            <h2 className="headline text-2xl md:text-3xl">Connect Instagram</h2>
            <p className="subheadline max-w-lg mx-auto">
              Choose your preferred connection method below.
            </p>
          </div>
        </div>

        {/* Options Container */}
        <div className="p-8 md:p-10 overflow-y-auto bg-surface/50">
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Option 1: Facebook (Recommended - Coupon Style) */}
            <div className="relative flex flex-col p-6 md:p-8 border-2 border-dashed border-brand-accent/40 bg-brand-accent/[0.02] hover:bg-brand-accent/[0.04] transition-colors duration-300 rounded-sm">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-surface px-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 border border-brand-accent/20 rounded-full bg-brand-accent/10 text-brand-accent text-[0.65rem] font-bold uppercase tracking-wider">
                  <Check className="w-3 h-3" /> Recommended
                </span>
              </div>

              <div className="flex flex-col items-center text-center gap-3 mb-4">
                {/* Circle Icon */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1877F2]/10 text-[#1877F2] border border-[#1877F2]/20">
                  <Facebook className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-foreground">
                    Facebook Login
                  </h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                    Best for Business
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-4 text-center">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Connect Instagram Business or Creator accounts linked to a
                  Facebook Page.
                </p>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                  <span className="inline-flex items-center gap-1.5 text-xs text-foreground/80">
                    <Check className="w-3 h-3 text-brand-primary" />{" "}
                    Auto-publishing
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-foreground/80">
                    <Check className="w-3 h-3 text-brand-primary" /> Analytics
                  </span>
                </div>
              </div>

              {/* The "Line in the middle" - Short & Dotted */}
              <div className="mt-auto pt-2">
                <hr className="w-16 mx-auto border-t-2 border-dotted border-brand-accent/30 mb-6" />
                <button
                  onClick={() => handleConnect("facebook_business")}
                  className="btn btn-primary w-full shadow-sm"
                >
                  Connect via Facebook
                </button>
              </div>
            </div>

            {/* Option 2: Instagram Direct (Editorial Style) */}
            <div className="flex flex-col p-6 md:p-8 border-2 border-dashed border-border hover:border-foreground/20 transition-colors duration-300 rounded-sm bg-surface">
              <div className="flex flex-col items-center text-center gap-3 mb-4">
                {/* Circle Icon */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-sm border border-transparent">
                  <Instagram className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-foreground">
                    Instagram Login
                  </h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                    Direct Connection
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-4 text-center">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  For accounts <strong>not</strong> connected to a Facebook
                  Page.
                </p>

                <div className="px-3 py-2 bg-surface-hover/50 border border-dotted border-border rounded-sm">
                  <p className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center justify-center gap-1.5">
                    <AlertCircle className="w-3 h-3" /> Limitations
                  </p>
                  <p className="text-xs text-muted-foreground/80 italic">
                    No analytics, product tagging, or location tagging
                    available.
                  </p>
                </div>
              </div>

              {/* The "Line in the middle" - Short & Dotted */}
              <div className="mt-auto pt-2">
                <hr className="w-16 mx-auto border-t-2 border-dotted border-border mb-6" />
                <button
                  onClick={() => handleConnect("instagram_business")}
                  className="btn btn-outline w-full bg-transparent"
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
