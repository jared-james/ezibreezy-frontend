// app/(marketing)/tools/social-image-resizer/components/layer-crop-modal.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { X, Check, Loader2, Scissors } from "lucide-react";
import { getCroppedImg } from "../utils/canvas-utils";
import { Layer } from "../client";
import { cn } from "@/lib/utils";

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

interface LayerCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  layer: Layer | null;
  onCropComplete: (newImage: HTMLImageElement) => void;
}

export function LayerCropModal({
  isOpen,
  onClose,
  layer,
  onCropComplete,
}: LayerCropModalProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCrop(undefined);
      setCompletedCrop(undefined);
    }
  }, [isOpen, layer]);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 16 / 9));
  }

  const handleSave = async () => {
    if (completedCrop && imgRef.current && layer) {
      setIsProcessing(true);
      try {
        const newImage = await getCroppedImg(
          imgRef.current,
          completedCrop,
          "cropped.png"
        );
        onCropComplete(newImage);
        onClose();
      } catch (e) {
        console.error(e);
      } finally {
        setIsProcessing(false);
      }
    } else {
      onClose();
    }
  };

  if (!isOpen || !layer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-5xl h-[85vh] flex flex-col bg-background-editorial border-2 border-foreground shadow-[8px_8px_0_0_rgba(0,0,0,1)] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-foreground bg-white">
          <div className="flex items-center gap-3">
            <div className="bg-brand-primary/10 p-2 rounded-md border border-brand-primary/20">
              <Scissors className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold leading-none">
                Crop Image
              </h2>
              <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/50 mt-1">
                Drag handles to adjust visible area
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-hover border border-transparent hover:border-foreground/10 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-8 bg-[#1a1a1a] flex items-center justify-center relative">
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            className="shadow-2xl ring-1 ring-white/20"
          >
            <img
              ref={imgRef}
              alt="Crop source"
              src={layer.image.src}
              className="max-h-[60vh] object-contain block"
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>

        <div className="p-4 border-t-2 border-foreground bg-white flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest border border-foreground/20 hover:bg-surface-hover hover:border-foreground transition-all"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={isProcessing || !completedCrop}
            className={cn(
              "px-6 py-3 bg-brand-primary text-white font-mono text-xs font-bold uppercase tracking-widest border border-transparent shadow-sm flex items-center gap-2 transition-all",
              "hover:bg-foreground hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:-translate-y-0.5",
              "disabled:opacity-50 disabled:pointer-events-none"
            )}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="w-3 h-3" />
                Apply Crop
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
