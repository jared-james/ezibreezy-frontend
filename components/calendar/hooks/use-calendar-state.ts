// components/calendar/hooks/use-calendar-state.ts

"use client";

import { useState, useCallback } from "react";
import type { CalendarView } from "../types";

export function useCalendarState() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeView, setActiveView] = useState<CalendarView>("Month");
  const [isEditorialModalOpen, setIsEditorialModalOpen] = useState(false);
  const [postIdToEdit, setPostIdToEdit] = useState<string | null>(null);

  const openEditorialModal = useCallback(() => {
    setIsEditorialModalOpen(true);
  }, []);

  const closeEditorialModal = useCallback(() => {
    setIsEditorialModalOpen(false);
  }, []);

  return {
    // State
    currentDate,
    activeView,
    isEditorialModalOpen,
    postIdToEdit,

    // Actions
    setCurrentDate,
    setActiveView,
    openEditorialModal,
    closeEditorialModal,
    setPostIdToEdit,
  };
}
