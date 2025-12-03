// app/(app)/settings/workspace/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { usePermissions } from "@/lib/hooks/use-permissions";
import {
  updateWorkspace,
  deleteWorkspace,
  getWorkspaceStructure,
} from "@/app/actions/workspaces";
import { CreateWorkspaceModal } from "@/components/modals/create-workspace-modal";

export default function WorkspaceSettingsPage() {
  const router = useRouter();
  const { currentWorkspace, setStructure, setCurrentWorkspace } =
    useWorkspaceStore();
  const { canManageWorkspace } = usePermissions();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Track current workspace ID to detect changes
  const [lastWorkspaceId, setLastWorkspaceId] = useState(currentWorkspace?.id);

  // Initialize form data from current workspace
  const [formData, setFormData] = useState({
    name: currentWorkspace?.name || "",
    timezone: currentWorkspace?.timezone || "UTC",
  });

  // Reset form when workspace changes
  if (currentWorkspace?.id !== lastWorkspaceId) {
    setLastWorkspaceId(currentWorkspace?.id);
    if (currentWorkspace) {
      setFormData({
        name: currentWorkspace.name,
        timezone: currentWorkspace.timezone,
      });
    }
  }

  if (!currentWorkspace) {
    return (
      <div className="p-8">
        <p className="text-[--muted-foreground]">No workspace selected</p>
      </div>
    );
  }

  if (!canManageWorkspace()) {
    return (
      <div className="p-8">
        <h1 className="font-serif text-2xl mb-4">Workspace Settings</h1>
        <div className="bg-[--error]/10 border border-[--error] p-4">
          <p className="text-[--error]">
            You don&apos;t have permission to manage this workspace.
          </p>
          <p className="text-sm text-[--muted-foreground] mt-2">
            Only workspace admins and organization owners can access this page.
          </p>
        </div>
      </div>
    );
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const result = await updateWorkspace(currentWorkspace.id, formData);

    if (result.success) {
      // Refresh workspace structure
      const structureResult = await getWorkspaceStructure();
      if (structureResult.success && structureResult.data) {
        setStructure(structureResult.data);
      }

      setSuccess(true);
      router.refresh();
    } else {
      setError(result.error || "Failed to update workspace");
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    const result = await deleteWorkspace(currentWorkspace.id);

    if (result.success) {
      // Refresh workspace structure
      const structureResult = await getWorkspaceStructure();
      if (structureResult.success && structureResult.data) {
        setStructure(structureResult.data);

        // Switch to first available workspace
        if (structureResult.data.length > 0) {
          const firstWs = structureResult.data[0].workspaces[0];
          if (firstWs) {
            setCurrentWorkspace(firstWs.id);
          }
        }
      }

      router.push("/dashboard");
      router.refresh();
    } else {
      setError(result.error || "Failed to delete workspace");
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl">Workspace Settings</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[--foreground] text-[--background] font-serif uppercase tracking-wide text-sm hover:opacity-90"
        >
          Create Workspace
        </button>
      </div>

      {/* General Settings */}
      <div className="mb-8 border-2 border-[--foreground] p-6">
        <h2 className="font-serif text-lg mb-4">General Settings</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
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
              maxLength={50}
              required
              className="w-full px-3 py-2 border-2 border-[--foreground] bg-[--background] font-serif"
            />
          </div>

          <div>
            <label className="block text-sm font-serif mb-2">Timezone</label>
            <select
              value={formData.timezone}
              onChange={(e) =>
                setFormData({ ...formData, timezone: e.target.value })
              }
              className="w-full px-3 py-2 border-2 border-[--foreground] bg-[--background] font-serif"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>

          {error && (
            <div className="text-sm text-[--error] bg-[--error]/10 p-3 border border-[--error]">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-green-600 bg-green-50 p-3 border border-green-600">
              Workspace updated successfully
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[--foreground] text-[--background] font-serif uppercase tracking-wide hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Team Management Section */}
      <div className="mb-8 border-2 border-[--foreground] p-6">
        <h2 className="font-serif text-lg mb-4">Team Management</h2>
        <p className="text-sm text-[--muted-foreground] mb-4">
          Invite users to collaborate in this workspace.
        </p>
        <button className="px-6 py-2 border-2 border-[--foreground] font-serif uppercase tracking-wide hover:bg-[--surface]">
          Invite User (Coming Soon)
        </button>
      </div>

      {/* Danger Zone */}
      <div className="border-2 border-[--error] p-6">
        <h2 className="font-serif text-lg mb-4 text-[--error]">Danger Zone</h2>
        <p className="text-sm text-[--muted-foreground] mb-4">
          Once you delete a workspace, there is no going back. All data will be
          permanently removed.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-6 py-2 bg-[--error] text-white font-serif uppercase tracking-wide hover:opacity-90"
          >
            Delete Workspace
          </button>
        ) : (
          <div>
            <p className="text-sm font-bold mb-3">
              Are you absolutely sure? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
                className="px-4 py-2 border-2 border-[--foreground] font-serif uppercase tracking-wide hover:bg-[--surface]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-[--error] text-white font-serif uppercase tracking-wide hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Yes, Delete Permanently"}
              </button>
            </div>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateWorkspaceModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={(newWorkspace) => {
            setCurrentWorkspace(newWorkspace.id);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}
