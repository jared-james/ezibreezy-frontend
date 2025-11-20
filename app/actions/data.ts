// app/actions/data.ts

"use server";

import { getUserAndOrganization } from "@/lib/auth";
import { authenticatedFetch } from "./billing"; // Re-using generic fetch helper

// Data structure mirroring the necessary context
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

/**
 * Fetches the combined user context and all integrations for the client.
 * This function runs entirely on the server to prevent leakage of server-only modules.
 */
export async function getClientDataForEditor(): Promise<UserContextWithIntegrations | null> {
  const userContext = await getUserAndOrganization();

  if (!userContext) {
    return null;
  }

  // Use the established authenticated fetch helper to get connections
  const result = await authenticatedFetch("/integrations/connections");

  if (!result.success) {
    console.error(
      "Failed to fetch connections for client editor:",
      result.error
    );
    return {
      userId: userContext.userId,
      organizationId: userContext.organizationId,
      connections: [], // Return empty array on failure, do not block app
    };
  }

  return {
    userId: userContext.userId,
    organizationId: userContext.organizationId,
    connections: result.data,
  };
}
