"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const channelCircleButtonVariants = cva(
  "w-12 h-12 rounded-full flex items-center justify-center transition-all outline-none shadow-[0_0_0_1px_rgba(15,23,42,0.04)]",
  {
    variants: {
      state: {
        inactive: "border border-border bg-surface hover:bg-surface-hover",
        active: "border-2 border-brand-primary bg-surface",
        disabled:
          "border border-border bg-surface opacity-40 cursor-not-allowed",
      },
    },
    defaultVariants: {
      state: "inactive",
    },
  }
);

export interface ChannelCircleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof channelCircleButtonVariants> {}

export function ChannelCircleButton({
  className,
  state,
  ...props
}: ChannelCircleButtonProps) {
  return (
    <button
      data-slot="channel-circle-button"
      className={cn(channelCircleButtonVariants({ state }), className)}
      {...props}
    />
  );
}
