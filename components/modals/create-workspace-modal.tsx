// components/modals/create-workspace-modal.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { usePermissions } from "@/lib/hooks/use-permissions";
import {
  createWorkspace,
  getWorkspaceStructure,
} from "@/app/actions/workspaces";

interface CreateWorkspaceModalProps {
  onClose: () => void;
  onSuccess?: (workspace: { id: string; name: string }) => void;
}

export function CreateWorkspaceModal({
  onClose,
  onSuccess,
}: CreateWorkspaceModalProps) {
  const router = useRouter();
  const { structure, setStructure, setCurrentWorkspace } = useWorkspaceStore();
  const { canCreateWorkspace } = usePermissions();

  const [formData, setFormData] = useState({
    organizationId: "",
    name: "",
    timezone: "UTC",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filter to orgs where user is owner/admin
  const eligibleOrgs = structure.filter((node) =>
    canCreateWorkspace(node.organization.id)
  );

  // Default to first eligible org
  if (!formData.organizationId && eligibleOrgs.length > 0) {
    setFormData((prev) => ({
      ...prev,
      organizationId: eligibleOrgs[0].organization.id,
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await createWorkspace(formData);

    if (result.success && result.data) {
      // Refresh workspace structure
      const structureResult = await getWorkspaceStructure();
      if (structureResult.success && structureResult.data) {
        setStructure(structureResult.data);
      }

      // Switch to new workspace
      setCurrentWorkspace(result.data.id);

      // Call success callback
      onSuccess?.(result.data);

      // Refresh the page to update all components
      router.refresh();

      onClose();
    } else {
      setError(result.error || "Failed to create workspace");
      setLoading(false);
    }
  };

  if (eligibleOrgs.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-background border-2 border-foreground p-6 max-w-md w-full">
          <h2 className="font-serif text-xl mb-4">Cannot Create Workspace</h2>
          <p className="text-sm text-muted-foreground mb-4">
            You need to be an owner or admin of an organization to create
            workspaces.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-foreground text-background font-serif uppercase tracking-wide"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border-2 border-foreground p-6 max-w-md w-full">
        <h2 className="font-serif text-xl mb-6">Create New Workspace</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-serif mb-2">
              Organization
            </label>
            <select
              value={formData.organizationId}
              onChange={(e) =>
                setFormData({ ...formData, organizationId: e.target.value })
              }
              required
              className="w-full px-3 py-2 border-2 border-foreground bg-background font-serif"
            >
              {eligibleOrgs.map((node) => (
                <option key={node.organization.id} value={node.organization.id}>
                  {node.organization.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-serif mb-2">
              Workspace Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Client Name or Project"
              maxLength={50}
              required
              className="w-full px-3 py-2 border-2 border-foreground bg-background font-serif"
            />
          </div>

          <div>
            <label className="block text-sm font-serif mb-2">Timezone</label>
            <select
              value={formData.timezone}
              onChange={(e) =>
                setFormData({ ...formData, timezone: e.target.value })
              }
              className="w-full px-3 py-2 border-2 border-foreground bg-background font-serif"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>

          {error && (
            <div className="text-sm text-error bg-error/10 p-3 border border-error">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border-2 border-foreground font-serif uppercase tracking-wide hover:bg-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-foreground text-background font-serif uppercase tracking-wide hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
