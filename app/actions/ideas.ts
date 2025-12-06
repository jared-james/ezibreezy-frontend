// app/actions/ideas.ts
"use server";

import { serverFetch } from "@/lib/api/server-fetch";
import type { Clipping } from "@/lib/types/editorial";

interface BriefingResponse {
  prompt: string;
  clippings: Clipping[];
}

export interface SaveDraftPayload {
  userId: string;
  integrationId: string;
  title?: string;
  content: string;
}

export interface SaveDraftResponse {
  id: string;
  status: "draft";
  title?: string;
  content: string;
}

export async function generateClippingsAction(
  prompt: string,
  workspaceId: string
): Promise<{ success: boolean; data?: Clipping[]; error?: string }> {
  const result = await serverFetch<BriefingResponse>("/briefing/generate", {
    method: "POST",
    body: JSON.stringify({ prompt }),
    workspaceId,
  });

  if (result.success) {
    return { success: true, data: result.data?.clippings || [] };
  }

  return result;
}

export async function saveClippingAsDraftAction(
  payload: SaveDraftPayload,
  workspaceId: string
): Promise<{ success: boolean; data?: SaveDraftResponse; error?: string }> {
  return await serverFetch<SaveDraftResponse>("/briefing/save-draft", {
    method: "POST",
    body: JSON.stringify(payload),
    workspaceId,
  });
}
