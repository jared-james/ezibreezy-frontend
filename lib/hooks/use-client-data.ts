// lib/hooks/use-client-data.ts

"use client";

import { useQuery } from "@tanstack/react-query";
import { getClientDataForEditor } from "@/app/actions/data";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { useEffect } from "react";

export function useClientData() {
  const { data, isLoading } = useQuery({
    queryKey: ["clientEditorData"],
    queryFn: getClientDataForEditor,
    staleTime: Infinity,
  });

  const { currentWorkspace, setCurrentWorkspace, structure } =
    useWorkspaceStore();

  // Initialize workspace from server data on first load
  useEffect(() => {
    // Only initialize if:
    // 1. We have data with a default workspace ID
    // 2. We don't already have a workspace selected
    // 3. Structure is loaded (to ensure setCurrentWorkspace can validate)
    if (
      data?.defaultWorkspaceId &&
      !currentWorkspace &&
      structure.length > 0
    ) {
      console.log(
        "🔵 [useClientData] Initializing workspace:",
        data.defaultWorkspaceId
      );
      // FIX: Pass workspace ID string, not object
      // setCurrentWorkspace expects a string ID and looks it up in the structure
      setCurrentWorkspace(data.defaultWorkspaceId);
    }
  }, [data, currentWorkspace, setCurrentWorkspace, structure]);

  return {
    organizationId: data?.organizationId || null,
    userId: data?.userId || null,
    workspaceId: currentWorkspace?.id || null,
    connections: data?.connections || [],
    isLoading,
  };
}
