// components/post-editor/panels/schedule-panel.tsx

"use client";

import * as React from "react";
import { CalendarIcon, CheckSquare, Loader2, Clock, Check } from "lucide-react";
import { format, isToday, isBefore, parse } from "date-fns";
import { usePublishingStore } from "@/lib/store/editorial/publishing-store";
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

interface ScheduleCardProps {
  onPublish: () => void;
  isPublishing: boolean;
  isUploading: boolean;
  hasMediaConflicts?: boolean;
  hasMinimumContent?: boolean;
}

const formatToAmPm = (time24: string) => {
  const date = parse(time24, "HH:mm", new Date());
  return format(date, "h:mm a");
};

export default function ScheduleCard({
  onPublish,
  isPublishing,
  isUploading,
  hasMediaConflicts = false,
  hasMinimumContent = true,
}: ScheduleCardProps) {
  const isScheduling = usePublishingStore((state) => state.isScheduling);
  const scheduleDate = usePublishingStore((state) => state.scheduleDate);
  const scheduleTime = usePublishingStore((state) => state.scheduleTime);
  const setPublishingState = usePublishingStore(
    (state) => state.setPublishingState
  );

  const onSchedulingChange = (value: boolean) =>
    setPublishingState({ isScheduling: value });
  const onDateChange = (date: string) =>
    setPublishingState({ scheduleDate: date });
  const onTimeChange = (time: string) =>
    setPublishingState({ scheduleTime: time });

  React.useEffect(() => {
    onSchedulingChange(false);
  }, []);

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
      <div className="flex items-center justify-between border-b-2 pb-4">
        <h3 className="font-serif text-2xl font-bold">Schedule</h3>
        <CalendarIcon className="w-5 h-5 text-[--muted-foreground]" />
      </div>

      <div className="mt-6 space-y-6">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onSchedulingChange(false)}
            className={cn(
              "flex flex-1 cursor-pointer items-center justify-center px-4 py-3 text-sm font-serif rounded-md transition-all",
              !isScheduling
                ? "border-2 border-brand-primary bg-[--surface] font-bold text-brand-primary shadow-sm"
                : "border border-[--border] bg-transparent text-[--muted-foreground] hover:bg-[--surface-hover]"
            )}
          >
            {!isScheduling && <Check className="mr-2 h-4 w-4" />}
            Post Now
          </button>
          <button
            type="button"
            onClick={() => onSchedulingChange(true)}
            className={cn(
              "flex flex-1 cursor-pointer items-center justify-center px-4 py-3 text-sm font-serif rounded-md transition-all",
              isScheduling
                ? "border-2 border-brand-primary bg-[--surface] font-bold text-brand-primary shadow-sm"
                : "border border-[--border] bg-transparent text-[--muted-foreground] hover:bg-[--surface-hover]"
            )}
          >
            {isScheduling && <Check className="mr-2 h-4 w-4" />}
            Schedule
          </button>
        </div>

        {isScheduling && (
          <div className="animate-in fade-in-50 slide-in-from-top-2 border border-[--border] bg-[--surface] p-6 rounded-lg shadow-sm">
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

              <div className="space-y-3">
                <label className="eyebrow flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  Publish Time
                </label>
                <Select value={scheduleTime} onValueChange={onTimeChange}>
                  <SelectTrigger className="w-full border-[--border] bg-[--background] font-serif h-10">
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
                <div className="bg-[--surface-hover] p-3 rounded-md text-center font-serif text-sm italic text-[--foreground] border border-[--border]">
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

        <Button
          onClick={onPublish}
          variant="primary"
          size="lg"
          disabled={
            !hasMinimumContent ||
            isPublishing ||
            isUploading ||
            hasMediaConflicts ||
            (isScheduling && (!scheduleDate || !scheduleTime))
          }
          className="w-full gap-2 h-12 text-base shadow-md hover:shadow-lg transition-all"
        >
          {isPublishing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckSquare className="h-5 w-5" />
              {isScheduling ? "Confirm Schedule" : "Publish Immediately"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
