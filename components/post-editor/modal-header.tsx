// components/post-editor/modal-header.tsx

"use client";

import { X } from "lucide-react";

interface ModalHeaderProps {
  idea: { title: string };
  onClose: () => void;
}

export default function ModalHeader({ idea, onClose }: ModalHeaderProps) {
  console.log('[PERF] ModalHeader render');

  return (
    <div className="z-10 flex shrink-0 items-center justify-between border-b-4 border-foreground border-double bg-surface p-6">
      <div>
        <p className="eyebrow mb-1">Edit Clipping</p>
        <h2 className="font-serif text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
          {idea.title}
        </h2>
      </div>
      <button onClick={onClose} className="btn btn-icon hover:bg-surface-hover">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
