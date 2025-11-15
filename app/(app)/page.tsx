// app/(app)/page.tsx

import { redirect } from "next/navigation";

export default function AppRoot() {
  redirect("/dashboard");
}
