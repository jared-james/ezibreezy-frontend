// lib/api/integrations.ts
import apiClient from "./index";

export interface Connection {
  id: string;
  platform: "x" | "linkedin" | "youtube" | "instagram";
  platformUsername: string;
  name: string | null;
  avatarUrl: string | null;
  platformUserId: string;
}

/**
 * Fetches all of the current user's connections from the backend.
 */
export const getConnections = async (): Promise<Connection[]> => {
  const response = await apiClient.get<Connection[]>(
    "/integrations/connections"
  );

  return response.data;
};

export const disconnectAccount = async (
  platform: string,
  connectionId: string
): Promise<void> => {
  await apiClient.delete(
    `/integrations/${platform}/disconnect/${connectionId}`
  );
};
