// components/calendar/types.ts

import type { CalendarMediaItem } from "@/lib/types/publishing";

export type ScheduledPost = {
  id: string;
  title?: string | null;
  content: string;
  scheduledAt: string;
  status:
    | "draft"
    | "scheduled"
    | "sent"
    | "failed"
    | "cancelled"
    | "pending_approval"
    | "rejected";
  platform: string;
  platformUsername: string;
  media: CalendarMediaItem[];
  labels?: string[];
  requestedApproverIds?: string[];
  approvedByIds?: string[];

  // === NEW FIELDS from Backend ===
  integrationId: string;
  postType: string;
  mediaCrops: Record<string, any>;
  threadSize: number;
};

export type CalendarView = "Month" | "Week" | "List";

export type CalendarFilters = {
  status: "all" | "draft" | "scheduled" | "sent";
  channel: string; // 'all' or platform name
  label: string; // 'all' or label name
};
