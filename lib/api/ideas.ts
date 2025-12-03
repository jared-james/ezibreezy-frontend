// lib/api/ideas.ts
import apiClient from "./index";
import type { Clipping } from "@/lib/types/editorial";

export type { Clipping };

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

export const generateClippings = async (
  prompt: string
): Promise<Clipping[]> => {
  const response = await apiClient.post<BriefingResponse>(
    "/briefing/generate",
    {
      prompt,
    }
  );
  return response.data.clippings;
};

export const saveClippingAsDraft = async (
  payload: SaveDraftPayload
): Promise<SaveDraftResponse> => {
  const response = await apiClient.post<SaveDraftResponse>(
    "/briefing/save-draft",
    payload
  );
  return response.data;
};
