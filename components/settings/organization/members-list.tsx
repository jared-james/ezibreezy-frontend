// components/settings/organization/members-list.tsx

"use client";

import { useState, useEffect } from "react";
import { MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import { getOrganizationMembers } from "@/app/actions/organization";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  // We need a workspace context ID to perform the update action via the existing gateway
  const { currentWorkspace } = useWorkspaceStore();

  const fetchMembers = async () => {
    setIsLoading(true);
    const result = await getOrganizationMembers(organizationId);
    if (result.success) {
      // Sort: Owner -> Admin -> Member
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
      <div className="py-12 text-center">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-2 font-serif text-sm text-muted-foreground">
          Loading personnel records...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-bold text-foreground">
          Team Members
        </h3>
        <span className="text-[10px] font-mono bg-black/5 px-2 py-1 rounded-sm uppercase tracking-wider text-muted-foreground">
          {members.length} Active
        </span>
      </div>

      <div className="border border-border rounded-sm bg-surface overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/5 border-b border-black/10">
              <tr>
                <th className="p-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground w-[300px]">
                  User
                </th>
                <th className="p-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground w-[120px]">
                  Role
                </th>
                <th className="p-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Workspaces
                </th>
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((member) => (
                <tr
                  key={member.userId}
                  className="group hover:bg-black/[0.02] transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-black/10">
                        <AvatarImage src={member.avatarUrl} />
                        <AvatarFallback className="bg-white text-[10px] text-foreground font-bold">
                          {member.displayName?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-serif text-sm font-bold leading-none text-foreground">
                          {member.displayName || "Unknown"}
                        </p>
                        <p className="font-mono text-[10px] text-muted-foreground mt-1.5">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border shadow-sm",
                        member.orgRole === "owner"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : member.orgRole === "admin"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      )}
                    >
                      {member.orgRole}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1.5">
                      {member.workspaces.length === 0 && (
                        <span className="text-xs text-muted-foreground italic opacity-50">
                          No assigned workspaces
                        </span>
                      )}

                      {/* Show first 3 workspaces */}
                      {member.workspaces.slice(0, 3).map((ws) => (
                        <span
                          key={ws.workspaceId}
                          className="inline-flex px-1.5 py-0.5 bg-white border border-black/10 rounded-sm text-[10px] text-foreground font-serif shadow-sm cursor-help"
                          title={`${ws.workspaceName} (${ws.role})`}
                        >
                          {ws.workspaceName}
                        </span>
                      ))}

                      {/* Overflow counter */}
                      {member.workspaces.length > 3 && (
                        <span
                          className="inline-flex px-1.5 py-0.5 bg-black/5 text-[10px] text-muted-foreground rounded-sm font-mono"
                          title="More workspaces"
                        >
                          +{member.workspaces.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1 hover:bg-black/10 rounded-sm outline-none transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-[#fdfbf7] border-black/10 shadow-xl w-48"
                      >
                        <DropdownMenuItem
                          onClick={() => setEditingMember(member)}
                          className="cursor-pointer gap-2 font-serif text-sm py-2"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-foreground/70" />{" "}
                          Manage Access
                        </DropdownMenuItem>
                        {member.orgRole !== "owner" && (
                          <>
                            {/* <DropdownMenuSeparator className="bg-black/5" /> */}
                            <DropdownMenuItem className="cursor-pointer gap-2 font-serif text-sm py-2 text-red-600 focus:text-red-700 focus:bg-red-50">
                              <Trash2 className="w-3.5 h-3.5" /> Remove from Org
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
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
