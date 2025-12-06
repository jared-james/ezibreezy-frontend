// app/(app)/[workspace]/settings/integrations/page.tsx

import { getConnectionsAction } from "@/app/actions/integrations";
import { IntegrationsSettings } from "@/components/settings/integrations/index";

interface PageProps {
  params: Promise<{ workspace: string }>;
}

export default async function IntegrationsPage({ params }: PageProps) {
  const { workspace: workspaceSlug } = await params;

  const connectionsResult = await getConnectionsAction(workspaceSlug);

  const connections = connectionsResult.success
    ? connectionsResult.data || []
    : [];

  return (
    <IntegrationsSettings
      initialConnections={connections}
      workspaceId={workspaceSlug}
    />
  );
}
