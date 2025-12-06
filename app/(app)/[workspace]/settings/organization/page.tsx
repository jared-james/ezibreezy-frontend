// app/(app)/[workspace]/settings/organization/page.tsx

import { getWorkspaceStructure } from "@/app/actions/workspaces";
import OrganizationForm from "@/components/settings/organization/organization-form";
import { MembersList } from "@/components/settings/organization/members-list";
import { OrganizationSecuritySection } from "@/components/settings/organization/security-section";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ workspace: string }>;
}

export default async function OrganizationSettingsPage({ params }: Props) {
  // 1. Await params (Next.js 15 requirement)
  const { workspace: workspaceSlug } = await params;

  console.log(`[ORG_PAGE] Loading settings for slug: ${workspaceSlug}`);

  // 2. Fetch structure to find the Org ID for this specific workspace
  const structureResult = await getWorkspaceStructure();

  if (!structureResult.success || !structureResult.data) {
    console.error("[ORG_PAGE] Failed to fetch structure");
    redirect("/auth/login");
  }

  // 3. Find the organization matching the URL slug
  let targetOrgId = "";
  let targetOrgName = "";

  for (const node of structureResult.data) {
    // Check if the current node IS the org (if slug is org slug)
    // OR if the node contains the workspace (if slug is workspace slug)
    const isOrgMatch = node.organization.slug === workspaceSlug;
    const isWorkspaceMatch = node.workspaces.some(
      (ws: any) => ws.slug === workspaceSlug
    );

    if (isOrgMatch || isWorkspaceMatch) {
      targetOrgId = node.organization.id;
      targetOrgName = node.organization.name;
      break;
    }
  }

  // 4. Fallback: If not found, log available slugs to debug
  if (!targetOrgId) {
    const availableSlugs = structureResult.data.flatMap((n: any) => [
      n.organization.slug,
      ...n.workspaces.map((w: any) => w.slug),
    ]);
    console.error(
      `[ORG_PAGE] Slug '${workspaceSlug}' not found. Available:`,
      availableSlugs
    );

    // Safety redirect, but now you'll see WHY in the server logs
    redirect("/dashboard");
  }

  console.log(`[ORG_PAGE] Found Context: ${targetOrgName} (${targetOrgId})`);

  return (
    <div className="space-y-12">
      <OrganizationForm
        initialOrgName={targetOrgName}
        organizationId={targetOrgId}
      />

      <div className="border-t border-dashed border-border pt-12">
        <MembersList organizationId={targetOrgId} />
      </div>

      <OrganizationSecuritySection
        organizationId={targetOrgId}
        organizationName={targetOrgName}
      />
    </div>
  );
}
