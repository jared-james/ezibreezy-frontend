// app/(app)/[workspace]/ideas/page.tsx
// TEMPORARILY DISABLED - Will be redesigned

/*
import IdeasClient from "./ideas-client";

// Force dynamic rendering - no caching for ideas page (status updates)
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ workspace: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function IdeasPage({ params }: PageProps) {
  const { workspace: workspaceId } = await params;

  // For future: Fetch initial ideas data server-side
  // const ideasResult = await serverFetch('/ideas', { workspaceId });

  return <IdeasClient workspaceId={workspaceId} />;
}
*/

export default function IdeasPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-[--muted-foreground] font-serif">
        Ideas feature coming soon...
      </p>
    </div>
  );
}
