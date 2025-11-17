// lib/api/ideas.ts
import apiClient from "./index"; // Import the configured client

// Define the types/interfaces related to this feature
export interface Clipping {
  title: string;
  body: string;
  hashtags?: string[]; // Made optional to match backend
}

interface BriefingResponse {
  prompt: string;
  clippings: Clipping[];
}

/**
 * Generates new idea clippings based on a user prompt.
 */
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

/**
 * Saves a clipping to the user's idea archive.
 * (This is an example of another function you might add here)
 */
// export const saveClipping = async (clipping: Clipping) => {
//   const response = await apiClient.post('/ideas/save', clipping);
//   return response.data;
// }
