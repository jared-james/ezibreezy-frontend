// app/(app)/[workspace]/settings/integrations/page.tsx

import { getWorkspaceDetails } from "@/app/actions/workspaces";
import { getConnectionsAction } from "@/app/actions/integrations";
import { IntegrationsSettings } from "@/components/settings/integrations/index";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ workspace: string }>;
}

export default async function IntegrationsPage({ params }: PageProps) {
  const { workspace: workspaceSlug } = await params;

  const workspaceResult = await getWorkspaceDetails(workspaceSlug);

  if (!workspaceResult.success || !workspaceResult.data) {
    redirect("/dashboard");
  }

  const workspaceId = workspaceResult.data.id;
  const connectionsResult = await getConnectionsAction(workspaceId);
  const connections = connectionsResult.success
    ? connectionsResult.data || []
    : [];

  return (
    <IntegrationsSettings
      initialConnections={connections}
      workspaceId={workspaceId}
    />
  );
}
