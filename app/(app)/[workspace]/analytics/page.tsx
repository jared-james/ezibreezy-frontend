// app/(app)/[workspace]/analytics/page.tsx

import AnalyticsClient from "./analytics-client";
import { getConnectionsAction } from "@/app/actions/integrations";
import { BarChart3 } from "lucide-react";

// Analytics data is read-heavy and changes less frequently
// Cache for 5 minutes to reduce backend load
export const revalidate = 300;

interface PageProps {
  params: Promise<{ workspace: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AnalyticsPage({ params }: PageProps) {
  const { workspace: workspaceId } = await params;

  // Check if user has any connected analytics accounts server-side
  const connectionsResult = await getConnectionsAction(workspaceId);
  const connections = connectionsResult.success
    ? connectionsResult.data || []
    : [];

  const analyticsConnections = connections.filter(
    (conn) => conn.platform === "instagram" || conn.platform === "youtube"
  );

  // If no analytics connections exist, render "No Signal" UI immediately
  if (analyticsConnections.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-[#f4f4f0]">
        <div className="max-w-md space-y-6 p-8 border-[3px] border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] bg-white">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-black bg-muted">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold uppercase tracking-wide text-foreground">
              Establish Uplink
            </h2>
            <p className="font-serif text-sm text-muted-foreground leading-relaxed">
              Wire service disconnected. Connect your Instagram or YouTube
              account in Settings to receive data transmission.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AnalyticsClient
      workspaceId={workspaceId}
      initialConnections={analyticsConnections}
    />
  );
}
