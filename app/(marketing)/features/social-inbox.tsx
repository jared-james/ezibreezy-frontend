// app/(marketing)/features/social-inbox.tsx

// components/marketing/features/social-inbox.tsx

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SocialInboxProps {
  title?: string;
  description: ReactNode;
  visual: ReactNode; // The specific inbox UI (comments, stars, etc)
  className?: string;
}

export default function SocialInbox({
  title = "Social Inbox",
  description,
  visual,
  className,
}: SocialInboxProps) {
  return (
    <section className={cn("mb-24", className)}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Visual */}
        <div className="md:col-span-5 order-2 md:order-1">
          {/* Standard container style for the inbox visual */}
          <div className="relative border border-foreground/20 bg-surface p-8">
            {visual}
          </div>
        </div>

        {/* Editorial Copy */}
        <div className="md:col-span-7 order-1 md:order-2">
          <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
            {title}
          </h2>

          <div className="prose prose-lg font-serif text-foreground/80 leading-relaxed">
            {description}
          </div>
        </div>
      </div>
    </section>
  );
}
