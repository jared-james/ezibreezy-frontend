// lib/api-client.ts
import axios from "axios";

export interface Clipping {
  title: string;
  body: string;
  hashtags: string[];
}

interface BriefingResponse {
  prompt: string;
  clippings: Clipping[];
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

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
