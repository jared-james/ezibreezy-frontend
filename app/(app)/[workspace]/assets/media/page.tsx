// app/(app)/[workspace]/assets/media/page.tsx

import { createClient } from "@/lib/supabase/server";
import MediaRoom from "@/components/media-room/media-room";
import { redirect } from "next/navigation";

// We force dynamic because we check auth session on every request
// but we no longer block for data fetching.
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ workspace: string }>;
}

export default async function MediaRoomPage({ params }: PageProps) {
  const mountStart = performance.now();

  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const { workspace: workspaceId } = await params;

  console.log(
    `[SSR] 🟢 Rendering Media Page Shell for Workspace: ${workspaceId}`
  );

  // PERFORMANCE: We have removed the blocking QueryClient prefetch here.
  // The client will initiate the cursor-based fetch immediately upon hydration.
  // This allows the "Shell" (Sidebar, Header) to paint instantly.

  const duration = performance.now() - mountStart;
  console.log(
    `[SSR] 🚀 Shell Rendered in ${duration.toFixed(2)}ms (Non-blocking)`
  );

  return <MediaRoom />;
}
