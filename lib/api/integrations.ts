// lib/api/integrations.ts

import apiClient from "./index";

export interface Connection {
  id: string;
  platform:
    | "x"
    | "linkedin"
    | "youtube"
    | "instagram"
    | "facebook"
    | "threads"
    | "tiktok";
  platformUsername: string;
  name: string | null;
  avatarUrl: string | null;
  platformUserId: string;
  requiresReauth?: boolean;
  authErrorMessage?: string | null;
  settings?: {
    loginType?: "facebook_business" | "instagram_business";
    [key: string]: any;
  };
}

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
