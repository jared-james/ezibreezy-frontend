// lib/types/integrations.ts

export interface Connection {
  id: string;
  platform:
    | "x"
    | "linkedin"
    | "youtube"
    | "instagram"
    | "facebook"
    | "threads"
    | "tiktok"
    | "pinterest";
  platformUsername: string;
  name: string | null;
  avatarUrl: string | null;
  platformUserId: string;
  requiresReauth?: boolean;
  authErrorMessage?: string | null;
  settings?: {
    loginType?: "facebook_business" | "instagram_business";
    [key: string]: unknown;
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

export interface PinterestBoard {
  id: string;
  name: string;
  privacy: "PUBLIC" | "PROTECTED" | "SECRET";
}

export interface CreatePinterestBoardPayload {
  integrationId: string;
  name: string;
  description?: string;
  privacy?: "PUBLIC" | "SECRET" | "PROTECTED";
}
