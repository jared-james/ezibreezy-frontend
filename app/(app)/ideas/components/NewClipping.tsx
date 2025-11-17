// app/(app)/ideas/components/NewClipping.tsx

import { BookmarkPlus } from "lucide-react";

export default function NewClipping() {
  return (
    <div className="bg-[--surface] border border-[--border] p-6">
      <h2 className="font-serif text-2xl font-bold text-[--foreground] mb-6">
        Create a New Clipping
      </h2>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="manual-title"
            className="eyebrow text-[--foreground]"
          >
            Title / Headline
          </label>
          <input
            id="manual-title"
            type="text"
            placeholder="Your next big idea..."
            className="w-full font-serif p-3 border border-[--border] bg-white mt-2"
          />
        </div>
        <div>
          <label
            htmlFor="manual-desc"
            className="eyebrow text-[--foreground]"
          >
            Notes / Description
          </label>
          <textarea
            id="manual-desc"
            rows={8}
            placeholder="Jot down your thoughts, links, or any details..."
            className="w-full bg-white font-serif p-3 border border-[--border] mt-2"
          />
        </div>
        <div className="flex justify-end">
          <button className="btn btn-primary px-8">
            <BookmarkPlus className="w-4 h-4" /> Save Clipping
          </button>
        </div>
      </div>
    </div>
  );
}
