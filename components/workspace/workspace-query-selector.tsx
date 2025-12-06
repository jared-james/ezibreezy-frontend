// components/workspace/workspace-query-selector.tsx

"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { toast } from "sonner";

/**
 * Handles the legacy ?workspaceId=X query param for backward compatibility.
 * New links should use ?workspace=slug instead.
 *
 * - Validates the workspace exists
 * - Switches to that workspace
 * - Removes the query param from the URL
 *
 * This component renders nothing — it performs side effects only.
 */
export function WorkspaceQuerySelector() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { structure, currentWorkspace, setCurrentWorkspace } =
    useWorkspaceStore();
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    if (hasProcessedRef.current) return;

    // Support both legacy workspaceId and new workspace param
    const workspaceFromUrl = searchParams.get("workspace") || searchParams.get("workspaceId");

    if (!workspaceFromUrl) {
      hasProcessedRef.current = true;
      return;
    }

    // Wait until workspace structure is available
    if (structure.length === 0) {
      return; // Re-run when structure becomes available
    }

    // Already on the correct workspace → just clean the URL
    if (
      currentWorkspace?.id === workspaceFromUrl ||
      currentWorkspace?.slug === workspaceFromUrl
    ) {
      hasProcessedRef.current = true;
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("workspace");
      newParams.delete("workspaceId"); // Clean legacy param
      const newUrl = newParams.toString()
        ? `?${newParams.toString()}`
        : window.location.pathname;
      router.replace(newUrl, { scroll: false });
      return;
    }

    // Validate workspace ID/slug exists in structure
    let workspaceExists = false;
    for (const node of structure) {
      if (
        node.workspaces.some(
          (w) => w.id === workspaceFromUrl || w.slug === workspaceFromUrl
        )
      ) {
        workspaceExists = true;
        break;
      }
    }

    if (!workspaceExists) {
      toast.error("Workspace not found. You may not have access to it.");
      hasProcessedRef.current = true;

      // Remove invalid workspace from URL
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("workspace");
      newParams.delete("workspaceId"); // Clean legacy param
      const newUrl = newParams.toString()
        ? `?${newParams.toString()}`
        : window.location.pathname;
      router.replace(newUrl, { scroll: false });
      return;
    }

    // Force switch to the workspace
    setCurrentWorkspace(workspaceFromUrl);
    hasProcessedRef.current = true;

    // Clean up URL
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("workspace");
    newParams.delete("workspaceId"); // Clean legacy param
    const newUrl = newParams.toString()
      ? `?${newParams.toString()}`
      : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  }, [searchParams, structure, currentWorkspace, setCurrentWorkspace, router]);

  return null;
}
