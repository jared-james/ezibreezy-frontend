"use client";

import { X, AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";

interface DisconnectConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  accountName: string;
}

export const DisconnectConfirmModal: React.FC<DisconnectConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  accountName,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
      onClose(); // Ensure modal closes even if void return
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-surface border border-border shadow-2xl rounded-lg overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-sm hover:bg-surface-hover disabled:opacity-50"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 text-center">
          {/* Top Icon - Red for Destructive Action */}
          <div className="inline-flex items-center justify-center w-14 h-14 mb-6 rounded-full border border-error/20 bg-error/5 shadow-sm">
            <Trash2 className="w-7 h-7 text-error" />
          </div>

          <div className="space-y-3 mb-2">
            <p className="eyebrow text-error">Disconnect Account</p>
            <h2 className="headline text-2xl">Are you sure?</h2>
          </div>

          <p className="font-serif text-sm leading-relaxed text-muted-foreground">
            You are about to disconnect{" "}
            <strong className="text-foreground">{accountName}</strong>. This
            will stop any scheduled posts for this channel.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 border-t border-border border-dashed bg-surface/50">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="btn btn-outline flex-1 py-3"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="btn flex-1 py-3 bg-error text-error-foreground border-error/50 hover:bg-error-hover hover:border-error-hover shadow-sm"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Disconnecting...
                </span>
              ) : (
                "Yes, Disconnect"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
