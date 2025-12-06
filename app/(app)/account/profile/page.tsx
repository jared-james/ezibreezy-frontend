// app/(app)/account/profile/page.tsx

// app/(app)/settings/profile/page.tsx
import { getUserAndOrganization } from "@/lib/auth";
import ProfileForm from "@/components/settings/profile/profile-form";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ProfileSettingsPage() {
  const userContext = await getUserAndOrganization();

  if (!userContext) {
    redirect("/auth/login");
  }

  return (
    <ProfileForm
      initialDisplayName={userContext.displayName}
      initialEmail={userContext.email}
    />
  );
}
