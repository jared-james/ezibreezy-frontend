// components/ui/sonner.tsx

"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps, toast } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          error:
            "!bg-error !text-error-foreground !border-error font-medium shadow-lg !relative !pr-10", // Added padding-right so text doesn't hit the X
          closeButton:
            "!absolute !left-auto !right-3 !top-3 !transform-none !bg-transparent !border-none !text-error-foreground/80 hover:!text-error-foreground hover:!bg-black/10 !rounded-md !transition-colors !size-6 !p-0.5 [&>svg]:!size-5", // Repositioned inside, made transparent and larger
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

/**
 * Show a persistent error toast that requires manual dismissal.
 * Use for important errors that the user needs to acknowledge.
 */
const showError = (message: string) => {
  return toast.error(message, {
    duration: Infinity,
    closeButton: true,
  });
};

export { Toaster, showError };
