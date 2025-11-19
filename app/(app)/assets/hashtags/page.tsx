// app/(app)/assets/hashtags/page.tsx

import { Hash } from "lucide-react";

export default function HashtagsPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[--background] px-4">
      <div className="text-center space-y-6 max-w-2xl">
        <div className="border-b-4 border-double border-[--foreground] pb-4">
          <p className="eyebrow mb-2">Assets & Strategy</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold uppercase tracking-tight text-[--foreground]">
            Hashtags (Coming Soon)
          </h1>
        </div>

        <div className="flex items-center justify-center text-[--muted]">
          <Hash className="w-10 h-10" />
        </div>

        <p className="font-serif text-[--muted] italic text-lg leading-relaxed">
          Create and manage curated hashtag lists for quick insertion into your
          captions across different platforms and content niches.
        </p>
      </div>
    </div>
  );
}
