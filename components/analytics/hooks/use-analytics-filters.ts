"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getConnections } from "@/lib/api/integrations";
import type { Connection } from "@/lib/api/integrations";
import type { TimeRange } from "@/lib/types/analytics";

const STORAGE_KEY = "ezibreezy_analytics_filters";
const DEFAULT_DAYS: TimeRange = 7;

interface UseAnalyticsFiltersReturn {
  integrations: Connection[];
  selectedIntegrationId: string | null;
  setSelectedIntegrationId: (id: string) => void;
  selectedDays: TimeRange;
  setSelectedDays: (days: TimeRange) => void;
  isLoadingIntegrations: boolean;
}

export function useAnalyticsFilters(): UseAnalyticsFiltersReturn {
  const [selectedIntegrationId, setSelectedIntegrationIdState] = useState<
    string | null
  >(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.integrationId || null;
      }
    } catch (error) {
      console.error("[Analytics Filters] Failed to parse localStorage:", error);
    }
    return null;
  });

  const [selectedDays, setSelectedDaysState] = useState<TimeRange>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.days || DEFAULT_DAYS;
      }
    } catch (error) {
      console.error("[Analytics Filters] Failed to parse localStorage:", error);
    }
    return DEFAULT_DAYS;
  });

  const { data: allConnections = [], isLoading: isLoadingIntegrations } =
    useQuery<Connection[]>({
      queryKey: ["connections"],
      queryFn: getConnections,
      staleTime: 10 * 60 * 1000,
    });

  const integrations = allConnections.filter(
    (conn) => conn.platform === "instagram" || conn.platform === "youtube"
  );

  const effectiveIntegrationId = (() => {
    if (selectedIntegrationId) {
      const exists = integrations.find((i) => i.id === selectedIntegrationId);
      if (exists) return selectedIntegrationId;
    }
    if (!isLoadingIntegrations && integrations.length > 0) {
      return integrations[0].id;
    }
    return null;
  })();

  const setSelectedIntegrationId = (id: string) => {
    setSelectedIntegrationIdState(id);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ integrationId: id, days: selectedDays })
    );
  };

  const setSelectedDays = (days: TimeRange) => {
    setSelectedDaysState(days);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ integrationId: effectiveIntegrationId, days })
    );
  };

  return {
    integrations,
    selectedIntegrationId: effectiveIntegrationId,
    setSelectedIntegrationId,
    selectedDays,
    setSelectedDays,
    isLoadingIntegrations,
  };
}
