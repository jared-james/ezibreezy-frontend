// components/post-editor/modals/validation-error-modal.tsx

"use client";

import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ValidationErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errors: string[];
}

export default function ValidationErrorModal({
  isOpen,
  onClose,
  errors,
}: ValidationErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-surface border border-foreground shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 text-center">
          <div className="mx-auto w-12 h-12 flex items-center justify-center mb-4 border-2 border-error rounded-full bg-error/10 text-error">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <p className="eyebrow mb-2 text-error">Action Required</p>

          <div className="border-b border-foreground mb-6 mx-auto w-16" />

          <h2 className="font-serif text-2xl font-bold uppercase tracking-tight text-foreground mb-6">
            Validation Issues
          </h2>

          <div className="text-left bg-muted/30 border border-border p-4 mb-8 rounded-sm">
            <ul className="list-disc list-inside space-y-2">
              {errors.map((error, index) => (
                <li key={index} className="text-sm text-foreground font-medium">
                  {error}
                </li>
              ))}
            </ul>
          </div>

          <Button
            variant="primary"
            onClick={onClose}
            className="w-full font-serif uppercase tracking-[0.12em]"
          >
            Fix Issues
          </Button>
        </div>
      </div>
    </div>
  );
}
