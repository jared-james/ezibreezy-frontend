// app/(app)/settings/profile/page.tsx
import { getUserAndOrganization } from "@/lib/auth";
import ProfileForm from "./profile-form";

export default async function ProfileSettingsPage() {
  const userContext = await getUserAndOrganization();

  // We only need personal info here now
  const initialData = {
    initialDisplayName: userContext?.displayName || "Loading...",
    initialEmail: userContext?.email || "loading@example.com",
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
