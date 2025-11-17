// app/(app)/calendar/page.tsx
// Content calendar - view and manage scheduled posts

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Clock,
} from "lucide-react";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get current month/year
  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Get days in month for calendar grid
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth();

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Content Calendar
            </h1>
            <p className="text-gray-600">
              View and manage your scheduled posts
            </p>
          </div>
          <Link
            href="/editorial"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Post
          </Link>
        </div>
      </div>

      {/* Calendar view selector */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900 min-w-[200px] text-center">
            {monthYear}
          </h2>
          <button
            onClick={() => navigateMonth("next")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm">
            Month
          </button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm">
            Week
          </button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm">
            List
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-4 text-center text-sm font-semibold text-gray-700 bg-gray-50"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="border-r border-b border-gray-200 p-2 h-32 bg-gray-50"
            />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday =
              day === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear();

            return (
              <div
                key={day}
                className="border-r border-b border-gray-200 p-2 h-32 hover:bg-gray-50 transition-colors relative"
              >
                <div
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium ${
                    isToday
                      ? "bg-blue-600 text-white"
                      : "text-gray-700"
                  }`}
                >
                  {day}
                </div>

                {/* Placeholder for scheduled posts (empty state) */}
                <div className="mt-2 space-y-1">
                  {/* Posts will appear here */}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty state message */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
        <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No scheduled posts yet
        </h3>
        <p className="text-gray-600 mb-4">
          Start creating content in the Editorial room and schedule your posts
          to see them here.
        </p>
        <Link
          href="/editorial"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Create Your First Post
          <Plus className="w-4 h-4" />
        </Link>
      </div>

      {/* Upcoming posts sidebar (for when there are scheduled posts) */}
      {false && (
        <div className="mt-8 bg-white rounded-xl shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Posts
          </h3>
          <div className="space-y-4">
            {/* Example upcoming post */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Post title goes here
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Tomorrow at 10:00 AM • Twitter, LinkedIn
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
