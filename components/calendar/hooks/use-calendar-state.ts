// components/calendar/hooks/use-calendar-state.ts

"use client";

import { useState, useCallback } from "react";
import type { CalendarView, CalendarFilters, ScheduledPost } from "../types";

export function useCalendarState() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeView, setActiveView] = useState<CalendarView>("Month");

  const [filters, setFilters] = useState<CalendarFilters>({
    status: "all",
    channel: "all",
    label: "all",
  });

  const [isEditorialModalOpen, setIsEditorialModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);

  const openEditorialModal = useCallback(() => {
    setIsEditorialModalOpen(true);
  }, []);

  const closeEditorialModal = useCallback(() => {
    setIsEditorialModalOpen(false);
    setSelectedPost(null);
  }, []);

  const updateFilter = useCallback(
    (key: keyof CalendarFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  return {
    currentDate,
    activeView,
    filters,
    isEditorialModalOpen,
    selectedPost,

    setCurrentDate,
    setActiveView,
    updateFilter,
    openEditorialModal,
    closeEditorialModal,
    setSelectedPost,
  };
}
