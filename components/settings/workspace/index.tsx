// components/settings/workspace/index.tsx

"use client";

import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { usePermissions } from "@/lib/hooks/use-permissions";
import {
  deleteWorkspace,
  getWorkspaceStructure,
} from "@/app/actions/workspaces";
import { WorkspaceHeader } from "./workspace-header";
import { WorkspaceForm } from "./workspace-form";
import { TeamOperationsCard } from "./team-operations-card";
import { CreateWorkspaceCard } from "./create-workspace-card";
import { DangerZone } from "./danger-zone";
import { useWorkspaceModals } from "./hooks/use-workspace-modals";
import { CreateWorkspaceModal } from "./modals/create-workspace-modal";
import { InviteUserModal } from "./modals/invite-user-modal";
import { DeleteWorkspaceModal } from "./modals/delete-workspace-modal";
import { Briefcase, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface Workspace {
  id: string;
  name: string;
  slug: string;
  timezone: string;
}

interface WorkspaceSettingsProps {
  workspace: Workspace | null;
  workspaceIdFromUrl?: string; // Fallback identifier from URL
}

export function WorkspaceSettings({ workspace, workspaceIdFromUrl }: WorkspaceSettingsProps) {
  const router = useRouter();
  const { setStructure, setCurrentWorkspace } = useWorkspaceStore();
  const { canManageWorkspace } = usePermissions();

  const {
    showCreateModal,
    showInviteModal,
    showDeleteModal,
    openCreateModal,
    closeCreateModal,
    openInviteModal,
    closeInviteModal,
    openDeleteModal,
    closeDeleteModal,
  } = useWorkspaceModals();

  // Early return: No workspace selected
  if (!workspace) {
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

  // Early return: No permission
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

  const handleDelete = async () => {
    const result = await deleteWorkspace(workspace.id);

    if (result.success) {
      // Refresh workspace structure
      const structureResult = await getWorkspaceStructure();
      if (structureResult.success && structureResult.data) {
        setStructure(structureResult.data);

        // Switch to first available workspace (using slug)
        if (structureResult.data.length > 0) {
          const firstWs = structureResult.data[0].workspaces[0];
          if (firstWs) {
            setCurrentWorkspace(firstWs.slug || firstWs.id);
          }
        }
      }

      router.push("/dashboard");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete workspace");
      throw new Error(result.error || "Failed to delete workspace");
    }
  };

  return (
    <div className="max-w-4xl space-y-12">
      {/* Header */}
      <WorkspaceHeader workspace={workspace} />

      {/* Main Form Section */}
      <WorkspaceForm workspace={workspace} workspaceIdFromUrl={workspaceIdFromUrl} />

      {/* Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TeamOperationsCard onInviteClick={openInviteModal} />
        <CreateWorkspaceCard onCreateClick={openCreateModal} />
      </div>

      {/* Danger Zone */}
      <DangerZone
        workspaceName={workspace.name}
        onDeleteClick={openDeleteModal}
      />

      {/* Modals */}
      {showCreateModal && (
        <CreateWorkspaceModal
          onClose={closeCreateModal}
          onSuccess={(newWorkspace) => {
            setCurrentWorkspace(newWorkspace.slug || newWorkspace.id);
            closeCreateModal();
          }}
        />
      )}

      {showInviteModal && (
        <InviteUserModal
          isOpen={showInviteModal}
          onClose={closeInviteModal}
          workspaceId={workspace.id}
          workspaceName={workspace.name}
        />
      )}

      {showDeleteModal && (
        <DeleteWorkspaceModal
          isOpen={showDeleteModal}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          workspaceName={workspace.name}
        />
      )}
    </div>
  );
}
