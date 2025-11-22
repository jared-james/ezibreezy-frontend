// app/actions/data.ts

"use server";

import { getUserAndOrganization } from "@/lib/auth";
import { authenticatedFetch } from "./billing";

interface UserContextWithIntegrations {
  userId: string;
  organizationId: string;
  connections: {
    id: string;
    platform: string;
    platformUsername: string;
    name: string | null;
    avatarUrl: string | null;
  }[];
}

export async function getClientDataForEditor(): Promise<UserContextWithIntegrations | null> {
  const userContext = await getUserAndOrganization();

  if (!userContext) {
    return null;
  }

  const result = await authenticatedFetch("/integrations/connections");

  if (!result.success) {
    console.error(
      "Failed to fetch connections for client editor:",
      result.error
    );
    return {
      userId: userContext.userId,
      organizationId: userContext.organizationId,
      connections: [],
    };
  }

  return {
    userId: userContext.userId,
    organizationId: userContext.organizationId,
    connections: result.data,
  };
}
