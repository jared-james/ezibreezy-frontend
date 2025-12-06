// components/settings/workspace/hooks/use-workspace-form.ts

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import {
  updateWorkspace,
  getWorkspaceStructure,
} from "@/app/actions/workspaces";

interface Workspace {
  id: string;
  name: string;
  slug: string;
  timezone: string;
}

export function useWorkspaceForm(initialWorkspace: Workspace | null, workspaceIdFromUrl?: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setStructure, setCurrentWorkspace } = useWorkspaceStore();

  // Track the last workspace ID to detect changes
  const [lastWorkspaceId, setLastWorkspaceId] = useState(initialWorkspace?.id);

  // Initialize form state
  const [formData, setFormData] = useState({
    name: initialWorkspace?.name || "",
    timezone: initialWorkspace?.timezone || "UTC",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Reset form when workspace changes (render-phase update)
  if (initialWorkspace?.id !== lastWorkspaceId) {
    setLastWorkspaceId(initialWorkspace?.id);
    if (initialWorkspace) {
      setFormData({
        name: initialWorkspace.name,
        timezone: initialWorkspace.timezone,
      });
    }
  }

  const hasChanges =
    formData.name !== (initialWorkspace?.name || "") ||
    formData.timezone !== (initialWorkspace?.timezone || "UTC");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialWorkspace) {
      setError("No workspace selected");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    // Use slug if available, fallback to id, or use URL identifier as last resort
    // The backend accepts both via WorkspaceGuard
    // Priority: slug from workspace > id from workspace > id from URL
    const workspaceIdentifier = initialWorkspace.slug || initialWorkspace.id || workspaceIdFromUrl;

    if (!workspaceIdentifier) {
      setError("Workspace identifier is missing. Please refresh the page.");
      setLoading(false);
      return;
    }

    console.log("Updating workspace with identifier:", workspaceIdentifier, {
      slug: initialWorkspace.slug,
      id: initialWorkspace.id,
      fromUrl: workspaceIdFromUrl
    });
    const result = await updateWorkspace(workspaceIdentifier, formData);

    if (result.success && result.data) {
      // Refresh workspace structure
      const structureResult = await getWorkspaceStructure();
      if (structureResult.success && structureResult.data) {
        setStructure(structureResult.data);
      }

      // CRITICAL: Check if slug changed due to rename
      // If the user renamed the workspace, the slug will be different
      // and we need to update the URL immediately to prevent 404 on refresh
      const oldSlug = initialWorkspace.slug;
      const newSlug = result.data.slug;

      if (newSlug && oldSlug !== newSlug) {
        // Get current workspaceId from URL
        const currentWorkspaceParam = searchParams.get("workspaceId");

        // Only redirect if we're currently viewing this workspace
        if (currentWorkspaceParam === oldSlug || currentWorkspaceParam === initialWorkspace.id) {
          // Update the store with the new slug
          setCurrentWorkspace(newSlug);

          // Replace the URL (not push) to avoid back button going to 404
          const newParams = new URLSearchParams(searchParams.toString());
          newParams.set("workspaceId", newSlug);
          router.replace(`/settings/workspace?${newParams.toString()}`);
        }
      }

      setSuccess(true);
      router.refresh();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || "Failed to update workspace");
    }

    setLoading(false);
  };

  return {
    formData,
    setFormData,
    loading,
    error,
    success,
    hasChanges,
    handleUpdate,
  };
}
