// components/post-editor/modals/media-source-modal.tsx

"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Upload, FolderOpen, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadClick: () => void;
  onLibraryClick: () => void;
}

export default function MediaSourceModal({
  isOpen,
  onClose,
  onUploadClick,
  onLibraryClick,
}: MediaSourceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="
          sm:max-w-2xl 
          bg-[#fdfbf7] 
          border border-black/10
          shadow-xl
          p-0 
          gap-0
          overflow-hidden
        "
      >
        {/* Header */}
        <div className="flex flex-col gap-1 px-8 py-6 bg-white/50 border-b border-black/5">
          <span className="font-serif text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Media Import
          </span>
          <DialogTitle className="font-serif text-3xl font-medium tracking-tight text-foreground">
            Add Media
          </DialogTitle>
        </div>

        {/* Body */}
        <div className="p-8 sm:p-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <DashedSelectionCard
              icon={<Upload className="h-8 w-8" />}
              label="Upload Device"
              onClick={() => {
                onUploadClick();
                onClose();
              }}
            />

            <DashedSelectionCard
              icon={<FolderOpen className="h-8 w-8" />}
              label="Browse Media Room"
              onClick={() => {
                onLibraryClick();
                onClose();
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Sub-component: The Dashed "Ghost" Card
function DashedSelectionCard({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center justify-center text-center",
        "w-full h-full min-h-[220px] rounded-lg",
        // Default State: Dotted Gray Border
        "border-2 border-dashed border-black/20 bg-transparent",
        // Hover State: Solid Brand Green Border + Slight Green Tint Background
        "hover:border-brand-primary hover:bg-brand-primary/[0.03] hover:shadow-sm",
        "transition-all duration-300 ease-out"
      )}
    >
      {/* Icon Circle */}
      <div className="mb-5 p-4 rounded-full bg-black/5 text-black/60 group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
        {icon}
      </div>

      {/* Typography */}
      <h3 className="font-serif text-xl font-medium text-foreground group-hover:text-brand-primary transition-colors duration-300">
        {label}
      </h3>

      {/* Subtle Arrow Fade-in on Hover (Green) */}
      <div className="absolute bottom-4 opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
        <ArrowRight className="w-4 h-4 text-brand-primary" />
      </div>
    </button>
  );
}
