// components/post-editor/modals/confirmation-modal.tsx

"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: "sent" | "scheduled" | null;
  count: number;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  status,
  count,
}: ConfirmationModalProps) {
  if (!isOpen || !status) return null;

  const isScheduled = status === "scheduled";

  const isMultiple = count > 1;
  const postLabel = isMultiple ? `${count} posts` : "Your post";
  const message = isScheduled
    ? `${postLabel} will be published at the scheduled time.`
    : `${postLabel} ${
        isMultiple ? "are" : "is"
      } now live across your channels.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-surface border border-foreground shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 text-center">
          <p className="eyebrow mb-2">
            {isScheduled ? "All Set" : "Published"}
          </p>

          {/* Line under eyebrow */}
          <div className="border-b border-foreground mb-6 mx-auto w-16" />

          <h2 className="font-serif text-4xl font-bold uppercase tracking-tight text-foreground">
            {isScheduled ? "Scheduled" : "Live"}
          </h2>

          {/* Double rule divider */}
          <div className="border-b-4 border-double border-foreground my-5 mx-8" />

          <p className="font-serif text-sm text-muted-foreground leading-relaxed mb-8">
            {message}
          </p>

          <Button
            variant="primary"
            onClick={onClose}
            className="w-full font-serif uppercase tracking-[0.12em]"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
