// app/(app)/assets/media/page.tsx

import { Upload } from "lucide-react";

export default function MediaRoomPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[--background] px-4">
      <div className="text-center space-y-6 max-w-2xl">
        <div className="border-b-4 border-double border-[--foreground] pb-4">
          <p className="eyebrow mb-2">Assets & Storage</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold uppercase tracking-tight text-[--foreground]">
            Media Room (Coming Soon)
          </h1>
        </div>

        <div className="flex items-center justify-center text-[--muted]">
          <Upload className="w-10 h-10" />
        </div>

        <p className="font-serif text-[--muted] italic text-lg leading-relaxed">
          Manage all your uploaded images, videos, and creative assets in a
          single, searchable place for easy access in your editorial flow.
        </p>
      </div>
    </div>
  );
}
