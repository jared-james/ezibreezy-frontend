// app/(app)/calendar/types.ts

import type { CalendarMediaItem } from "@/lib/api/publishing";

export type ScheduledPost = {
  id: string;
  title?: string | null; // ADDED: Optional title for the post/idea
  content: string; // Updated from 'title' to 'content' to match backend DTO
  scheduledAt: string; // ISO 8601 format string
  status: "draft" | "scheduled" | "sent" | "failed" | "cancelled";
  platform: string; // The primary platform (e.g., 'x')
  platformUsername: string; // The username for the connected account
  media: CalendarMediaItem[]; // Array of media objects
};
