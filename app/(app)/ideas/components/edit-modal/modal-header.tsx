// app/(app)/ideas/components/edit-modal/modal-header.tsx

"use client";

import { X } from "lucide-react";

interface ModalHeaderProps {
  idea: { title: string };
  onClose: () => void;
}

export default function ModalHeader({ idea, onClose }: ModalHeaderProps) {
  return (
    <div className="z-10 bg-white border-b-4 border-double border-[--foreground] p-6 flex items-center justify-between flex-shrink-0">
      <div>
        <p className="eyebrow mb-1">Edit Clipping</p>
        <h2 className="font-serif text-2xl md:text-3xl font-bold uppercase tracking-tight text-[--foreground]">
          {idea.title}
        </h2>
      </div>
      <button
        onClick={onClose}
        className="btn btn-icon hover:bg-[--surface-hover]"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
