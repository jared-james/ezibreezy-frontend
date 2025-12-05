// components/settings/workspace/hooks/use-workspace-form.ts

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import {
  updateWorkspace,
  getWorkspaceStructure,
} from "@/app/actions/workspaces";

interface Workspace {
  id: string;
  name: string;
  timezone: string;
}

export function useWorkspaceForm(initialWorkspace: Workspace | null) {
  const router = useRouter();
  const { setStructure } = useWorkspaceStore();

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
    if (!initialWorkspace) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    const result = await updateWorkspace(initialWorkspace.id, formData);

    if (result.success) {
      // Refresh workspace structure
      const structureResult = await getWorkspaceStructure();
      if (structureResult.success && structureResult.data) {
        setStructure(structureResult.data);
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
