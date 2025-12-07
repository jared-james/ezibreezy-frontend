// components/settings/workspace/index.tsx

"use client";

import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import {
  deleteWorkspace,
  getWorkspaceStructure,
} from "@/app/actions/workspaces";

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
  role?: "admin" | "editor" | "viewer";
}

interface WorkspaceSettingsProps {
  workspace: Workspace | null;
  workspaceIdFromUrl?: string;
  userOrgRole?: string;
}

export function WorkspaceSettings({
  workspace,
  workspaceIdFromUrl,
  userOrgRole = "member",
}: WorkspaceSettingsProps) {
  const router = useRouter();
  const { setStructure, setCurrentWorkspace } = useWorkspaceStore();

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

  // -------------------------------------------------------
  // 1. No Workspace Selected
  // -------------------------------------------------------
  if (!workspace) {
    return (
      <div className="flex h-64 items-center justify-center border-2 border-dashed border-border p-8 text-center">
        <div>
          <Briefcase className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-serif text-muted-foreground">
            No workspace selected
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------
  // 2. Permission Check
  // -------------------------------------------------------
  const isWorkspaceAdmin = workspace.role === "admin";
  const isOrgAdmin = userOrgRole === "owner" || userOrgRole === "admin";
  const hasAccess = isWorkspaceAdmin || isOrgAdmin;

  if (!hasAccess) {
    return (
      <div className="rounded-sm border border-error/50 bg-error/5 p-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-error/20 bg-error/10">
            <AlertTriangle className="h-6 w-6 text-error" />
          </div>
        </div>
        <h3 className="mb-2 font-serif text-xl font-bold text-error">
          Access Restricted
        </h3>
        <p className="mx-auto max-w-md font-serif text-muted-foreground">
          You don&apos;t have permission to manage this workspace. Only
          workspace admins can access these settings.
        </p>
        <div className="mt-4 space-y-1 font-mono text-xs text-muted-foreground">
          <p>Workspace Role: {workspace.role}</p>
          <p>Organization Role: {userOrgRole}</p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------
  // 3. Delete Workspace
  // -------------------------------------------------------
  const handleDelete = async () => {
    const result = await deleteWorkspace(workspace.id);

    if (result.success) {
      const structureResult = await getWorkspaceStructure();

      if (structureResult.success && structureResult.data) {
        setStructure(structureResult.data);

        const firstWs = structureResult.data[0]?.workspaces?.[0];
        if (firstWs) {
          setCurrentWorkspace(firstWs.slug || firstWs.id);
        }
      }

      router.push("/dashboard");
      router.refresh();
      return;
    }

    toast.error(result.error || "Failed to delete workspace");
    throw new Error(result.error || "Failed to delete workspace");
  };

  // -------------------------------------------------------
  // 4. Render
  // -------------------------------------------------------
  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-500 pb-16">
      <div className="space-y-12">
        <WorkspaceForm
          workspace={workspace}
          workspaceIdFromUrl={workspaceIdFromUrl}
        />

        <div className="w-full border-t border-dashed border-border" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <TeamOperationsCard onInviteClick={openInviteModal} />
          <CreateWorkspaceCard onCreateClick={openCreateModal} />
        </div>

        <DangerZone
          workspaceName={workspace.name}
          onDeleteClick={openDeleteModal}
        />
      </div>

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
