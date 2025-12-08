// components/post-editor/modals/confirmation-modal.tsx

"use client";

import { X, Scissors, CheckCircle2, CalendarClock, Send } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const postLabel = isMultiple ? `${count} posts` : "Post";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#e5e5e0]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#fdfbf7] border border-black/10 shadow-2xl rounded-lg flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-black/5 pb-6 bg-[#fdfbf7] shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Content // {isScheduled ? "Scheduling" : "Distribution"}
              </p>
              <h2 className="headline text-3xl font-bold tracking-tight text-foreground">
                {isScheduled ? "Confirmed" : "Deployed"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 pt-6">
          <div className="space-y-6">
            {/* Status Indicator Box */}
            <div
              className={cn(
                "p-4 border rounded-sm flex gap-4 items-start animate-in fade-in slide-in-from-bottom-2 duration-300",
                isScheduled
                  ? "bg-blue-50/50 border-blue-100"
                  : "bg-green-50/50 border-green-100"
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-full shrink-0 border",
                  isScheduled
                    ? "bg-blue-100/50 text-blue-700 border-blue-200"
                    : "bg-green-100/50 text-green-700 border-green-200"
                )}
              >
                {isScheduled ? (
                  <CalendarClock className="w-5 h-5" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </div>

              <div>
                <h3 className="font-serif font-bold text-foreground text-lg">
                  {isScheduled
                    ? "Scheduled Successfully"
                    : "Published Successfully"}
                </h3>
                <p className="font-serif text-sm text-muted-foreground mt-1 leading-relaxed">
                  {isScheduled
                    ? `Your ${postLabel.toLowerCase()} has been added to the queue and will be published automatically at the selected time.`
                    : `Your ${postLabel.toLowerCase()} is now live. It may take a few moments to appear on the destination platforms.`}
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
                className="btn btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Return to Feed</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
