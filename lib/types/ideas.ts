// lib/types/ideas.ts

import type { Clipping } from "@/lib/types/editorial";

export type { Clipping };

export interface BriefingResponse {
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
