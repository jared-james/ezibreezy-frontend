// components/connect-account-modal.tsx

"use client";

import { X } from "lucide-react";
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
  if (!isOpen) {
    return null;
  }

  const handleConnectClick = () => {
    // 1. Store which platform we're connecting
    try {
      window.sessionStorage.setItem("connecting_platform", platformId);
    } catch (e) {
      console.error("Could not save to sessionStorage", e);
    }

    // 2. Redirect through our Next.js API route (not directly to backend)
    // This route will handle authentication and forward to the backend
    window.location.href = `/api/connections/${platformId}/connect`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface border-4 border-foreground w-full max-w-lg shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto flex items-center justify-center border border-border bg-background mb-4">
            <Icon className="w-8 h-8 text-foreground" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Connect to {platformName}
          </h2>
          <p className="font-serif text-muted mt-2 mb-6 max-w-sm mx-auto">
            You will be redirected to {platformName} to authorize EziBreezy to
            manage posts on your behalf.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={onClose} className="w-32">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConnectClick}
              className="w-48"
            >
              Continue to {platformName}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
