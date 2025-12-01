// components/calendar/components/calendar-header.tsx

"use client";

import { Plus, Tag, Monitor, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalendarView, CalendarFilters } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CalendarHeaderProps {
  activeView: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onCreatePost: () => void;
  filters: CalendarFilters;
  onFilterChange: (key: keyof CalendarFilters, value: string) => void;
}

export default function CalendarHeader({
  activeView,
  onViewChange,
  onCreatePost,
  filters,
  onFilterChange,
}: CalendarHeaderProps) {
  const channels = [
    { value: "x", label: "X (Twitter)" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "instagram", label: "Instagram" },
  ];

  const labels = [
    { value: "campaign", label: "Campaign" },
    { value: "evergreen", label: "Evergreen" },
    { value: "promo", label: "Promo" },
  ];

  // Styling to match the "btn" aesthetic from globals.css and previous requests
  const triggerClasses =
    "h-9 w-[160px] rounded-sm border-border bg-surface text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-surface-hover hover:border-border-hover focus:ring-brand-primary";

  return (
    <div className="mb-6 flex flex-col justify-between gap-6 border-b border-border pb-6 xl:flex-row xl:items-end">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
          Content Calendar
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Dotted Aesthetic View Switcher */}
        <div className="flex items-center p-1 rounded-sm border-2 border-dashed border-border bg-transparent">
          {(["Month", "Week", "List"] as CalendarView[]).map((view) => (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className={cn(
                "rounded-sm px-4 py-1 text-xs font-bold uppercase tracking-wider transition-all",
                activeView === view
                  ? "bg-brand-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-brand-primary hover:bg-brand-primary/5"
              )}
            >
              {view}
            </button>
          ))}
        </div>

        <div className="hidden h-8 w-px bg-border sm:block" />

        {/* Status Filter */}
        <Select
          value={filters.status}
          onValueChange={(val) => onFilterChange("status", val)}
        >
          <SelectTrigger className={triggerClasses}>
            <div className="flex items-center gap-2 truncate">
              <Layers className="h-3.5 w-3.5 shrink-0" />
              <SelectValue placeholder="All Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Drafts</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="sent">Posted</SelectItem>
          </SelectContent>
        </Select>

        {/* Channel Filter */}
        <Select
          value={filters.channel}
          onValueChange={(val) => onFilterChange("channel", val)}
        >
          <SelectTrigger className={triggerClasses}>
            <div className="flex items-center gap-2 truncate">
              <Monitor className="h-3.5 w-3.5 shrink-0" />
              <SelectValue placeholder="All Channels" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            {channels.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Label Filter */}
        <Select
          value={filters.label}
          onValueChange={(val) => onFilterChange("label", val)}
        >
          <SelectTrigger className={triggerClasses}>
            <div className="flex items-center gap-2 truncate">
              <Tag className="h-3.5 w-3.5 shrink-0" />
              <SelectValue placeholder="All Labels" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Labels</SelectItem>
            {labels.map((l) => (
              <SelectItem key={l.value} value={l.value}>
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Create Post Button */}
        <button
          className="btn btn-primary h-9 ml-2 shadow-md hover:shadow-lg transition-all active:scale-95"
          onClick={onCreatePost}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden md:inline">Create Post</span>
        </button>
      </div>
    </div>
  );
}
