// components/calendar/hooks/use-calendar-navigation.ts

"use client";

import { useCallback } from "react";
import { addDays, format } from "date-fns";
import type { CalendarView } from "../types";

interface UseCalendarNavigationProps {
  currentDate: Date;
  activeView: CalendarView;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
}

export function useCalendarNavigation({
  currentDate,
  activeView,
  setCurrentDate,
}: UseCalendarNavigationProps) {
  const navigateDate = useCallback(
    (direction: "prev" | "next") => {
      const amount = direction === "next" ? 1 : -1;
      if (activeView === "Month" || activeView === "List") {
        setCurrentDate((current) => {
          const newDate = new Date(current);
          newDate.setMonth(current.getMonth() + amount);
          return newDate;
        });
      } else {
        setCurrentDate((current) => addDays(current, amount * 7));
      }
    },
    [activeView, setCurrentDate]
  );

  const getHeaderText = useCallback(() => {
    if (activeView === "Month" || activeView === "List") {
      return format(currentDate, "MMMM yyyy");
    }
    return `Week of ${format(currentDate, "MMM d")}`;
  }, [activeView, currentDate]);

  return {
    navigateDate,
    getHeaderText,
  };
}
