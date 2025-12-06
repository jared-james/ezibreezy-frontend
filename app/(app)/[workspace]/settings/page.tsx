// app/(app)/[workspace]/settings/page.tsx

import WorkspaceSettingsClient from "./workspace-settings-client";
import {
  getWorkspaceDetails,
  getWorkspaceStructure,
} from "@/app/actions/workspaces";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ workspace: string }>;
}

export default async function WorkspaceSettingsPage({ params }: PageProps) {
  const { workspace: workspaceSlug } = await params;

  // Fetch details and structure in parallel
  const [detailsResult, structureResult] = await Promise.all([
    getWorkspaceDetails(workspaceSlug),
    getWorkspaceStructure(),
  ]);

  if (!detailsResult.success || !detailsResult.data) {
    redirect("/dashboard");
  }

  const workspace = detailsResult.data;

  // Determine Organization Role from Structure
  let userOrgRole = "member";
  if (structureResult.success && Array.isArray(structureResult.data)) {
    const orgNode = structureResult.data.find(
      (node: any) => node.organization.id === workspace.organizationId
    );
    if (orgNode) {
      userOrgRole = orgNode.organization.role;
    }
  }

  return (
    <WorkspaceSettingsClient
      workspaceId={workspaceSlug}
      initialWorkspace={workspace}
      userOrgRole={userOrgRole}
    />
  );
}
