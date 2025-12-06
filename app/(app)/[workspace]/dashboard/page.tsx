// app/(app)/[workspace]/dashboard/page.tsx

// Force dynamic rendering - no caching for dashboard
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ workspace: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DashboardPage({ params }: PageProps) {
  // Extract workspace from URL route params
  const { workspace } = await params;

  // For future: Fetch dashboard data using serverFetch
  // const dashboardData = await serverFetch('/dashboard/summary', { workspaceId });

  return (
    <div className="w-full flex items-center justify-center bg-[--background] px-4">
      <div className="text-center space-y-6">
        <div className="border-b-4 border-double border-[--foreground] pb-4">
          <p className="eyebrow mb-2">Dashboard</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold uppercase tracking-tight text-[--foreground]">
            Coming Soon
          </h1>
        </div>

        <p className="font-serif text-[--muted] italic text-lg">
          Your command center for ideas, posts, analytics and insights.
        </p>

        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === "development" && workspace && (
          <p className="text-xs text-[--muted-foreground] font-mono">
            Workspace: {workspace}
          </p>
        )}
      </div>
    </div>
  );
}
