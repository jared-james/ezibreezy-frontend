// app/(app)/calendar/types.ts

export type ScheduledPost = {
  id: string;
  title: string;
  scheduledAt: string; // ISO 8601 format string
  platforms: ("x" | "instagram" | "linkedin")[];
};
