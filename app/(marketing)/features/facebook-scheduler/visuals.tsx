// app/(marketing)/features/facebook-scheduler/visuals.tsx

import { Star, MessageSquare } from "lucide-react";

export function FacebookHeroVisual() {
  return (
    <>
      {/* Page Post Mockup */}
      <div className="max-w-md mx-auto w-full bg-white border border-foreground/10 shadow-sm rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 flex gap-3 border-b border-foreground/5">
          <div className="w-10 h-10 bg-brand-primary/20 rounded-full" />
          <div>
            <div className="h-3 w-32 bg-foreground/10 rounded mb-1" />
            <div className="h-2 w-20 bg-foreground/5 rounded" />
          </div>
        </div>
        {/* Content */}
        <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200" />
          <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-brand-primary border-b-[6px] border-b-transparent ml-1" />
          </div>
        </div>
        {/* Link Preview Bar */}
        <div className="bg-gray-50 p-3 border-t border-foreground/5">
          <div className="h-3 w-3/4 bg-foreground/10 rounded mb-2" />
          <div className="h-2 w-1/2 bg-foreground/5 rounded" />
        </div>
      </div>

      <p className="text-center font-mono text-[9px] uppercase tracking-widest text-brand-primary mt-8 font-bold">
        Rich Media Publishing
      </p>
    </>
  );
}

export function FacebookInboxVisual() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4 pb-4 border-b border-dashed border-foreground/20">
        <Star
          className="w-5 h-5 text-brand-primary shrink-0 mt-1"
          fill="currentColor"
        />
        <div className="space-y-1 flex-1">
          <div className="flex justify-between items-baseline">
            <span className="font-bold text-sm">New Review</span>
            <div className="flex text-brand-primary text-[10px]">★★★★★</div>
          </div>
          <p className="text-xs font-serif text-foreground/80">
            &ldquo;Absolutely love this place. The service is...&rdquo;
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <MessageSquare className="w-5 h-5 text-brand-primary shrink-0 mt-1" />
        <div className="space-y-1 flex-1">
          <div className="flex justify-between items-baseline">
            <span className="font-bold text-sm">New Message</span>
            <span className="text-[9px] text-foreground/40 uppercase">Now</span>
          </div>
          <p className="text-xs font-serif text-foreground/80">
            &ldquo;Do you have this in stock?&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
