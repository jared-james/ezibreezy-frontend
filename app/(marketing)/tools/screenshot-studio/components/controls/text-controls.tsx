// app/(marketing)/tools/screenshot-studio/components/controls/text-controls.tsx

import { Type } from "lucide-react";
import { TextLayer } from "../../constants";

interface TextControlsProps {
  textLayer: TextLayer;
  setTextLayer: (layer: TextLayer) => void;
}

export function TextControls({ textLayer, setTextLayer }: TextControlsProps) {
  return (
    <div className="space-y-4">
      <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 flex items-center gap-2">
        <Type className="w-3 h-3" />
        Text Overlay
      </label>

      <div className="space-y-3">
        <input
          type="text"
          value={textLayer.text}
          onChange={(e) => setTextLayer({ ...textLayer, text: e.target.value })}
          placeholder="Add a title or caption..."
          className="w-full bg-white border border-foreground/20 p-2 font-serif text-sm focus:outline-none focus:border-brand-primary placeholder:text-foreground/30 rounded-md"
        />

        {textLayer.text && (
          <div className="space-y-3 p-3 bg-white/50 border border-dashed border-foreground/20 rounded-md">
            <div className="flex gap-2 items-center">
              <div className="relative w-8 h-8 border border-foreground/20 overflow-hidden cursor-pointer shrink-0 rounded">
                <input
                  type="color"
                  value={textLayer.color}
                  onChange={(e) =>
                    setTextLayer({ ...textLayer, color: e.target.value })
                  }
                  className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 p-0 cursor-pointer"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center gap-1">
                <input
                  type="range"
                  min="20"
                  max="400"
                  value={textLayer.fontSize}
                  onChange={(e) =>
                    setTextLayer({
                      ...textLayer,
                      fontSize: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-1 bg-foreground/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-brand-primary [&::-webkit-slider-thumb]:rounded-full"
                />
                <span className="text-[9px] font-mono text-foreground/40">
                  Size: {textLayer.fontSize}px
                </span>
              </div>
            </div>

            <select
              value={textLayer.fontFamily}
              onChange={(e) =>
                setTextLayer({ ...textLayer, fontFamily: e.target.value })
              }
              className="w-full bg-white border border-foreground/20 p-2 text-xs font-mono focus:outline-none focus:border-brand-primary rounded-md"
            >
              <option value="serif">Serif (Classic)</option>
              <option value="sans-serif">Sans Serif (Modern)</option>
              <option value="monospace">Monospace (Code)</option>
              <option value="'Instrument Serif', serif">
                Instrument Serif
              </option>
              <option value="'Times New Roman', serif">Times New Roman</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="'Courier New', monospace">Courier New</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="Helvetica, sans-serif">Helvetica</option>
              <option value="'Arial Black', sans-serif">Arial Black</option>
              <option value="Impact, sans-serif">Impact</option>
              <option value="'Comic Sans MS', cursive">Comic Sans</option>
              <option value="'Brush Script MT', cursive">Brush Script</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
