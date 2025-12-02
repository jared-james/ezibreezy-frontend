// components/calendar/modals/delete-confirmation-modal.tsx

"use client";

import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-surface border border-border shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200 rounded-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto w-12 h-12 flex items-center justify-center mb-6 border-2 border-error/20 rounded-full bg-error/5 text-error">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <p className="eyebrow mb-2 text-error">Irreversible Action</p>

        <h3 className="headline text-2xl mb-4">Delete this post?</h3>

        <p className="font-serif text-sm text-muted-foreground mb-8 leading-relaxed">
          This action cannot be undone. This post will be permanently removed
          from your calendar and any scheduled publishing will be cancelled.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="btn btn-outline flex-1"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="btn flex-1 bg-error text-white border-error hover:bg-error-hover hover:border-error-hover"
          >
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
