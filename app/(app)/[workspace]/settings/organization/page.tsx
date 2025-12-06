// app/(app)/[workspace]/settings/organization/page.tsx

// app/(app)/settings/organization/page.tsx

import { getUserAndOrganization } from "@/lib/auth";
import OrganizationForm from "@/components/settings/organization/organization-form";
import { MembersList } from "@/components/settings/organization/members-list";
import { OrganizationSecuritySection } from "@/components/settings/organization/security-section";
import { redirect } from "next/navigation";

export default async function OrganizationSettingsPage() {
  const userContext = await getUserAndOrganization();

  if (!userContext) {
    redirect("/auth/login");
  }

  return (
    <div className="space-y-12">
      <OrganizationForm
        initialOrgName={userContext.organizationName}
        organizationId={userContext.organizationId}
      />

      <div className="border-t border-dashed border-border pt-12">
        <MembersList organizationId={userContext.organizationId} />
      </div>

      {/* Security / Danger Zone */}
      {/* This component handles its own visibility checks (owner-only) */}
      <OrganizationSecuritySection
        organizationId={userContext.organizationId}
        organizationName={userContext.organizationName}
      />
    </div>
  );
}
