// components/connect-account-modal.tsx

"use client";

import type { ElementType } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConnectAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  platformName: string;
  platformIcon: ElementType;
  onConnect: () => void;
}

export default function ConnectAccountModal({
  isOpen,
  onClose,
  platformName,
  platformIcon: Icon,
  onConnect,
}: ConnectAccountModalProps) {
  if (!isOpen) return null;

  const handleConnectClick = () => {
    onConnect();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-surface border-4 border-foreground w-full max-w-lg p-8 shadow-[0_0_0_3px_rgba(0,0,0,0.4)] relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-20 h-20 mx-auto flex items-center justify-center border border-border bg-background mb-6">
            <Icon className="w-9 h-9 text-foreground" />
          </div>

          <h2 className="font-serif text-3xl font-bold text-foreground tracking-tight">
            Connect to {platformName}
          </h2>

          <p className="font-serif text-sm text-muted-foreground mt-3 mb-8 leading-relaxed max-w-md mx-auto">
            You will be redirected to {platformName} to authorize EziBreezy to
            manage posts on your behalf.
          </p>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              className="w-32 font-serif tracking-wide text-xs uppercase"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              className="w-48 font-serif tracking-wide text-xs uppercase"
              onClick={handleConnectClick}
            >
              Continue to {platformName}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
