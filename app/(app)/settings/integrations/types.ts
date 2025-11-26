// app/(app)/settings/integrations/types.ts

// types.ts
export type PlatformDefinition = {
  id:
    | "x"
    | "linkedin"
    | "youtube"
    | "instagram"
    | "facebook"
    | "threads"
    | "tiktok";
  name: string;
  icon: React.ElementType;
  description: string;
};
