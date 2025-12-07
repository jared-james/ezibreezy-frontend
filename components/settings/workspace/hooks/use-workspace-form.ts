// components/settings/workspace/hooks/use-workspace-form.ts

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import {
  updateWorkspace,
  getWorkspaceStructure,
} from "@/app/actions/workspaces";
import { validateWorkspaceSlug } from "@/lib/constants/reserved-slugs";

interface Workspace {
  id: string;
  name: string;
  slug: string;
  timezone: string;
}

export function useWorkspaceForm(
  initialWorkspace: Workspace | null,
  workspaceIdFromUrl?: string
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { setStructure, setCurrentWorkspace } = useWorkspaceStore();

  const [lastWorkspaceId, setLastWorkspaceId] = useState(initialWorkspace?.id);

  const [formData, setFormData] = useState({
    name: initialWorkspace?.name || "",
    timezone: initialWorkspace?.timezone || "UTC",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // -------------------------------------------------------
  // Reset form when workspace changes (safe effect)
  // -------------------------------------------------------
  useEffect(() => {
    if (initialWorkspace?.id !== lastWorkspaceId) {
      setLastWorkspaceId(initialWorkspace?.id);

      if (initialWorkspace) {
        setFormData({
          name: initialWorkspace.name,
          timezone: initialWorkspace.timezone,
        });
      }
    }
  }, [initialWorkspace, lastWorkspaceId]);

  const hasChanges =
    formData.name !== (initialWorkspace?.name || "") ||
    formData.timezone !== (initialWorkspace?.timezone || "UTC");

  // -------------------------------------------------------
  // Submit Handler
  // -------------------------------------------------------
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!initialWorkspace) {
      setError("No workspace selected");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    // Validate slug impact from rename
    if (formData.name !== initialWorkspace.name) {
      const potentialSlug = formData.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const slugValidation = validateWorkspaceSlug(potentialSlug);
      if (!slugValidation.valid) {
        setError(
          `Workspace name will generate a reserved URL (${potentialSlug}). ${slugValidation.error}`
        );
        setLoading(false);
        return;
      }
    }

    // Slug > ID > URL fallback
    const workspaceIdentifier =
      initialWorkspace.slug || initialWorkspace.id || workspaceIdFromUrl;

    if (!workspaceIdentifier) {
      setError("Workspace identifier is missing. Please refresh the page.");
      setLoading(false);
      return;
    }

    const result = await updateWorkspace(workspaceIdentifier, formData);

    if (result.success && result.data) {
      const structureResult = await getWorkspaceStructure();

      if (structureResult.success && structureResult.data) {
        setStructure(structureResult.data);
      }

      const oldSlug = initialWorkspace.slug;
      const newSlug = result.data.slug;

      // Handle Redirection if slug changed
      if (newSlug && oldSlug !== newSlug) {
        // 1. Path-based routing (e.g. /chicken-fish/settings -> /chicken-nuggie/settings)
        if (
          pathname &&
          (pathname === `/${oldSlug}` || pathname.startsWith(`/${oldSlug}/`))
        ) {
          const newPath = pathname.replace(`/${oldSlug}`, `/${newSlug}`);
          setCurrentWorkspace(newSlug);
          router.replace(newPath);
          setSuccess(true);
          setLoading(false);
          return; // Stop here to prevent refreshing on invalid old URL
        }

        // 2. Query-param based routing (Legacy fallback)
        const currentParam =
          searchParams.get("workspace") || searchParams.get("workspaceId");

        if (currentParam === oldSlug || currentParam === initialWorkspace.id) {
          setCurrentWorkspace(newSlug);

          const newParams = new URLSearchParams(searchParams.toString());
          newParams.delete("workspaceId");
          newParams.set("workspace", newSlug);

          router.replace(`/settings/workspace?${newParams.toString()}`);
          setSuccess(true);
          setLoading(false);
          return;
        }
      }

      setSuccess(true);
      router.refresh();

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
