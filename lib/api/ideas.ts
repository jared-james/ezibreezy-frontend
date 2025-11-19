// lib/api/ideas.ts
import apiClient from "./index";
import type { Clipping } from "@/lib/types/editorial";

export type { Clipping };

interface BriefingResponse {
  prompt: string;
  clippings: Clipping[];
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
