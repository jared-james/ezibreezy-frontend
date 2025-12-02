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
    { value: "facebook", label: "Facebook" },
    { value: "youtube", label: "YouTube" },
    { value: "tiktok", label: "TikTok" },
    { value: "threads", label: "Threads" },
    { value: "pinterest", label: "Pinterest" },
  ];

  const labels = [
    { value: "campaign", label: "Campaign" },
    { value: "evergreen", label: "Evergreen" },
    { value: "promo", label: "Promo" },
  ];

  // UPDATED: Increased widths to prevent text cutoff
  // w-[150px] (was 140) and 2xl:w-[170px] (was 160)
  const triggerClasses =
    "h-9 w-[150px] 2xl:w-[170px] rounded-sm border-border bg-surface text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-surface-hover hover:border-border-hover focus:ring-brand-primary";

  return (
    <div className="mb-4 flex flex-col gap-4 border-b border-border pb-4 2xl:mb-6 2xl:flex-row 2xl:items-end 2xl:justify-between 2xl:gap-6 2xl:pb-6">
      {/* SECTION 1: TITLE */}
      <div className="w-full 2xl:w-auto">
        <h1 className="font-serif text-3xl font-bold text-foreground 2xl:text-4xl">
          Content Calendar
        </h1>
      </div>

      {/* CONTROLS CONTAINER */}
      <div className="flex flex-col items-start gap-4 2xl:flex-row 2xl:items-center 2xl:gap-3">
        {/* SECTION 2: VIEW SWITCHER */}
        <div className="flex w-fit items-center justify-center p-1 rounded-sm border-2 border-dashed border-border bg-transparent">
          {(["Month", "Week", "List"] as CalendarView[]).map((view) => (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className={cn(
                "rounded-sm px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all 2xl:px-4",
                activeView === view
                  ? "bg-brand-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-brand-primary hover:bg-brand-primary/5"
              )}
            >
              {view}
            </button>
          ))}
        </div>

        {/* Separator (Only visible on 2xl) */}
        <div className="hidden h-8 w-px bg-border 2xl:block" />

        {/* SECTION 3: FILTERS */}
        <div className="flex flex-wrap gap-2 2xl:flex-nowrap 2xl:gap-3">
          <Select
            value={filters.status}
            onValueChange={(val) => onFilterChange("status", val)}
          >
            <SelectTrigger className={triggerClasses}>
              <div className="flex items-center gap-2 truncate">
                <Layers className="h-3.5 w-3.5 shrink-0" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Drafts</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="sent">Posted</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.channel}
            onValueChange={(val) => onFilterChange("channel", val)}
          >
            <SelectTrigger className={triggerClasses}>
              <div className="flex items-center gap-2 truncate">
                <Monitor className="h-3.5 w-3.5 shrink-0" />
                <SelectValue placeholder="Channel" />
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

          <Select
            value={filters.label}
            onValueChange={(val) => onFilterChange("label", val)}
          >
            <SelectTrigger className={triggerClasses}>
              <div className="flex items-center gap-2 truncate">
                <Tag className="h-3.5 w-3.5 shrink-0" />
                <SelectValue placeholder="Label" />
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
        </div>

        {/* SECTION 4: CREATE POST BUTTON */}
        <div className="w-fit 2xl:w-auto 2xl:ml-2">
          <button
            className="btn btn-primary h-9 shadow-md hover:shadow-lg transition-all active:scale-95"
            onClick={onCreatePost}
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Create Post</span>
          </button>
        </div>
      </div>
    </div>
  );
}
