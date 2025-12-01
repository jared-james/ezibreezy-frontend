// components/post-editor/modals/media-source-modal.tsx

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FolderOpen } from "lucide-react";

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center font-serif">
            Add Media
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center gap-4 h-32 hover:bg-muted/50 hover:border-brand-primary/50 transition-all"
            onClick={() => {
              onUploadClick();
              onClose();
            }}
          >
            <div className="p-3 rounded-full bg-brand-primary/10 text-brand-primary">
              <Upload className="h-6 w-6" />
            </div>
            <span className="font-semibold">Upload from Device</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-center justify-center gap-4 h-32 hover:bg-muted/50 hover:border-brand-primary/50 transition-all"
            onClick={() => {
              onLibraryClick();
              onClose();
            }}
          >
            <div className="p-3 rounded-full bg-brand-primary/10 text-brand-primary">
              <FolderOpen className="h-6 w-6" />
            </div>
            <span className="font-semibold">Browse Library</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
