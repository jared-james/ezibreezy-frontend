// app/actions/integrations.ts
"use server";

import { serverFetch } from "@/lib/api/server-fetch";
import type {
  Connection,
  LocationSearchResult,
  InstagramUserSearchResult,
  PinterestBoard,
  CreatePinterestBoardPayload,
} from "@/lib/types/integrations";

export async function getConnectionsAction(
  workspaceId: string
): Promise<{ success: boolean; data?: Connection[]; error?: string }> {
  return await serverFetch<Connection[]>("/integrations/connections", {
    workspaceId,
  });
}

export async function disconnectAccountAction(
  platform: string,
  connectionId: string,
  workspaceId: string
): Promise<{ success: boolean; error?: string }> {
  return await serverFetch(
    `/integrations/${platform}/disconnect/${connectionId}`,
    {
      method: "DELETE",
      workspaceId,
    }
  );
}

export async function searchLocationsAction(
  query: string,
  integrationId: string,
  workspaceId: string
): Promise<{
  success: boolean;
  data?: LocationSearchResult[];
  error?: string;
}> {
  const params = new URLSearchParams({ q: query, integrationId });
  return await serverFetch<LocationSearchResult[]>(
    `/integrations/locations/search?${params.toString()}`,
    { workspaceId }
  );
}

export async function searchInstagramUserAction(
  username: string,
  integrationId: string,
  workspaceId: string
): Promise<{
  success: boolean;
  data?: InstagramUserSearchResult;
  error?: string;
}> {
  const params = new URLSearchParams({ username, integrationId });
  return await serverFetch<InstagramUserSearchResult>(
    `/integrations/instagram/user-search?${params.toString()}`,
    { workspaceId }
  );
}

export async function getPinterestBoardsAction(
  integrationId: string,
  workspaceId: string
): Promise<{ success: boolean; data?: PinterestBoard[]; error?: string }> {
  const params = new URLSearchParams({ integrationId });
  return await serverFetch<PinterestBoard[]>(
    `/integrations/pinterest/boards?${params.toString()}`,
    { workspaceId }
  );
}

export async function createPinterestBoardAction(
  payload: CreatePinterestBoardPayload,
  workspaceId: string
): Promise<{ success: boolean; data?: PinterestBoard; error?: string }> {
  return await serverFetch<PinterestBoard>("/integrations/pinterest/boards", {
    method: "POST",
    body: JSON.stringify(payload),
    workspaceId,
  });
}
