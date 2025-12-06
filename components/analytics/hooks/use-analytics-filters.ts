// components/analytics/hooks/use-analytics-filters.ts

"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Instagram, Youtube } from "lucide-react";
import { useParams } from "next/navigation";
import type { Connection } from "@/lib/api/integrations";
import { getConnectionsAction } from "@/app/actions/integrations";
import type {
  TimeRange,
  AnalyticsPlatform,
  Account,
  AnalyticsFilters,
  AccountStatus,
} from "@/lib/types/analytics";

const STORAGE_KEY = "ezibreezy_analytics_filters";
const DEFAULT_DAYS: TimeRange = 7;

interface UseAnalyticsFiltersReturn {
  integrations: Connection[];
  platforms: AnalyticsPlatform[];
  selectedAccounts: Record<string, string[]>;
  activeAccountId: string | null;
  selectedDays: TimeRange;
  togglePlatform: (platformId: string) => void;
  setSingleAccount: (platformId: string, accountId: string) => void;
  toggleAccount: (platformId: string, accountId: string) => void;
  setSelectedDays: (days: TimeRange) => void;
  isLoadingIntegrations: boolean;
}

function mapBackendStatus(connection: any): AccountStatus {
  const statusObj = connection.analyticsStatus as
    | Record<string, any>
    | undefined;

  if (!statusObj) return "active";

  if (statusObj.status === "error") return "error";
  if (connection.requiresReauth) return "reauth_required";

  return "active";
}

function getErrorMessage(connection: any): string | undefined {
  const statusObj = connection.analyticsStatus as
    | Record<string, any>
    | undefined;
  if (connection.requiresReauth)
    return "Authentication expired. Please reconnect.";
  return statusObj?.message;
}

function migrateOldFormat(
  stored: unknown,
  allConnections: Connection[]
): AnalyticsFilters | null {
  if (!stored || typeof stored !== "object") return null;

  const storedObj = stored as Record<string, unknown>;

  if (storedObj.version === 2 && storedObj.selectedAccounts) {
    return stored as AnalyticsFilters;
  }

  if (storedObj.integrationId && !storedObj.selectedAccounts) {
    const connection = allConnections.find(
      (c) => c.id === storedObj.integrationId
    );
    if (connection) {
      return {
        selectedAccounts: {},
        activeAccountId: null,
        days: (storedObj.days as TimeRange) || DEFAULT_DAYS,
        version: 2,
      };
    }
  }

  return null;
}

