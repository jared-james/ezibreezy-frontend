// components/workspace/workspace-query-selector.tsx

"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { toast } from "sonner";

/**
 * Client component that handles ?workspaceId=X query parameters.
 *
 * When a user arrives with a workspaceId in the URL (typically after accepting
 * an invite), this component:
 * 1. Validates the workspace exists in the user's structure
 * 2. Forces a switch to that workspace
 * 3. Cleans up the URL parameter
 *
 * This component renders nothing - it's purely for side effects.
 */
export function WorkspaceQuerySelector() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { structure, currentWorkspace, setCurrentWorkspace } =
    useWorkspaceStore();
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    // Only run once per page load
    if (hasProcessedRef.current) return;

    const workspaceIdFromUrl = searchParams.get("workspaceId");

    // No workspace ID in URL, nothing to do
    if (!workspaceIdFromUrl) {
      hasProcessedRef.current = true;
      return;
    }

    // Wait for structure to be loaded (should be immediate from server prop)
    if (structure.length === 0) {
      console.log("⏳ [WorkspaceQuerySelector] Waiting for structure...");
      return; // Will re-run when structure loads
    }

    // Check if we're already on the correct workspace
    if (currentWorkspace?.id === workspaceIdFromUrl) {
      console.log(
        "✅ [WorkspaceQuerySelector] Already on correct workspace"
      );
      hasProcessedRef.current = true;
      // Clean up URL
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("workspaceId");
      const newUrl = newParams.toString()
        ? `?${newParams.toString()}`
        : window.location.pathname;
      router.replace(newUrl, { scroll: false });
      return;
    }

    // Validate workspace exists in structure
    let workspaceExists = false;
    let workspaceName = "";
    for (const node of structure) {
      const foundWorkspace = node.workspaces.find(
        (w) => w.id === workspaceIdFromUrl
      );
      if (foundWorkspace) {
        workspaceExists = true;
        workspaceName = foundWorkspace.name;
        break;
      }
    }

    if (!workspaceExists) {
      console.error(
        "❌ [WorkspaceQuerySelector] Workspace not found:",
        workspaceIdFromUrl
      );
      toast.error("Workspace not found. You may not have access to it.");
      hasProcessedRef.current = true;
      // Clean up invalid workspace ID from URL
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("workspaceId");
      const newUrl = newParams.toString()
        ? `?${newParams.toString()}`
        : window.location.pathname;
      router.replace(newUrl, { scroll: false });
      return;
    }

    // FORCE SWITCH to the workspace from URL
    console.log(
      `🔄 [WorkspaceQuerySelector] Switching to workspace: ${workspaceName} (${workspaceIdFromUrl})`
    );
    setCurrentWorkspace(workspaceIdFromUrl);
    hasProcessedRef.current = true;

    // Clean up URL after processing
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("workspaceId");
    const newUrl = newParams.toString()
      ? `?${newParams.toString()}`
      : window.location.pathname;
    router.replace(newUrl, { scroll: false });

    // Note: toast for invite success is handled by InviteToast component
  }, [searchParams, structure, currentWorkspace, setCurrentWorkspace, router]);

  // This component renders nothing, it's just for side effects
  return null;
}
