// app/(app)/settings/integrations/components/disconnect-confirm-modal.tsx

"use client";

import { X, AlertTriangle, Trash2, Loader2, Scissors } from "lucide-react";
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
      onClose();
    }
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
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-600/70 mb-2">
                System // Termination
              </p>
              <h2 className="headline text-3xl font-bold tracking-tight text-foreground">
                Disconnect
              </h2>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-4 font-serif text-sm text-foreground/80 leading-relaxed border-l-2 border-red-500 pl-3">
            Severing connection with{" "}
            <span className="font-bold border-b border-black/20 border-dotted">
              {accountName}
            </span>
            .
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 pt-6">
          <div className="space-y-6">
            {/* Warning Box */}
            <div className="border border-red-200 bg-red-50/50 p-4 flex items-start gap-3 rounded-sm">
              <div className="p-2 bg-white border border-red-100 rounded-full shrink-0">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div className="space-y-1 pt-0.5">
                <p className="font-mono text-[10px] font-bold text-red-700 uppercase tracking-wide">
                  Impact Warning
                </p>
                <p className="font-serif text-sm text-red-900/80 leading-relaxed">
                  This action will immediately stop all scheduled posts for this
                  channel. Configuration data may be lost.
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
                disabled={isLoading}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={isLoading}
                className="btn bg-red-600 text-white hover:bg-red-700 border-transparent flex-[2]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin mr-2" />
                    Disconnecting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3 h-3 mr-2" /> Confirm Disconnect
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
