// app/(app)/settings/profile/page.tsx

import { getUserAndOrganization } from "@/lib/auth";
import ProfileForm from "./profile-form";

export default async function ProfileSettingsPage() {
  const userContext = await getUserAndOrganization();

  const initialData = {
    initialDisplayName: userContext?.displayName || "Loading...",
    initialEmail: userContext?.email || "loading@example.com",
    initialOrgName: userContext?.organizationName || "Loading Organization...",
    organizationId: userContext?.organizationId || "mock-org-id",
  };

  if (!userContext) {
    return (
      <div className="text-error font-serif">
        Error: Authentication context missing.
      </div>
    );
  }

  return <ProfileForm {...initialData} />;
}
