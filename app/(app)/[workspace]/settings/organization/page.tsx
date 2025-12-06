// app/(app)/[workspace]/settings/organization/page.tsx

import { getWorkspaceDetails } from "@/app/actions/workspaces";
import { getOrganizationMembers } from "@/app/actions/organization";
import { getUser } from "@/lib/auth/check";
import OrganizationForm from "@/components/settings/organization/organization-form";
import { MembersList } from "@/components/settings/organization/members-list";
import { OrganizationSecuritySection } from "@/components/settings/organization/security-section";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ workspace: string }>;
}

export default async function OrganizationSettingsPage({ params }: Props) {
  const { workspace: workspaceSlug } = await params;
  const user = await getUser();

  if (!user) redirect("/auth/login");

  // 1. Resolve Workspace & Org ID
  const workspaceResult = await getWorkspaceDetails(workspaceSlug);

  if (!workspaceResult.success || !workspaceResult.data) {
    console.error(
      "[OrgSettings] Workspace resolution failed for slug:",
      workspaceSlug
    );
    redirect("/dashboard");
  }

  const workspace = workspaceResult.data;
  const organizationId = workspace.organization.id;
  const organizationName = workspace.organization.name;

  // 2. Fetch Members (Server Side)
  // If this fails (e.g. 403 Forbidden because user is just a member),
  // we catch it and default to empty list to prevent page crash.
  const membersResult = await getOrganizationMembers(organizationId);

  let members = [];
  let currentUserRole: "owner" | "admin" | "member" = "member";

  if (membersResult.success && Array.isArray(membersResult.data)) {
    members = membersResult.data;

    // 3. Determine Current User's Role from the list
    const currentUserRecord = members.find((m: any) => m.userId === user.id);
    if (currentUserRecord) {
      currentUserRole = currentUserRecord.orgRole;
    }
  } else {
    // Debug log to help you trace why permission is denied
    console.warn(
      `[OrgSettings] Could not fetch members for Org ${organizationId}. User ${user.id} might not be an Admin/Owner.`
    );
  }

  return (
    <div className="space-y-12">
      <OrganizationForm
        initialOrgName={organizationName}
        organizationId={organizationId}
        initialRole={currentUserRole}
      />

      <div className="border-t border-dashed border-border pt-12">
        <MembersList organizationId={organizationId} initialMembers={members} />
      </div>

      <OrganizationSecuritySection
        organizationId={organizationId}
        organizationName={organizationName}
        userRole={currentUserRole}
      />
    </div>
  );
}
