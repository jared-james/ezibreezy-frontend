// app/(app)/dashboard/page.tsx

import Link from "next/link";
import { ArrowRight, TrendingUp, Calendar, Lightbulb } from "lucide-react";

export default async function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">
          Here's what's happening with your content today.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/editorial"
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Create New Post</h3>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-blue-100 text-sm">
            Generate ideas, write content, and schedule posts
          </p>
        </Link>

        <Link
          href="/ideas"
          className="bg-white border border-gray-200 p-6 rounded-xl shadow hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between mb-4">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            <span className="text-2xl font-bold text-gray-900">0</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Saved Ideas</h3>
        </Link>

        <Link
          href="/calendar"
          className="bg-white border border-gray-200 p-6 rounded-xl shadow hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-6 h-6 text-green-500" />
            <span className="text-2xl font-bold text-gray-900">0</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Scheduled Posts</h3>
        </Link>
      </div>

      {/* Recent activity / stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent posts */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity yet</p>
            <Link
              href="/editorial"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
            >
              Create your first post
            </Link>
          </div>
        </div>

        {/* Performance overview */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Performance</h2>
            <Link
              href="/analytics"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Posts</span>
              <span className="text-lg font-semibold text-gray-900">0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Engagement Rate</span>
              <span className="text-lg font-semibold text-gray-900">-</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Best Platform</span>
              <span className="text-lg font-semibold text-gray-900">-</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
