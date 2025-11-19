// app/(app)/editorial/components/schedule-card.tsx

"use client";

import * as React from "react";
import { CalendarIcon, CheckSquare, Loader2, Clock } from "lucide-react";
import { format, isToday, isBefore, parse } from "date-fns";

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
  isScheduling: boolean;
  scheduleDate?: string;
  scheduleTime?: string;
  onSchedulingChange: (value: boolean) => void;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onPublish: () => void;
  isPublishing: boolean;
  isUploading: boolean;
}

// Helper function to format 24-hour time to 12-hour AM/PM
const formatToAmPm = (time24: string) => {
  const date = parse(time24, "HH:mm", new Date());
  return format(date, "h:mm a");
};

export default function ScheduleCard({
  isScheduling,
  scheduleDate,
  scheduleTime,
  onSchedulingChange,
  onDateChange,
  onTimeChange,
  onPublish,
  isPublishing,
  isUploading,
}: ScheduleCardProps) {
  const selectedDate = scheduleDate ? new Date(scheduleDate) : undefined;

  const timeSlots = React.useMemo(() => {
    const now = new Date();
    const isSelectedDateToday = selectedDate ? isToday(selectedDate) : false;
    const times: string[] = [];

    // 1. Generate all time slots for a full 24-hour day
    for (let i = 0; i < 24 * 60; i += 15) {
      const hours = Math.floor(i / 60);
      const minutes = i % 60;
      const time = `${String(hours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}`;
      times.push(time);
    }

    // 2. If today is selected, filter out past times
    if (isSelectedDateToday) {
      return times.filter((time) => {
        // Comparison logic remains the same, using the 24-hour format
        const slotTime = parse(time, "HH:mm", new Date());
        return !isBefore(slotTime, now);
      });
    }

    // 3. Otherwise, return all times
    return times;
  }, [selectedDate]);

  // Format the selected time for display in the trigger
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
        {/* Mode Selection */}
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

        {/* Date & Time Picker */}
        {isScheduling && (
          <div className="animate-in fade-in-50 slide-in-from-top-2 border border-[--border] bg-[--surface] p-4">
            <div className="flex flex-col gap-6">
              {/* Calendar Wrapper */}
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

              {/* Time Select */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-serif text-xs font-bold uppercase tracking-wider text-[--muted-foreground]">
                  <Clock className="h-3 w-3" />
                  Publish Time
                </label>
                <Select value={scheduleTime} onValueChange={onTimeChange}>
                  <SelectTrigger className="w-full border-[--border] bg-[--background] font-serif">
                    {/* Display the AM/PM format here */}
                    <SelectValue>{selectedTimeAmPm}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] font-serif">
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {/* Show AM/PM format to the user */}
                        {formatToAmPm(time)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Human Readable Summary */}
              {scheduleDate && scheduleTime && (
                <div className="bg-[--surface-hover] p-3 text-center font-serif text-sm italic text-[--foreground]">
                  Posting on{" "}
                  <span className="font-bold not-italic">
                    {format(new Date(scheduleDate), "EEEE, MMMM do")}
                  </span>{" "}
                  at {/* Also display AM/PM format in the summary */}
                  <span className="font-bold not-italic">
                    {formatToAmPm(scheduleTime)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
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
