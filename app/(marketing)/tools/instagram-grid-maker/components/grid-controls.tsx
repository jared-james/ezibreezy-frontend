// app/(marketing)/tools/instagram-grid-maker/components/grid-controls.tsx

import { Minus, Plus } from "lucide-react";
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
    <div className="grid grid-cols-2 md:flex md:flex-row gap-4 md:gap-6 w-full md:w-auto">
      {/* Cols Input */}
      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 hidden md:block">
          Grid Cols
        </label>
        <div className="flex items-center w-full h-12">
          <button
            onClick={() => onColumnsChange(Math.max(1, columns - 1))}
            className="h-full w-10 md:w-10 flex-none flex items-center justify-center bg-white border-2 border-r-0 border-foreground hover:bg-surface-hover active:bg-foreground active:text-white transition-colors"
          >
            <Minus className="w-4 h-4" strokeWidth={3} />
          </button>
          <input
            type="number"
            min={1}
            max={3}
            value={columns}
            onChange={(e) => handleInputChange(e, onColumnsChange, 3)}
            className="h-full w-full md:w-14 border-2 border-foreground text-center font-mono text-xl font-bold focus:outline-none focus:bg-surface-hover rounded-none appearance-none"
          />
          <button
            onClick={() => onColumnsChange(Math.min(3, columns + 1))}
            className="h-full w-10 md:w-10 flex-none flex items-center justify-center bg-white border-2 border-l-0 border-foreground hover:bg-surface-hover active:bg-foreground active:text-white transition-colors"
          >
            <Plus className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>
        <span className="md:hidden font-mono text-[10px] uppercase tracking-widest text-foreground/50 text-center">
          Cols
        </span>
      </div>

      {/* Rows Input */}
      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 hidden md:block">
          Grid Rows
        </label>
        <div className="flex items-center w-full h-12">
          <button
            onClick={() => onRowsChange(Math.max(1, rows - 1))}
            className="h-full w-10 md:w-10 flex-none flex items-center justify-center bg-white border-2 border-r-0 border-foreground hover:bg-surface-hover active:bg-foreground active:text-white transition-colors"
          >
            <Minus className="w-4 h-4" strokeWidth={3} />
          </button>
          <input
            type="number"
            min={1}
            max={9}
            value={rows}
            onChange={(e) => handleInputChange(e, onRowsChange, 9)}
            className="h-full w-full md:w-14 border-2 border-foreground text-center font-mono text-xl font-bold focus:outline-none focus:bg-surface-hover rounded-none appearance-none"
          />
          <button
            onClick={() => onRowsChange(Math.min(9, rows + 1))}
            className="h-full w-10 md:w-10 flex-none flex items-center justify-center bg-white border-2 border-l-0 border-foreground hover:bg-surface-hover active:bg-foreground active:text-white transition-colors"
          >
            <Plus className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>
        <span className="md:hidden font-mono text-[10px] uppercase tracking-widest text-foreground/50 text-center">
          Rows
        </span>
      </div>

      {/* Gap Control + Color Pickers */}
      <div className="col-span-2 md:col-auto flex flex-col gap-2 w-full md:w-auto">
        <div className="flex items-center justify-between gap-3">
          <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 flex items-center gap-2">
            Gap Comp.{" "}
            <span className="text-brand-primary font-bold">{gap}%</span>
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

        <div className="h-12 md:h-12 flex items-center px-2 bg-white border-2 border-foreground/10 md:border-transparent rounded-lg md:rounded-none min-w-[140px]">
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={gap}
            onChange={(e) => onGapChange(parseInt(e.target.value))}
            className="w-full h-2 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-brand-primary"
            title="Adjust spacing to account for Instagram profile grid gaps"
          />
        </div>
      </div>
    </div>
  );
}
