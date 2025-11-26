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

export interface LocationSearchResult {
  id: string;
  name: string;
  address: string;
  rating: number | null;
}

export interface InstagramUserSearchResult {
  id: string;
  username: string;
  name: string;
  thumbnailUrl: string;
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

export const searchLocations = async (
  query: string,
  integrationId: string
): Promise<LocationSearchResult[]> => {
  const response = await apiClient.get<LocationSearchResult[]>(
    "/integrations/locations/search",
    {
      params: { q: query, integrationId },
    }
  );
  return response.data;
};

export const searchInstagramUser = async (
  username: string,
  integrationId: string
): Promise<InstagramUserSearchResult> => {
  const response = await apiClient.get<InstagramUserSearchResult>(
    "/integrations/instagram/user-search",
    {
      params: { username, integrationId },
    }
  );
  return response.data;
};
