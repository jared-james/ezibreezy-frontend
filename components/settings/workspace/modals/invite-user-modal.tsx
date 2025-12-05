// components/settings/workspace/modals/invite-user-modal.tsx

"use client";

import { useState, useMemo, useEffect } from "react";
import {
  X,
  Mail,
  ShieldCheck,
  Loader2,
  Send,
  Scissors,
  AlertCircle,
  Building2,
  Check,
  Briefcase,
} from "lucide-react";
import {
  inviteUserToOrganization,
  WorkspaceInviteConfig,
} from "@/app/actions/workspaces";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  workspaceName: string;
}

export function InviteUserModal({
  isOpen,
  onClose,
  workspaceId,
  workspaceName,
}: InviteUserModalProps) {
  const { structure, currentOrganization } = useWorkspaceStore();

  const [email, setEmail] = useState("");
  const [orgRole, setOrgRole] = useState<"admin" | "member">("member");

  const [selectedWorkspaces, setSelectedWorkspaces] = useState<
    Record<string, "admin" | "editor" | "viewer">
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && workspaceId) {
      setSelectedWorkspaces((prev) => ({
        ...prev,
        [workspaceId]: "editor",
      }));
    }
  }, [isOpen, workspaceId]);

  const availableWorkspaces = useMemo(() => {
    if (!currentOrganization) return [];
    const orgNode = structure.find(
      (n) => n.organization.id === currentOrganization.id
    );
    return orgNode ? orgNode.workspaces : [];
  }, [structure, currentOrganization]);

  // Validation Logic
  const isFormValid = useMemo(() => {
    if (!email.trim()) return false;
    // If Admin, they don't need workspaces selected.
    // If Member, they MUST have at least one.
    if (orgRole === "member" && Object.keys(selectedWorkspaces).length === 0) {
      return false;
    }
    return true;
  }, [email, orgRole, selectedWorkspaces]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const workspacesPayload: WorkspaceInviteConfig[] =
      orgRole === "member"
        ? Object.entries(selectedWorkspaces).map(([wId, role]) => ({
            workspaceId: wId,
            role,
          }))
        : [];

    setIsLoading(true);
    setError(null);

    try {
      const result = await inviteUserToOrganization(workspaceId, {
        email,
        orgRole,
        workspaces: workspacesPayload,
      });

      if (result.success) {
        const isProvisioning = result.data?.provisioned;
        const count = workspacesPayload.length;

        if (isProvisioning) {
          toast.success(
            `Access granted to ${
              orgRole === "admin" ? "all" : count
            } workspace${count === 1 ? "" : "s"}.`
          );
        } else {
          toast.success(`Invitation dispatched to ${email}`);
        }

        onClose();
        setEmail("");
        setOrgRole("member");
        setSelectedWorkspaces({ [workspaceId]: "editor" });
      } else {
        setError(result.error || "Failed to dispatch invite");
      }
    } catch (error) {
      setError("Critical transmission error.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWorkspace = (wId: string) => {
    setSelectedWorkspaces((prev) => {
      const next = { ...prev };
      if (next[wId]) {
        delete next[wId];
      } else {
        next[wId] = "editor";
      }
      return next;
    });
  };

  const updateWorkspaceRole = (
    wId: string,
    role: "admin" | "editor" | "viewer"
  ) => {
    setSelectedWorkspaces((prev) => ({
      ...prev,
      [wId]: role,
    }));
  };

  const isGlobalAdmin = orgRole === "admin";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#e5e5e0]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#fdfbf7] border border-black/10 shadow-2xl rounded-lg flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-black/5 pb-6 bg-[#fdfbf7] shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Organization // Personnel
              </p>
              <h2 className="headline text-3xl font-bold tracking-tight text-foreground">
                Invite Member
              </h2>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-foreground/80 font-serif border-l-2 border-brand-primary pl-3">
            <span>Adding to Organization:</span>
            <span className="font-bold border-b border-black/10">
              {currentOrganization?.name}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 pt-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Recipient Email */}
            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground pl-1">
                Recipient Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-0 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-brand-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setError(null);
                    setEmail(e.target.value);
                  }}
                  required
                  placeholder="colleague@company.com"
                  className={cn(
                    "w-full bg-transparent px-6 py-2 font-serif text-xl text-foreground placeholder:text-muted-foreground/40 outline-none transition-all",
                    "border-b-2 border-dotted border-black/20",
                    "focus:border-brand-primary focus:border-solid",
                    error && "border-red-500 border-solid text-red-600"
                  )}
                />
              </div>
            </div>

            {/* 2. Organization Role */}
            <div className="space-y-3">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground pl-1">
                Organization Clearance
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrgRole("member")}
                  className={cn(
                    "flex flex-col items-start p-3 border rounded-sm transition-all text-left",
                    orgRole === "member"
                      ? "border-brand-primary bg-brand-primary/5"
                      : "border-border hover:border-black/30"
                  )}
                >
                  <span className="font-bold text-sm flex items-center gap-2">
                    Member{" "}
                    {orgRole === "member" && (
                      <Check className="w-3 h-3 text-brand-primary" />
                    )}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-1 leading-snug">
                    Can only access assigned workspaces.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrgRole("admin")}
                  className={cn(
                    "flex flex-col items-start p-3 border rounded-sm transition-all text-left",
                    orgRole === "admin"
                      ? "border-brand-primary bg-brand-primary/5"
                      : "border-border hover:border-black/30"
                  )}
                >
                  <span className="font-bold text-sm flex items-center gap-2">
                    Admin{" "}
                    {orgRole === "admin" && (
                      <Check className="w-3 h-3 text-brand-primary" />
                    )}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-1 leading-snug">
                    Full control over billing and all workspaces.
                  </span>
                </button>
              </div>
            </div>

            {/* 3. Workspace Access (Conditional) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between border-b border-black/10 pb-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground pl-1 flex items-center gap-2">
                  <Briefcase className="w-3 h-3" /> Workspace Assignments
                </label>
                {!isGlobalAdmin && (
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {Object.keys(selectedWorkspaces).length} Selected
                  </span>
                )}
              </div>

              {isGlobalAdmin ? (
                // ADMIN BANNER
                <div className="p-4 bg-surface-hover border border-black/5 rounded-sm flex gap-3 animate-in fade-in duration-300">
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
                      workspaces.
                    </p>
                  </div>
                </div>
              ) : (
                // MEMBER LIST
                <div className="space-y-1 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                  {availableWorkspaces.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic p-2">
                      No workspaces found.
                    </p>
                  ) : (
                    availableWorkspaces.map((ws) => {
                      const isSelected = !!selectedWorkspaces[ws.id];
                      const role = selectedWorkspaces[ws.id] || "editor";

                      return (
                        <div
                          key={ws.id}
                          className={cn(
                            "group flex items-center justify-between p-2 rounded-sm border transition-all",
                            isSelected
                              ? "bg-brand-primary/5 border-brand-primary shadow-sm"
                              : "border-transparent hover:bg-black/5"
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
                                "font-serif text-sm transition-colors",
                                isSelected
                                  ? "text-foreground font-medium"
                                  : "text-muted-foreground"
                              )}
                            >
                              {ws.name}
                            </span>
                          </div>

                          {isSelected && (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
                              <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
                                Role:
                              </span>
                              <Select
                                value={role}
                                onValueChange={(val) =>
                                  updateWorkspaceRole(
                                    ws.id,
                                    val as "admin" | "editor" | "viewer"
                                  )
                                }
                              >
                                <SelectTrigger className="h-auto w-fit gap-1 border-0 bg-transparent px-0 py-0 text-[10px] font-bold uppercase tracking-wider text-brand-primary shadow-none focus:ring-0 hover:bg-transparent data-[placeholder]:text-brand-primary [&_svg]:size-3 [&_svg]:opacity-50">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent
                                  align="end"
                                  className="bg-[#fdfbf7] border border-black/10 shadow-xl font-serif"
                                >
                                  <SelectItem
                                    value="viewer"
                                    className="cursor-pointer focus:bg-black/5 focus:text-black"
                                  >
                                    Viewer
                                  </SelectItem>
                                  <SelectItem
                                    value="editor"
                                    className="cursor-pointer focus:bg-black/5 focus:text-black"
                                  >
                                    Editor
                                  </SelectItem>
                                  <SelectItem
                                    value="admin"
                                    className="cursor-pointer focus:bg-black/5 focus:text-black"
                                  >
                                    Admin
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="border border-red-200 bg-red-50 p-3 flex items-start gap-3 rounded-sm">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                <p className="font-mono text-xs text-red-700 leading-relaxed">
                  <span className="font-bold">ERROR:</span> {error}
                </p>
              </div>
            )}

            {/* "Cut Line" Separator */}
            <div className="flex items-center gap-2 text-black/20 py-2">
              <Scissors className="h-4 w-4 -rotate-90" />
              <div className="flex-1 border-b-2 border-dashed border-black/10" />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="btn btn-outline flex-1"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={isLoading || !isFormValid}
                className={cn(
                  "btn flex-[2]",
                  !isFormValid
                    ? "bg-black/10 text-muted-foreground cursor-not-allowed border-transparent"
                    : "btn-primary"
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin mr-2" />{" "}
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3 mr-2" /> Dispatch Invite
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
