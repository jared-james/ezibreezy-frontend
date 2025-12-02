// components/calendar/modals/delete-confirmation-modal.tsx

"use client";

import { AlertTriangle, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
        className="absolute inset-0 bg-stone-900/10 backdrop-blur-[2px] animate-in fade-in duration-200"
        onClick={isDeleting ? undefined : onClose}
      />

      {/* Modal Container - Brutalist Editorial Style */}
      <div
        className="
        relative w-full max-w-sm 
        bg-[#fdfbf7] 
        border-[3px] border-black 
        shadow-[8px_8px_0_0_#ef4444] 
        p-8 text-center 
        animate-in zoom-in-95 duration-200
      "
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-3 right-3 p-1 hover:bg-black/5 transition-colors disabled:opacity-50 group"
        >
          <X className="w-5 h-5 text-black/60 group-hover:text-black" />
        </button>

        {/* Icon with Double Border & Shadow */}
        <div className="mx-auto w-14 h-14 flex items-center justify-center mb-5 border-2 border-black rounded-full bg-red-50 text-red-600 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
          <AlertTriangle className="h-7 w-7" />
        </div>

        {/* Eyebrow */}
        <p className="font-mono text-[10px] uppercase tracking-widest text-red-600 mb-3 font-bold">
          Irreversible Action
        </p>

        {/* Internal Dotted Divider */}
        <div className="border-b-2 border-dotted border-black/20 mb-6 mx-auto w-12" />

        {/* Heading */}
        <h3 className="font-serif text-2xl font-bold uppercase tracking-wide text-black mb-3">
          Delete Post?
        </h3>

        {/* Body Text */}
        <p className="font-serif text-sm text-black/70 mb-8 leading-relaxed">
          This action cannot be undone. This post will be permanently removed
          from your calendar.
        </p>

        {/* Buttons - Hybrid Dotted Style */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="
              flex-1 py-3 px-4 
              border-2 border-dotted border-black 
              bg-white
              font-mono text-xs uppercase tracking-wider font-bold
              text-black
              hover:bg-black/5 hover:border-solid
              transition-all duration-200
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="
              flex-1 py-3 px-4 
              bg-red-600 text-white 
              border-2 border-dotted border-black
              font-mono text-xs uppercase tracking-wider font-bold
              hover:bg-red-500 hover:border-solid hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:-translate-y-0.5
              active:translate-y-0 active:shadow-none
              transition-all duration-200
              disabled:opacity-70 disabled:hover:transform-none disabled:hover:shadow-none
              flex items-center justify-center gap-2
            "
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Processing
              </>
            ) : (
              "Yes, Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
