// components/ui/button.tsx

"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-surface text-foreground border border-border font-serif uppercase tracking-wide text-xs shadow-[0_0_0_1px_rgba(15,23,42,0.04),0_1px_1px_rgba(15,23,42,0.06)] hover:bg-surface-hover transition-colors",
        primary:
          "bg-brand-primary text-brand-primary-foreground border border-brand-primary font-serif uppercase tracking-wide text-xs shadow-sm hover:bg-brand-primary-hover",
        outline:
          "bg-transparent border border-border text-foreground font-serif uppercase tracking-wide text-xs hover:bg-surface-hover",
        ghost:
          "bg-transparent text-foreground font-serif uppercase tracking-wide text-xs hover:bg-surface-hover",
        destructive:
          "bg-error text-error-foreground border border-error font-serif uppercase tracking-wide text-xs shadow-sm hover:bg-error-hover",
        link: "text-brand-primary underline-offset-4 underline font-serif text-sm tracking-wide hover:text-brand-primary-hover",
      },
      size: {
        default:
          "h-9 px-4 py-2 rounded-sm text-sm [&_svg:not([class*='size-'])]:size-4",
        sm: "h-8 px-3 rounded-sm text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 px-6 rounded-sm text-sm [&_svg:not([class*='size-'])]:size-4",
        icon: "size-9 rounded-sm [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(
        "outline-none focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px]",
        "disabled:opacity-50 disabled:pointer-events-none",
        buttonVariants({ variant, size, className })
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
