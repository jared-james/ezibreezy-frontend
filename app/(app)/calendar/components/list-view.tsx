// app/(app)/calendar/components/list-view.tsx

"use client";

import { Twitter, Instagram, Linkedin, Clock } from "lucide-react";
import { format } from "date-fns";
import type { ScheduledPost } from "../types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ListViewProps {
  posts: ScheduledPost[];
}

const platformIcons = {
  x: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
};

export default function ListView({ posts }: ListViewProps) {
  return (
    <div className="border border-[--border] bg-[--surface] p-6">
      {posts.length === 0 ? (
        <p className="py-8 text-center font-serif text-[--muted-foreground]">
          No posts scheduled for this period.
        </p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const IconGroup = post.platforms.map((p) => platformIcons[p]);
            const postDate = new Date(post.scheduledAt);
            return (
              <div
                key={post.id}
                className="flex items-center gap-4 border border-[--border] bg-[--surface-hover] p-4 transition-colors hover:border-[--border-hover]"
              >
                <div className="flex flex-col items-center">
                  <span className="font-serif text-sm font-bold uppercase tracking-wider text-[--muted-foreground]">
                    {format(postDate, "MMM")}
                  </span>
                  <span className="font-serif text-3xl font-bold text-[--foreground]">
                    {format(postDate, "dd")}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="font-serif font-bold text-[--foreground]">
                    {post.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-4 text-xs text-[--muted-foreground]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      <span>{format(postDate, "h:mm a")}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {IconGroup.map((Icon, index) => (
                        <Icon key={index} className="h-3.5 w-3.5" />
                      ))}
                    </div>
                  </div>
                </div>

                <Link href={`/editorial?draft=${post.id}`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
