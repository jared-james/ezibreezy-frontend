// app/(app)/analytics/page.tsx

"use client";

import { useState } from "react";
import {
  TrendingUp,
  Users,
  Heart,
  Share2,
  BarChart3,
  Calendar,
} from "lucide-react";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600">
              Track your content performance across platforms
            </p>
          </div>

          {/* Time range selector */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            {[
              { label: "7 days", value: "7d" as const },
              { label: "30 days", value: "30d" as const },
              { label: "90 days", value: "90d" as const },
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range.value
                    ? "bg-white text-gray-900 shadow"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "Total Posts",
            value: "0",
            change: "+0%",
            icon: Calendar,
            color: "blue",
          },
          {
            label: "Total Reach",
            value: "0",
            change: "+0%",
            icon: Users,
            color: "green",
          },
          {
            label: "Engagement",
            value: "0",
            change: "+0%",
            icon: Heart,
            color: "pink",
          },
          {
            label: "Shares",
            value: "0",
            change: "+0%",
            icon: Share2,
            color: "purple",
          },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="bg-white rounded-xl shadow border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">
                  {metric.label}
                </span>
                <div
                  className={`p-2 rounded-lg bg-${metric.color}-100 text-${metric.color}-600`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {metric.value}
              </p>
              <p className="text-sm text-gray-600">
                <span className="text-green-600 font-medium">
                  {metric.change}
                </span>{" "}
                vs last period
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Engagement over time */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Engagement Over Time
          </h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">Chart will appear here</p>
              <p className="text-xs mt-1">Once you have analytics data</p>
            </div>
          </div>
        </div>

        {/* Platform breakdown */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Platform Performance
          </h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">Platform breakdown</p>
              <p className="text-xs mt-1">Will show after publishing posts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top performing posts */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top Performing Posts
        </h3>

        {/* Empty state */}
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <h4 className="text-base font-medium text-gray-900 mb-2">
            No analytics data yet
          </h4>
          <p className="text-gray-600 text-sm mb-4">
            Start creating and publishing content to see your performance
            metrics here.
          </p>
        </div>

        {/* Example of how posts will look (hidden) */}
        {false && (
          <div className="divide-y divide-gray-200">
            {[1, 2, 3].map((i) => (
              <div key={i} className="py-4 flex items-center gap-4">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    Post title goes here
                  </h4>
                  <p className="text-sm text-gray-600">
                    Published on Twitter • 2 days ago
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">1.2K</p>
                    <p className="text-xs text-gray-600">Views</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">84</p>
                    <p className="text-xs text-gray-600">Likes</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">12</p>
                    <p className="text-xs text-gray-600">Shares</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
