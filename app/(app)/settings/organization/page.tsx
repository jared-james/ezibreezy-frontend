// app/(app)/settings/organization/page.tsx

import { getUserAndOrganization } from "@/lib/auth";
import OrganizationForm from "./organization-form";
import { redirect } from "next/navigation";

export default async function OrganizationSettingsPage() {
  const userContext = await getUserAndOrganization();

  if (!userContext) {
    redirect("/auth/login");
  }

  // We pass the data to the client component
  // The client component will handle the extra layer of "Hide if not admin"
  // though the nav link is already hidden.
  return (
    <OrganizationForm
      initialOrgName={userContext.organizationName}
      organizationId={userContext.organizationId}
    />
  );
}
