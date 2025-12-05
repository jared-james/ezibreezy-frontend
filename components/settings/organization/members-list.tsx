// components/settings/organization/members-list.tsx

"use client";

import { useState, useEffect } from "react";
import { MoreHorizontal, Edit2, Trash2, Loader2 } from "lucide-react";
import { getOrganizationMembers } from "@/app/actions/organization";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { cn } from "@/lib/utils";
import { EditMemberModal } from "./edit-member-modal";

interface Member {
  userId: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  orgRole: "owner" | "admin" | "member";
  workspaces: {
    workspaceId: string;
    role: "admin" | "editor" | "viewer";
    workspaceName: string;
  }[];
}

export function MembersList({ organizationId }: { organizationId: string }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const { currentWorkspace } = useWorkspaceStore();
  const VISIBLE_WORKSPACE_LIMIT = 3;

  const fetchMembers = async () => {
    setIsLoading(true);
    const result = await getOrganizationMembers(organizationId);
    if (result.success) {
      const sorted = (result.data as Member[]).sort((a, b) => {
        const score = { owner: 3, admin: 2, member: 1 };
        return (score[b.orgRole] || 0) - (score[a.orgRole] || 0);
      });
      setMembers(sorted);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, [organizationId]);

  if (isLoading) {
    return (
      <div className="py-12 text-center border-2 border-dashed border-border rounded-sm bg-surface/50">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
        <p className="mt-2 font-serif text-sm text-muted-foreground">
          Loading personnel records...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
          Team Members
        </h3>
        <span className="text-[10px] font-mono border border-foreground/20 px-2 py-1 rounded-sm uppercase tracking-wider text-muted-foreground font-bold">
          {members.length} Active
        </span>
      </div>

      <div className="border border-border rounded-sm bg-surface overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-hover border-b border-border">
              <tr>
                <th className="p-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground w-[300px]">
                  User Identity
                </th>
                <th className="p-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground w-[120px]">
                  Clearance
                </th>
                <th className="p-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Workspace Access
                </th>
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((member) => {
                // Calculation for splitting workspaces
                const visibleWorkspaces = member.workspaces.slice(
                  0,
                  VISIBLE_WORKSPACE_LIMIT
                );
                const hiddenWorkspaces = member.workspaces.slice(
                  VISIBLE_WORKSPACE_LIMIT
                );
                const hasHidden = hiddenWorkspaces.length > 0;

                return (
                  <tr
                    key={member.userId}
                    className="group hover:bg-surface-hover transition-colors"
                  >
                    {/* User Identity Column */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-border">
                          <AvatarImage src={member.avatarUrl} />
                          <AvatarFallback className="bg-muted text-[10px] text-foreground font-bold font-mono">
                            {member.displayName?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-serif text-sm font-bold leading-none text-foreground">
                            {member.displayName || "Unknown"}
                          </p>
                          <p className="font-mono text-[10px] text-muted-foreground mt-1.5 lowercase">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Clearance Column */}
                    <td className="p-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider border",
                          member.orgRole === "owner"
                            ? "border-foreground text-foreground bg-transparent"
                            : member.orgRole === "admin"
                            ? "border-foreground/60 text-foreground/80 bg-transparent"
                            : "border-border text-muted-foreground bg-transparent"
                        )}
                      >
                        {member.orgRole}
                      </span>
                    </td>

                    {/* Workspace Access Column (Updated) */}
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-1.5 flex-nowrap overflow-hidden">
                        {member.workspaces.length === 0 && (
                          <span className="text-xs text-muted-foreground italic opacity-50 font-serif">
                            No assigned workspaces
                          </span>
                        )}

                        <TooltipProvider delayDuration={100}>
                          {/* Visible Workspaces */}
                          {visibleWorkspaces.map((ws) => (
                            <Tooltip key={ws.workspaceId}>
                              <TooltipTrigger asChild>
                                <div className="max-w-[120px] truncate inline-flex px-1.5 py-0.5 bg-transparent border border-dotted border-foreground/30 rounded-sm text-[10px] text-foreground font-mono uppercase tracking-tight cursor-default hover:border-foreground transition-colors">
                                  {ws.workspaceName}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-[#fdfbf7] text-foreground border border-black/10 font-mono text-[10px] p-2">
                                <p>
                                  Role:{" "}
                                  <span className="font-bold">{ws.role}</span>
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          ))}

                          {/* Hidden Workspaces Badge (+N) */}
                          {hasHidden && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="inline-flex items-center justify-center h-[19px] min-w-[24px] px-1 bg-surface-hover border border-dashed border-foreground/20 text-[10px] text-muted-foreground rounded-sm font-mono cursor-help hover:text-foreground hover:border-foreground/50 transition-all">
                                  +{hiddenWorkspaces.length}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent
                                align="start"
                                side="bottom"
                                className="bg-[#fdfbf7] border border-black/10 shadow-xl p-0 w-48"
                              >
                                <div className="p-2 border-b border-border bg-black/5">
                                  <p className="font-serif text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                    Remaining Workspaces
                                  </p>
                                </div>
                                <div className="flex flex-col p-1 max-h-[200px] overflow-y-auto">
                                  {hiddenWorkspaces.map((ws) => (
                                    <div
                                      key={ws.workspaceId}
                                      className="flex items-center justify-between p-2 hover:bg-black/5 rounded-sm transition-colors"
                                    >
                                      <span
                                        className="font-mono text-[10px] text-foreground truncate max-w-[100px]"
                                        title={ws.workspaceName}
                                      >
                                        {ws.workspaceName}
                                      </span>
                                      <span className="font-mono text-[9px] uppercase border border-border px-1 rounded-sm text-muted-foreground">
                                        {ws.role}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </TooltipProvider>
                      </div>
                    </td>

                    {/* Actions Column */}
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1 hover:bg-black/5 rounded-sm outline-none transition-colors data-[state=open]:bg-black/5">
                          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 bg-[#fdfbf7] border border-black/10 shadow-xl p-1"
                        >
                          <DropdownMenuItem
                            onClick={() => setEditingMember(member)}
                            className="cursor-pointer gap-2 font-serif text-xs font-bold uppercase tracking-wider text-muted-foreground focus:text-foreground focus:bg-black/5"
                          >
                            <Edit2 className="h-3.5 w-3.5 opacity-70 text-muted-foreground" />
                            <span>Manage Access</span>
                          </DropdownMenuItem>
                          {member.orgRole !== "owner" && (
                            <DropdownMenuItem className="cursor-pointer gap-2 font-serif text-xs font-bold uppercase tracking-wider text-red-600 focus:text-red-700 focus:bg-red-50">
                              <Trash2 className="h-3.5 w-3.5 opacity-70 text-red-600" />
                              <span>Remove from Org</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editingMember && currentWorkspace && (
        <EditMemberModal
          isOpen={!!editingMember}
          onClose={() => {
            setEditingMember(null);
            fetchMembers();
          }}
          member={editingMember}
          contextWorkspaceId={currentWorkspace.id}
        />
      )}
    </div>
  );
}
