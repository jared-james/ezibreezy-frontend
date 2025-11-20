// app/(app)/calendar/components/editorial-modal.tsx

"use client";

import { X, Loader2 } from "lucide-react";
import EditorialCore from "@/components/post-editor/editorial-core";
import { useEditorialStore } from "@/lib/store/editorial-store";

interface EditorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  isLoading?: boolean;
}

export default function EditorialModal({
  isOpen,
  onClose,
  title = "Create New Post",
  isLoading = false,
}: EditorialModalProps) {
  const reset = useEditorialStore((state) => state.reset);

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/50 backdrop-blur-sm">
      <div className="flex h-[90vh] w-full max-w-7xl flex-col overflow-hidden border-4 border-foreground bg-surface shadow-2xl">
        <div className="z-10 flex shrink-0 items-center justify-between border-b-4 border-double border-foreground bg-surface p-6">
          <div>
            <p className="eyebrow mb-1">Editorial Desk</p>
            <h2 className="font-serif text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
              {title}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="btn btn-icon hover:bg-surface-hover"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
                <p className="text-sm text-muted-foreground">Loading post data...</p>
              </div>
            </div>
          ) : (
            <EditorialCore mode="editorial" onPostSuccess={handleClose} />
          )}
        </div>
      </div>
    </div>
  );
}
