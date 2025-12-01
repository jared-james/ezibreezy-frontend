// components/calendar/hooks/use-calendar-state.ts

"use client";

import { useState, useCallback } from "react";
import type { CalendarView, CalendarFilters } from "../types";

export function useCalendarState() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeView, setActiveView] = useState<CalendarView>("Month");

  // New Filter State
  const [filters, setFilters] = useState<CalendarFilters>({
    status: "all",
    channel: "all",
    label: "all",
  });

  const [isEditorialModalOpen, setIsEditorialModalOpen] = useState(false);
  const [postIdToEdit, setPostIdToEdit] = useState<string | null>(null);

  const openEditorialModal = useCallback(() => {
    setIsEditorialModalOpen(true);
  }, []);

  const closeEditorialModal = useCallback(() => {
    setIsEditorialModalOpen(false);
  }, []);

  const updateFilter = useCallback(
    (key: keyof CalendarFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  return {
    // State
    currentDate,
    activeView,
    filters, // Export filters
    isEditorialModalOpen,
    postIdToEdit,

    // Actions
    setCurrentDate,
    setActiveView,
    updateFilter, // Export filter updater
    openEditorialModal,
    closeEditorialModal,
    setPostIdToEdit,
  };
}
