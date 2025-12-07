// app/(app)/[workspace]/settings/profile/page.tsx

import { getUserAndOrganization } from "@/lib/auth";
import ProfileForm from "@/components/settings/profile/profile-form";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function WorkspaceProfilePage() {
  // We reuse the existing auth utility to get user details
  const userContext = await getUserAndOrganization();

  if (!userContext) {
    redirect("/auth/login");
  }

  return (
    <div>
      <div className="mb-8 border-b-2 border-foreground pb-3">
        <h2 className="font-serif text-2xl font-bold text-foreground">
          User Profile
        </h2>
        <p className="font-serif text-sm text-muted-foreground mt-1">
          Manage your personal account settings and login credentials.
        </p>
      </div>

      <ProfileForm
        initialDisplayName={userContext.displayName}
        initialEmail={userContext.email}
      />
    </div>
  );
}
