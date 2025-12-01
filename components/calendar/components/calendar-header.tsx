// components/calendar/components/calendar-header.tsx

"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalendarView } from "../types";

interface CalendarHeaderProps {
  activeView: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onCreatePost: () => void;
}

export default function CalendarHeader({
  activeView,
  onViewChange,
  onCreatePost,
}: CalendarHeaderProps) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-6 border-b-4 border-double border-foreground pb-6 md:flex-row md:items-end">
      <div>
        <p className="eyebrow mb-2">The Schedule</p>
        <h1 className="font-serif text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
          Content Calendar
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-border bg-surface p-1 shadow-sm">
          {(["Month", "Week", "List"] as CalendarView[]).map((view) => (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all",
                activeView === view
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
              )}
            >
              {view}
            </button>
          ))}
        </div>

        <button className="btn btn-primary" onClick={onCreatePost}>
          <Plus className="h-4 w-4" />
          Create Post
        </button>
      </div>
    </div>
  );
}
