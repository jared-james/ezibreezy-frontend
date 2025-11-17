// app/(app)/settings/page.tsx
// Settings hub - redirects to profile

import { redirect } from "next/navigation";

export default function SettingsPage() {
  redirect("/settings/profile");
}
