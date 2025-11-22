// components/post-editor/schedule-card.tsx

"use client";

import * as React from "react";
import {
  CalendarIcon,
  CheckSquare,
  Loader2,
  Clock,
  Repeat2,
  Lightbulb,
} from "lucide-react";
import { format, isToday, isBefore, parse } from "date-fns";
import { useEditorialStore } from "@/lib/store/editorial-store";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface ScheduleCardProps {
  onPublish: () => void;
  isPublishing: boolean;
  isUploading: boolean;
}

const formatToAmPm = (time24: string) => {
  const date = parse(time24, "HH:mm", new Date());
  return format(date, "h:mm a");
};

const recycleIntervalOptions = [
  { value: 7, label: "7 days" },
  { value: 14, label: "14 days" },
  { value: 30, label: "30 days (1 month)" },
  { value: 60, label: "60 days (2 months)" },
  { value: 90, label: "90 days (3 months)" },
  { value: 180, label: "180 days (6 months)" },
  { value: 365, label: "365 days (1 year)" },
];

export default function ScheduleCard({
  onPublish,
  isPublishing,
  isUploading,
}: ScheduleCardProps) {
  const isScheduling = useEditorialStore((state) => state.isScheduling);
  const scheduleDate = useEditorialStore((state) => state.scheduleDate);
  const scheduleTime = useEditorialStore((state) => state.scheduleTime);
  const recycleInterval = useEditorialStore((state) => state.recycleInterval);
  const aiGenerated = useEditorialStore((state) => state.aiGenerated);
  const setState = useEditorialStore((state) => state.setState);

  const onSchedulingChange = (value: boolean) =>
    setState({ isScheduling: value });
  const onDateChange = (date: string) => setState({ scheduleDate: date });
  const onTimeChange = (time: string) => setState({ scheduleTime: time });
  const onRecycleIntervalChange = (interval: string) =>
    setState({ recycleInterval: parseInt(interval) || null });
  const onAiGeneratedChange = (value: boolean) =>
    setState({ aiGenerated: value });

  const selectedDate = React.useMemo(
    () => (scheduleDate ? new Date(scheduleDate) : undefined),
    [scheduleDate]
  );

  const timeSlots = React.useMemo(() => {
    const now = new Date();
    const isSelectedDateToday = selectedDate ? isToday(selectedDate) : false;
    const times: string[] = [];

    for (let i = 0; i < 24 * 60; i += 15) {
      const hours = Math.floor(i / 60);
      const minutes = i % 60;
      const time = `${String(hours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}`;
      times.push(time);
    }

    if (isSelectedDateToday) {
      return times.filter((time) => {
        const slotTime = parse(time, "HH:mm", new Date());
        return !isBefore(slotTime, now);
      });
    }

    return times;
  }, [selectedDate]);

  const selectedTimeAmPm = scheduleTime
    ? formatToAmPm(scheduleTime)
    : "Select time...";

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b-2 border-[--foreground] pb-2">
        <h3 className="font-serif text-xl font-bold text-[--foreground]">
          Schedule
        </h3>
        <CalendarIcon className="h-4 w-4 text-[--muted]" />
      </div>

      <div className="mt-4 space-y-6">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onSchedulingChange(false)}
            className={cn(
              "flex-1 border px-4 py-3 text-sm font-serif transition-all",
              !isScheduling
                ? "border-[--foreground] bg-[--surface] font-bold text-[--foreground] shadow-sm"
                : "border-[--border] bg-transparent text-[--muted-foreground] hover:bg-[--surface-hover]"
            )}
          >
            Post Now
          </button>
          <button
            type="button"
            onClick={() => onSchedulingChange(true)}
            className={cn(
              "flex-1 border px-4 py-3 text-sm font-serif transition-all",
              isScheduling
                ? "border-[--foreground] bg-[--surface] font-bold text-[--foreground] shadow-sm"
                : "border-[--border] bg-transparent text-[--muted-foreground] hover:bg-[--surface-hover]"
            )}
          >
            Schedule
          </button>
        </div>

        {isScheduling && (
          <div className="animate-in fade-in-50 slide-in-from-top-2 border border-[--border] bg-[--surface] p-4">
            <div className="flex flex-col gap-6">
              <div className="border-b border-dashed border-[--border] pb-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) =>
                    onDateChange(date ? format(date, "yyyy-MM-dd") : "")
                  }
                  defaultMonth={selectedDate || new Date()}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  showOutsideDays={false}
                  className="w-full bg-transparent p-0"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 font-serif text-xs font-bold uppercase tracking-wider text-[--muted-foreground]">
                  <Clock className="h-3 w-3" />
                  Publish Time
                </label>
                <Select value={scheduleTime} onValueChange={onTimeChange}>
                  <SelectTrigger className="w-full border-[--border] bg-[--background] font-serif">
                    <SelectValue>{selectedTimeAmPm}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] font-serif">
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {formatToAmPm(time)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {scheduleDate && scheduleTime && (
                <div className="bg-[--surface-hover] p-3 text-center font-serif text-sm italic text-[--foreground]">
                  Posting on{" "}
                  <span className="font-bold not-italic">
                    {format(new Date(scheduleDate), "EEEE, MMMM do")}
                  </span>{" "}
                  at{" "}
                  <span className="font-bold not-italic">
                    {formatToAmPm(scheduleTime)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="border border-[--border] bg-[--surface] p-4 space-y-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-serif text-xs font-bold uppercase tracking-wider text-[--muted-foreground]">
              <Repeat2 className="h-3 w-3" />
              Recycle Post? (Evergreen)
            </label>
            <Select
              value={recycleInterval ? String(recycleInterval) : "null"}
              onValueChange={onRecycleIntervalChange}
            >
              <SelectTrigger className="w-full border-[--border] bg-[--background] font-serif">
                <SelectValue placeholder="Do not recycle" />
              </SelectTrigger>
              <SelectContent className="font-serif">
                <SelectItem value="null">Do not recycle</SelectItem>
                {recycleIntervalOptions.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    Every {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <label className="flex items-center gap-3 font-serif text-sm text-[--foreground] pt-2 cursor-pointer">
            <Input
              type="checkbox"
              checked={aiGenerated}
              onChange={(e) => onAiGeneratedChange(e.target.checked)}
              className="h-4! w-4! rounded border-brand-primary accent-brand-primary shrink-0"
            />
            <Lightbulb className="h-4 w-4 text-[--muted]" />
            Mark as AI Generated
          </label>
        </div>

        <Button
          onClick={onPublish}
          variant="primary"
          size="lg"
          disabled={
            isPublishing ||
            isUploading ||
            (isScheduling && (!scheduleDate || !scheduleTime))
          }
          className="w-full gap-2"
        >
          {isPublishing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckSquare className="h-4 w-4" />
              {isScheduling ? "Confirm Schedule" : "Publish Immediately"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
