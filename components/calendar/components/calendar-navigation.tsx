// components/calendar/components/calendar-navigation.tsx

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarNavigationProps {
  headerText: string;
  onNavigate: (direction: "prev" | "next") => void;
}

export default function CalendarNavigation({
  headerText,
  onNavigate,
}: CalendarNavigationProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={() => onNavigate("prev")} className="btn btn-icon">
          <ChevronLeft className="h-4 w-4" />
        </button>

        <h2 className="min-w-[200px] text-center font-serif text-2xl font-bold text-foreground">
          {headerText}
        </h2>

        <button onClick={() => onNavigate("next")} className="btn btn-icon">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
