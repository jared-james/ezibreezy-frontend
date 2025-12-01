// components/calendar/types.ts

import type { CalendarMediaItem } from "@/lib/api/publishing";

export type ScheduledPost = {
  id: string;
  title?: string | null;
  content: string;
  scheduledAt: string;
  status: "draft" | "scheduled" | "sent" | "failed" | "cancelled";
  platform: string;
  platformUsername: string;
  media: CalendarMediaItem[];
  labels?: string[]; // Added for the new label filter
};

export type CalendarView = "Month" | "Week" | "List";

export type CalendarFilters = {
  status: "all" | "draft" | "scheduled" | "sent";
  channel: string; // 'all' or platform name
  label: string; // 'all' or label name
};
