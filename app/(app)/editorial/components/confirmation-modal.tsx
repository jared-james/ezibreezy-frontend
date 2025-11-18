// app/(app)/editorial/components/confirmation-modal.tsx

"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, CalendarCheck, X } from "lucide-react";

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
  const title = isScheduled ? "Post Scheduled!" : "Post Sent!";
  const Icon = isScheduled ? CalendarCheck : CheckCircle;
  const postText = count > 1 ? `${count} posts have` : `Your post has`;
  const message = `${postText} been successfully ${status}.`;

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
            <Icon className="w-8 h-8 text-success" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            {title}
          </h2>
          <p className="font-serif text-muted mt-2 mb-6 max-w-sm mx-auto">
            {message}
          </p>
          <div className="flex justify-center">
            <Button variant="primary" onClick={onClose} className="w-48">
              Create Another Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
