// components/settings/organization/edit-member-modal.tsx

"use client";

import { useState, useMemo, useEffect } from "react";
import { X, Loader2, Save, Briefcase, Check, ShieldCheck } from "lucide-react";
import {
  inviteUserToOrganization,
  WorkspaceInviteConfig,
} from "@/app/actions/workspaces";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/lib/store/workspace-store";

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: {
    userId: string;
    email: string;
    orgRole: "owner" | "admin" | "member";
    workspaces: { workspaceId: string; role: "admin" | "editor" | "viewer" }[];
  };
  contextWorkspaceId: string;
}

export function EditMemberModal({
  isOpen,
  onClose,
  member,
  contextWorkspaceId,
}: EditMemberModalProps) {
  const { structure, currentOrganization } = useWorkspaceStore();

  const [orgRole, setOrgRole] = useState<"owner" | "admin" | "member">(
    member.orgRole
  );
  const [selectedWorkspaces, setSelectedWorkspaces] = useState<
    Record<string, "admin" | "editor" | "viewer">
  >({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && member) {
      setOrgRole(member.orgRole);
      const wsMap: Record<string, "admin" | "editor" | "viewer"> = {};
      member.workspaces.forEach((ws) => {
        wsMap[ws.workspaceId] = ws.role;
      });
      setSelectedWorkspaces(wsMap);
    }
  }, [isOpen, member]);

  const availableWorkspaces = useMemo(() => {
    if (!currentOrganization) return [];
    const orgNode = structure.find(
      (n) => n.organization.id === currentOrganization.id
    );
    return orgNode ? orgNode.workspaces : [];
  }, [structure, currentOrganization]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // If Admin, send empty workspaces array (backend ignores specific assignments for admins anyway)
    // If Member, send the specific configuration
    const workspacesPayload: WorkspaceInviteConfig[] =
      orgRole === "member"
        ? Object.entries(selectedWorkspaces).map(([wId, role]) => ({
            workspaceId: wId,
            role,
          }))
        : [];

    const result = await inviteUserToOrganization(contextWorkspaceId, {
      email: member.email,
      orgRole: orgRole,
      workspaces: workspacesPayload,
    });

    setIsLoading(false);

    if (result.success) {
      toast.success("Member permissions updated");
      onClose();
    } else {
      toast.error(result.error || "Failed to update member");
    }
  };

  const toggleWorkspace = (wId: string) => {
    setSelectedWorkspaces((prev) => {
      const next = { ...prev };
      if (next[wId]) delete next[wId];
      else next[wId] = "editor";
      return next;
    });
  };

  const isGlobalAdmin = orgRole === "admin" || orgRole === "owner";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#e5e5e0]/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#fdfbf7] border border-black/10 shadow-2xl rounded-lg flex flex-col overflow-hidden max-h-[90vh]">
        <div className="p-6 border-b border-black/5 bg-[#fdfbf7] flex justify-between items-start">
          <div>
            <h2 className="headline text-2xl font-bold text-foreground">
              Manage Access
            </h2>
            <p className="font-serif text-sm text-muted-foreground mt-1">
              {member.email}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Org Role */}
            <div className="space-y-3">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Organization Role
              </label>
              {member.orgRole === "owner" ? (
                <div className="p-3 border border-purple-200 bg-purple-50 rounded-sm">
                  <span className="font-bold text-sm text-purple-900 uppercase flex items-center gap-2">
                    Owner <Check className="w-4 h-4" />
                  </span>
                  <p className="text-[10px] text-purple-800/70 mt-1">
                    Ownership must be transferred to another admin before roles
                    can be changed.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOrgRole("member")}
                    className={cn(
                      "flex flex-col items-start p-3 border rounded-sm transition-all",
                      orgRole === "member"
                        ? "border-brand-primary bg-brand-primary/5"
                        : "border-border hover:border-black/30"
                    )}
                  >
                    <span className="font-bold text-sm uppercase flex items-center gap-2">
                      Member{" "}
                      {orgRole === "member" && (
                        <Check className="w-3 h-3 text-brand-primary" />
                      )}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrgRole("admin")}
                    className={cn(
                      "flex flex-col items-start p-3 border rounded-sm transition-all",
                      orgRole === "admin"
                        ? "border-brand-primary bg-brand-primary/5"
                        : "border-border hover:border-black/30"
                    )}
                  >
                    <span className="font-bold text-sm uppercase flex items-center gap-2">
                      Admin{" "}
                      {orgRole === "admin" && (
                        <Check className="w-3 h-3 text-brand-primary" />
                      )}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Workspace Access - CONDITIONAL RENDER */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-black/5 pb-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Briefcase className="w-3 h-3" /> Workspace Access
                </label>
                {!isGlobalAdmin && (
                  <span className="text-[10px] text-muted-foreground">
                    {Object.keys(selectedWorkspaces).length} Selected
                  </span>
                )}
              </div>

              {isGlobalAdmin ? (
                // ADMIN VIEW: Simple Banner
                <div className="p-4 bg-surface-hover border border-black/5 rounded-sm flex gap-3">
                  <div className="p-2 bg-brand-primary/10 rounded-full h-fit">
                    <ShieldCheck className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="font-serif text-sm font-bold text-foreground">
                      Global Access Granted
                    </p>
                    <p className="font-serif text-xs text-muted-foreground mt-1 leading-relaxed">
                      Organization Admins automatically have{" "}
                      <strong>Admin</strong> access to all current and future
                      workspaces. Individual assignments are not needed.
                    </p>
                  </div>
                </div>
              ) : (
                // MEMBER VIEW: Selection List
                <div className="space-y-1 border border-black/5 rounded-sm p-1 max-h-[250px] overflow-y-auto">
                  {availableWorkspaces.map((ws) => {
                    const isSelected = !!selectedWorkspaces[ws.id];
                    return (
                      <div
                        key={ws.id}
                        className={cn(
                          "flex items-center justify-between p-2 rounded-sm transition-colors",
                          isSelected
                            ? "bg-brand-primary/5 border border-brand-primary/20"
                            : "hover:bg-black/5 border border-transparent"
                        )}
                      >
                        <div
                          className="flex items-center gap-3 cursor-pointer flex-1"
                          onClick={() => toggleWorkspace(ws.id)}
                        >
                          <div
                            className={cn(
                              "w-4 h-4 flex items-center justify-center border rounded-[2px] transition-colors",
                              isSelected
                                ? "bg-brand-primary border-brand-primary text-white"
                                : "border-black/30 bg-white"
                            )}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                          <span
                            className={cn(
                              "font-serif text-sm",
                              !isSelected && "text-muted-foreground"
                            )}
                          >
                            {ws.name}
                          </span>
                        </div>
                        {isSelected && (
                          <select
                            value={selectedWorkspaces[ws.id]}
                            onChange={(e) =>
                              setSelectedWorkspaces((p) => ({
                                ...p,
                                [ws.id]: e.target.value as any,
                              }))
                            }
                            className="text-[10px] uppercase font-bold bg-transparent border-none text-brand-primary cursor-pointer focus:ring-0 text-right"
                          >
                            <option value="viewer">Viewer</option>
                            <option value="editor">Editor</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-4 flex gap-3 border-t border-dashed border-black/10">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline flex-1"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary flex-[2]"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
