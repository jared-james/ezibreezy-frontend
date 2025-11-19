// app/(app)/calendar/components/editorial-modal.tsx

"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import EditorialCore from "@/app/(app)/editorial/components/editorial-core";
import { useEditorialStore } from "@/lib/store/editorial-store";
import type { EditorialDraft } from "@/lib/types/editorial";

interface EditorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDraft?: Partial<EditorialDraft>;
  title?: string;
}

export default function EditorialModal({
  isOpen,
  onClose,
  initialDraft,
  title = "Create New Post",
}: EditorialModalProps) {
  const setDraft = useEditorialStore((state) => state.setDraft);

  useEffect(() => {
    if (isOpen && initialDraft) {
      setDraft(initialDraft as EditorialDraft);
    }
  }, [isOpen, initialDraft, setDraft]);

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
            onClick={onClose}
            className="btn btn-icon hover:bg-surface-hover"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <EditorialCore onPostSuccess={onClose} />
        </div>
      </div>
    </div>
  );
}
