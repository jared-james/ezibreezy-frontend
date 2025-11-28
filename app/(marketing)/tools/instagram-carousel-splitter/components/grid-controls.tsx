// app/(marketing)/tools/instagram-carousel-splitter/components/grid-controls.tsx

// app/(marketing)/tools/instagram-grid-maker/components/grid-controls.tsx

import {
  Minus,
  Plus,
  Grid3X3,
  ArrowUpDown,
  ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GridControlsProps {
  columns: number;
  rows: number;
  gap: number;
  gapColor: string;
  onColumnsChange: (cols: number) => void;
  onRowsChange: (rows: number) => void;
  onGapChange: (gap: number) => void;
  onGapColorChange: (color: string) => void;
}

const GAP_COLORS = [
  { label: "White", value: "#FFFFFF", tailwind: "bg-white border-gray-200" },
  { label: "Red", value: "#EF4444", tailwind: "bg-red-500 border-red-600" },
  { label: "Blue", value: "#3B82F6", tailwind: "bg-blue-500 border-blue-600" },
  {
    label: "Green",
    value: "#22C55E",
    tailwind: "bg-green-500 border-green-600",
  },
];

export function GridControls({
  columns,
  rows,
  gap,
  gapColor,
  onColumnsChange,
  onRowsChange,
  onGapChange,
  onGapColorChange,
}: GridControlsProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: number) => void,
    max: number
  ) => {
    const value = Math.min(max, Math.max(1, parseInt(e.target.value) || 1));
    setter(value);
  };

  return (
    <div className="grid grid-cols-1 md:flex md:flex-row gap-6 md:gap-12 w-full md:w-auto items-end">
      {/* Columns Input */}
      <div className="flex flex-col gap-3 w-full md:w-auto">
        <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 flex items-center gap-2">
          <ArrowLeftRight className="w-3 h-3" />
          Grid Cols
        </label>

        <div className="flex items-center w-full h-12">
          <button
            onClick={() => onColumnsChange(Math.max(1, columns - 1))}
            className="h-full w-12 flex-none flex items-center justify-center border border-dashed border-foreground/30 hover:border-foreground hover:bg-foreground/5 active:bg-foreground/10 transition-all"
            aria-label="Decrease columns"
          >
            <Minus className="w-4 h-4" strokeWidth={1.5} />
          </button>

          <div className="h-full w-16 border-y border-dashed border-foreground/30 flex items-center justify-center bg-background-editorial/50">
            <input
              type="number"
              min={1}
              max={3}
              value={columns}
              onChange={(e) => handleInputChange(e, onColumnsChange, 3)}
              className="w-full text-center font-mono text-xl font-bold bg-transparent focus:outline-none appearance-none p-0"
            />
          </div>

          <button
            onClick={() => onColumnsChange(Math.min(3, columns + 1))}
            className="h-full w-12 flex-none flex items-center justify-center border border-dashed border-foreground/30 hover:border-foreground hover:bg-foreground/5 active:bg-foreground/10 transition-all"
            aria-label="Increase columns"
          >
            <Plus className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Rows Input */}
      <div className="flex flex-col gap-3 w-full md:w-auto">
        <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 flex items-center gap-2">
          <ArrowUpDown className="w-3 h-3" />
          Grid Rows
        </label>

        <div className="flex items-center w-full h-12">
          <button
            onClick={() => onRowsChange(Math.max(1, rows - 1))}
            className="h-full w-12 flex-none flex items-center justify-center border border-dashed border-foreground/30 hover:border-foreground hover:bg-foreground/5 active:bg-foreground/10 transition-all"
            aria-label="Decrease rows"
          >
            <Minus className="w-4 h-4" strokeWidth={1.5} />
          </button>

          <div className="h-full w-16 border-y border-dashed border-foreground/30 flex items-center justify-center bg-background-editorial/50">
            <input
              type="number"
              min={1}
              max={9}
              value={rows}
              onChange={(e) => handleInputChange(e, onRowsChange, 9)}
              className="w-full text-center font-mono text-xl font-bold bg-transparent focus:outline-none appearance-none p-0"
            />
          </div>

          <button
            onClick={() => onRowsChange(Math.min(9, rows + 1))}
            className="h-full w-12 flex-none flex items-center justify-center border border-dashed border-foreground/30 hover:border-foreground hover:bg-foreground/5 active:bg-foreground/10 transition-all"
            aria-label="Increase rows"
          >
            <Plus className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Gap Control - Styled as a technical slider */}
      <div className="col-span-1 md:col-auto flex flex-col gap-3 w-full md:w-40">
        <div className="flex items-center justify-between gap-3">
          <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 flex items-center gap-2">
            <Grid3X3 className="w-3 h-3" />
            Gap Comp.{" "}
            <span className="text-brand-primary font-bold bg-brand-primary/10 px-1 rounded">
              {gap}%
            </span>
          </label>

          {/* Color Pickers */}
          <div className="flex gap-2 pr-1">
            {GAP_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => onGapColorChange(c.value)}
                className={cn(
                  "w-4 h-4 rounded-full border shadow-sm transition-all hover:scale-110",
                  c.tailwind,
                  gapColor === c.value
                    ? "ring-2 ring-offset-1 ring-foreground scale-110"
                    : ""
                )}
                title={c.label}
                aria-label={`Set gap color to ${c.label}`}
              />
            ))}
          </div>
        </div>

        <div className="h-12 flex items-center px-4 border border-dashed border-foreground/30 bg-background-editorial/30 relative">
          {/* Custom Track Lines to look like a ruler */}
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-px bg-foreground/20 pointer-events-none">
            <div className="w-full flex justify-between">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="w-px h-2 bg-foreground/40 -translate-y-1/2"
                />
              ))}
            </div>
          </div>

          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={gap}
            onChange={(e) => onGapChange(parseInt(e.target.value))}
            className="w-full relative z-10 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-brand-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
            title="Adjust spacing to account for Instagram profile grid gaps"
          />
        </div>
      </div>
    </div>
  );
}
