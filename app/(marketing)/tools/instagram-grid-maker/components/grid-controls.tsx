// app/(marketing)/tools/instagram-grid-maker/components/grid-controls.tsx

import { Minus, Plus } from "lucide-react";

interface GridControlsProps {
  columns: number;
  rows: number;
  gap: number;
  onColumnsChange: (cols: number) => void;
  onRowsChange: (rows: number) => void;
  onGapChange: (gap: number) => void;
}

export function GridControls({
  columns,
  rows,
  gap,
  onColumnsChange,
  onRowsChange,
  onGapChange,
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

      <div className="col-span-2 md:col-auto flex flex-col gap-2 w-full md:w-32">
        <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 flex items-center justify-between">
          <span>Gap Comp.</span>
          <span className="text-brand-primary font-bold">{gap}%</span>
        </label>
        <div className="h-12 md:h-12 flex items-center px-2 bg-white border-2 border-foreground/10 md:border-transparent rounded-lg md:rounded-none">
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
