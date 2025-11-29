// app/(marketing)/tools/social-image-resizer/components/file-upload.tsx

import { Upload, ImageIcon, ScanLine } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file.");
        return;
      }
      onFileSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
      {/* Background decoration: Crosshairs */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] flex items-center justify-center">
        <div className="w-full h-px bg-foreground" />
        <div className="h-full w-px bg-foreground absolute" />
      </div>

      <div className="w-full max-w-md mb-8 flex items-center gap-4 text-foreground/40">
        <ScanLine className="h-4 w-4" />
        <div className="flex-1 border-b border-dashed border-foreground/30" />
        <span className="font-mono text-[10px] uppercase tracking-widest">
          Source Asset
        </span>
      </div>

      <div
        className="group relative w-full max-w-xl cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div
          className={cn(
            "relative border-2 border-dashed border-foreground/30 bg-background-editorial p-10 md:p-16 text-center transition-all duration-300",
            "group-hover:border-foreground group-hover:bg-white group-hover:shadow-[4px_4px_0_0_rgba(0,0,0,0.05)]"
          )}
        >
          {/* Technical Corner Marks */}
          <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-foreground/40 transition-colors group-hover:border-foreground" />
          <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-foreground/40 transition-colors group-hover:border-foreground" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-foreground/40 transition-colors group-hover:border-foreground" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-foreground/40 transition-colors group-hover:border-foreground" />

          {/* Icon Area */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="rounded-full p-6 border border-dashed border-foreground/30 group-hover:border-foreground/60 transition-colors bg-surface-hover/50">
                <Upload className="w-8 h-8 text-foreground/60 group-hover:text-foreground group-hover:scale-110 transition-all duration-300" />
              </div>
              <div className="absolute -right-2 -bottom-2 bg-brand-primary text-white p-1.5 shadow-sm">
                <ImageIcon className="w-3 h-3" />
              </div>
            </div>
          </div>

          <h3 className="font-serif text-3xl font-bold mb-3 text-foreground tracking-tight">
            Upload Master Image
          </h3>

          <p className="font-mono text-xs uppercase tracking-widest text-foreground/50 mb-8 group-hover:text-brand-primary transition-colors">
            Or Drag & Drop Here
          </p>

          <div className="inline-flex items-center gap-2 border-b border-foreground text-foreground pb-0.5 font-mono text-xs font-bold uppercase tracking-wider hover:text-brand-primary hover:border-brand-primary transition-colors">
            Select High-Res File
          </div>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
      />
    </div>
  );
}
