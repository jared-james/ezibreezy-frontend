// lib/hooks/use-permissions.ts

import { useWorkspaceStore } from "@/lib/store/workspace-store";

export function usePermissions() {
  const { currentWorkspace, currentOrganization, structure } =
    useWorkspaceStore();

  const hasWorkspaceRole = (...roles: Array<"admin" | "editor" | "viewer">) => {
    return currentWorkspace && roles.includes(currentWorkspace.role);
  };

  const hasOrgRole = (
    orgId: string,
    ...roles: Array<"owner" | "admin" | "member">
  ) => {
    const org = structure.find(
      (n) => n.organization.id === orgId
    )?.organization;
    return org && roles.includes(org.role);
  };

  const canCreateWorkspace = (orgId: string) => {
    return hasOrgRole(orgId, "owner", "admin");
  };

  const canManageWorkspace = () => {
    // Can manage if workspace admin OR org owner/admin (implicit access)
    return (
      hasWorkspaceRole("admin") ||
      (currentOrganization &&
        ["owner", "admin"].includes(currentOrganization.role))
    );
  };

  const canEditContent = () => {
    return hasWorkspaceRole("admin", "editor");
  };

  return {
    hasWorkspaceRole,
    hasOrgRole,
    canCreateWorkspace,
    canManageWorkspace,
    canEditContent,
    isAdmin: currentWorkspace?.role === "admin",
    isEditor: currentWorkspace?.role === "editor",
    isViewer: currentWorkspace?.role === "viewer",
  };
}