export function useAnalyticsFilters(): UseAnalyticsFiltersReturn {
  const params = useParams();
  const workspaceId = params.workspace as string;

  const { data: allConnections = [], isLoading: isLoadingIntegrations } =
    useQuery<Connection[]>({
      queryKey: ["connections", workspaceId],
      queryFn: async () => {
        const result = await getConnectionsAction(workspaceId);
        if (!result.success) throw new Error(result.error);
        return result.data!;
      },
      staleTime: 10 * 60 * 1000,
    });

  const integrations = allConnections.filter(
    (conn) => conn.platform === "instagram" || conn.platform === "youtube"
  );

  const platforms = useMemo((): AnalyticsPlatform[] => {
    const connectionsByPlatform = integrations.reduce((acc, conn) => {
      acc[conn.platform] = acc[conn.platform] || [];
      acc[conn.platform].push(conn);
      return acc;
    }, {} as Record<string, Connection[]>);

    return [
      {
        id: "instagram",
        name: "Instagram",
        icon: Instagram,
        accounts: (connectionsByPlatform["instagram"] || []).map(
          (conn): Account => ({
            id: conn.id,
            name: conn.name || `@${conn.platformUsername}`,
            img: conn.avatarUrl || "/placeholder-pfp.png",
            status: mapBackendStatus(conn),
            errorMessage: getErrorMessage(conn),
          })
        ),
      },
      {
        id: "youtube",
        name: "YouTube",
        icon: Youtube,
        accounts: (connectionsByPlatform["youtube"] || []).map(
          (conn): Account => ({
            id: conn.id,
            name: conn.name || `@${conn.platformUsername}`,
            img: conn.avatarUrl || "/placeholder-pfp.png",
            status: mapBackendStatus(conn),
            errorMessage: getErrorMessage(conn),
          })
        ),
      },
    ];
  }, [integrations]);

  const [selectedAccounts, setSelectedAccountsState] = useState<
    Record<string, string[]>
  >(() => {
    if (typeof window === "undefined") return {};

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const migrated = migrateOldFormat(parsed, allConnections);
        if (migrated) {
          return migrated.selectedAccounts;
        }
      }
    } catch (error) {
      console.error(error);
    }
    return {};
  });

  const [activeAccountId, setActiveAccountIdState] = useState<string | null>(
    () => {
      if (typeof window === "undefined") return null;

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const migrated = migrateOldFormat(parsed, allConnections);
          if (migrated) {
            return migrated.activeAccountId;
          }
        }
      } catch (error) {
        console.error(error);
      }
      return null;
    }
  );

  const [selectedDays, setSelectedDaysState] = useState<TimeRange>(() => {
    if (typeof window === "undefined") return DEFAULT_DAYS;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.days || DEFAULT_DAYS;
      }
    } catch (error) {
      console.error(error);
    }
    return DEFAULT_DAYS;
  });

  const persistToLocalStorage = (state: {
    selectedAccounts: Record<string, string[]>;
    activeAccountId: string | null;
    days: TimeRange;
  }) => {
    if (typeof window === "undefined") return;

    try {
      const data: AnalyticsFilters = {
        selectedAccounts: state.selectedAccounts,
        activeAccountId: state.activeAccountId,
        days: state.days,
        version: 2,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  };

  const togglePlatform = (platformId: string) => {
    const platform = platforms.find((p) => p.id === platformId);
    if (!platform || platform.accounts.length === 0) return;

    const currentSelection = selectedAccounts[platformId] || [];
    const allIds = platform.accounts.map((a) => a.id);

    let newSelectionForPlatform: string[] = [];

    if (currentSelection.length > 0) {
      newSelectionForPlatform = [];
    } else {
      newSelectionForPlatform = allIds;
    }

    const newSelected = {
      ...selectedAccounts,
      [platformId]: newSelectionForPlatform,
    };

    setSelectedAccountsState(newSelected);
    persistToLocalStorage({
      selectedAccounts: newSelected,
      activeAccountId,
      days: selectedDays,
    });
  };

  const setSingleAccount = (platformId: string, accountId: string) => {
    const newSelected = { ...selectedAccounts, [platformId]: [accountId] };

    setSelectedAccountsState(newSelected);
    setActiveAccountIdState(accountId);

    persistToLocalStorage({
      selectedAccounts: newSelected,
      activeAccountId: accountId,
      days: selectedDays,
    });
  };

  const toggleAccount = (platformId: string, accountId: string) => {
    const currentSelection = selectedAccounts[platformId] || [];
    let newSelection: string[];

    if (currentSelection.includes(accountId)) {
      newSelection = currentSelection.filter((id) => id !== accountId);
    } else {
      newSelection = [...currentSelection, accountId];
    }

    const newSelected = { ...selectedAccounts, [platformId]: newSelection };

    setSelectedAccountsState(newSelected);
    persistToLocalStorage({
      selectedAccounts: newSelected,
      activeAccountId,
      days: selectedDays,
    });
  };

  const setSelectedDays = (days: TimeRange) => {
    setSelectedDaysState(days);
    persistToLocalStorage({
      selectedAccounts,
      activeAccountId,
      days,
    });
  };

  return {
    integrations,
    platforms,
    selectedAccounts,
    activeAccountId,
    selectedDays,
    togglePlatform,
    setSingleAccount,
    toggleAccount,
    setSelectedDays,
    isLoadingIntegrations,
  };
}
