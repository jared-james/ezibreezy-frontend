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
import { InviteUserModal } from "@/components/modals/invite-user-modal";
import {
  Briefcase,
  Globe,
  Users,
  Plus,
  AlertTriangle,
  Loader2,
  Check,
  Save,
  Trash2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [showInviteModal, setShowInviteModal] = useState(false);

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
      <div className="flex h-64 items-center justify-center border-2 border-dashed border-border p-8 text-center">
        <div>
          <Briefcase className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
          <p className="font-serif text-muted-foreground">
            No workspace selected
          </p>
        </div>
      </div>
    );
  }

  if (!canManageWorkspace()) {
    return (
      <div className="border border-error/50 bg-error/5 p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-error/10 flex items-center justify-center border border-error/20">
            <AlertTriangle className="h-6 w-6 text-error" />
          </div>
        </div>
        <h3 className="font-serif text-xl font-bold text-error mb-2">
          Access Restricted
        </h3>
        <p className="font-serif text-muted-foreground max-w-md mx-auto">
          You don&apos;t have permission to manage this workspace. Only
          workspace admins and organization owners can access these settings.
        </p>
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

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
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
    <div className="max-w-4xl space-y-12">
      {/* Header */}
      <div>
        <p className="eyebrow mb-2">Configuration</p>
        <h2 className="headline text-3xl font-bold">Workspace Settings</h2>
        <div className="mt-6 flex items-center gap-3 p-3 bg-surface-hover border border-border">
          <div className="h-10 w-10 bg-brand-primary text-white flex items-center justify-center font-serif text-lg font-bold">
            {currentWorkspace.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-serif text-sm font-bold leading-none">
              {currentWorkspace.name}
            </p>
            <p className="font-mono text-xs text-muted-foreground mt-1">
              ID: {currentWorkspace.id}
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Section */}
      <div className="relative">
        <div className="absolute -top-3 left-4 bg-surface px-2 z-10">
          <span className="eyebrow text-foreground bg-brand-accent/10 px-2 py-0.5 border border-brand-accent/20">
            Identity Card
          </span>
        </div>

        <form
          onSubmit={handleUpdate}
          className="border-2 border-foreground p-6 md:p-8 space-y-6 bg-surface"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-muted-foreground">
                <Briefcase className="w-3.5 h-3.5" /> Workspace Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                maxLength={50}
                required
                className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all font-serif"
                placeholder="e.g. Editorial Team"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-muted-foreground">
                <Globe className="w-3.5 h-3.5" /> Timezone
              </label>
              <Select
                value={formData.timezone}
                onValueChange={(value) =>
                  setFormData({ ...formData, timezone: value })
                }
              >
                <SelectTrigger className="w-full h-[50px] px-4 bg-background border-border font-serif text-base focus:ring-foreground/20">
                  <SelectValue placeholder="Select Timezone" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] font-serif">
                  <SelectItem value="UTC">UTC (Universal Time)</SelectItem>
                  <SelectItem value="America/New_York">
                    Eastern Time (US & Canada)
                  </SelectItem>
                  <SelectItem value="America/Chicago">
                    Central Time (US & Canada)
                  </SelectItem>
                  <SelectItem value="America/Denver">
                    Mountain Time (US & Canada)
                  </SelectItem>
                  <SelectItem value="America/Los_Angeles">
                    Pacific Time (US & Canada)
                  </SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                  <SelectItem value="Europe/Paris">Paris</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                  <SelectItem value="Australia/Sydney">Sydney</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4 border-t border-dashed border-border flex items-center justify-between">
            <div className="text-sm">
              {error && (
                <span className="flex items-center gap-2 text-error font-medium animate-in fade-in">
                  <AlertTriangle className="w-4 h-4" /> {error}
                </span>
              )}
              {success && (
                <span className="flex items-center gap-2 text-brand-primary font-medium animate-in fade-in">
                  <Check className="w-4 h-4" /> Saved Successfully
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Team Card */}
        <div className="group border border-border p-6 bg-surface hover:border-foreground/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-bold">Team Roster</h3>
            <Users className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
          <p className="font-serif text-sm text-muted-foreground mb-6 h-10">
            Manage members and collaborators within this workspace environment.
          </p>
          <button
            onClick={() => setShowInviteModal(true)}
            className="w-full py-3 border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-surface-hover transition-all text-xs font-bold uppercase tracking-wider"
          >
            Invite User
          </button>
        </div>

        {/* Create New Workspace - "Ticket" Style */}
        <div className="group flex flex-col p-6 border-2 border-dashed border-brand-accent/30 bg-brand-accent/[0.02] hover:bg-brand-accent/[0.05] hover:border-brand-accent/60 transition-all duration-300">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-brand-accent transition-colors">
              New Workspace
            </h3>
            <Plus className="w-5 h-5 text-brand-accent opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>

          <p className="font-serif text-sm text-muted-foreground mb-6">
            Create a separate environment for a new client or project to keep
            assets organized.
          </p>

          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-auto w-full btn btn-primary gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New Workspace
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-12 border-t-4 border-double border-error/20 pt-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-error/5 border border-error/20 rounded-sm shrink-0">
            <Trash2 className="w-6 h-6 text-error" />
          </div>
          <div className="flex-1">
            <h3 className="font-serif text-xl font-bold text-error uppercase tracking-tight">
              Danger Zone
            </h3>
            <p className="font-serif text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
              Deleting a workspace is irreversible. All posts, drafts, media
              assets, and configuration settings associated with{" "}
              <span className="font-bold text-foreground">
                {currentWorkspace.name}
              </span>{" "}
              will be permanently removed.
            </p>

            <div className="mt-6">
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-5 py-2.5 bg-white border border-error/30 text-error hover:bg-error hover:text-white hover:border-error transition-all text-xs font-bold uppercase tracking-wider shadow-sm"
                >
                  Delete Workspace
                </button>
              ) : (
                <div className="bg-error/5 border border-error/20 p-4 inline-block max-w-md animate-in fade-in slide-in-from-left-2">
                  <p className="text-sm font-bold text-error mb-3">
                    Are you absolutely sure? This cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={loading}
                      className="px-4 py-2 bg-white border border-border hover:bg-surface-hover text-xs font-bold uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={loading}
                      className="px-4 py-2 bg-error text-white border border-error hover:bg-error-hover text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                    >
                      {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                      Confirm Deletion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
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

      {showInviteModal && (
        <InviteUserModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          workspaceId={currentWorkspace.id}
          workspaceName={currentWorkspace.name}
        />
      )}
    </div>
  );
}
