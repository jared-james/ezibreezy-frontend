// components/workspace/workspace-hydrator.tsx

"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  useWorkspaceStore,
  OrganizationNode,
} from "@/lib/store/workspace-store";

interface WorkspaceHydratorProps {
  structure: OrganizationNode[];
}

/**
 * Workspace Hydrator Component
 *
 * This component synchronizes server-fetched workspace data and URL parameters
 * into the Zustand store. It runs on every page load to ensure the store
 * reflects the current URL state.
 *
 * @param structure - Workspace structure fetched server-side
 */
export function WorkspaceHydrator({ structure }: WorkspaceHydratorProps) {
  const searchParams = useSearchParams();
  const { setStructure, setCurrentWorkspace } = useWorkspaceStore();

  useEffect(() => {
    // 1. Always update structure from server (source of truth)
    if (structure && structure.length > 0) {
      setStructure(structure);
    }

    // 2. Set current workspace from URL parameter
    const workspaceId = searchParams.get("workspaceId");
    if (workspaceId) {
      setCurrentWorkspace(workspaceId);
    }
  }, [structure, searchParams, setStructure, setCurrentWorkspace]);

  // This component renders nothing - it's purely for side effects
  return null;
}
