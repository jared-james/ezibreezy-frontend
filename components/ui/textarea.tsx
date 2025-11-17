// components/ui/textarea.tsx

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex w-full min-h-24 field-sizing-content",
        "rounded-sm border border-border bg-surface",
        "px-3 py-2 font-serif text-sm text-foreground",
        "shadow-[0_0_0_1px_rgba(15,23,42,0.02)] transition-[color,box-shadow]",
        "outline-none placeholder:text-muted-foreground",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px]",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
