// components/analytics/components/analytics-error.tsx

"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

interface AnalyticsErrorProps {
  error: unknown;
  onRetry: () => void;
  integrationId: string | null;
}

function getErrorMessage(error: unknown): {
  title: string;
  description: string;
} {
  const errorObj = error as {
    response?: { status?: number; data?: { message?: string } };
  };
  const status = errorObj?.response?.status;

  switch (status) {
    case 401:
      return {
        title: "Authentication Required",
        description: "Please log in again to view analytics.",
      };
    case 404:
      return {
        title: "Integration Not Found",
        description:
          "The selected Instagram account could not be found. It may have been disconnected.",
      };
    case 400:
      return {
        title: "Invalid Request",
        description:
          "There was an issue with your request. Please try different filters.",
      };
    default:
      return {
        title: "Failed to Load Analytics",
        description:
          "We couldn't retrieve your analytics data. Please try again.",
      };
  }
}

export default function AnalyticsError({
  error,
  onRetry,
  integrationId,
}: AnalyticsErrorProps) {
  const { title, description } = getErrorMessage(error);
  const errorObj = error as {
    response?: { status?: number };
    message?: string;
  };

  console.error("[Analytics Error]", {
    status: errorObj?.response?.status,
    message: errorObj?.message,
    integrationId,
  });

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-[#fdfbf7]">
      <div className="relative w-full max-w-md bg-white border-[3px] border-black shadow-[8px_8px_0_0_#ef4444] p-10 animate-in zoom-in-95 duration-300">
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 border-2 border-red-100 text-error">
            <AlertCircle className="h-8 w-8" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="eyebrow text-error mb-2">Error encountered</p>
            <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-foreground leading-none">
              {title}
            </h1>
          </div>

          <div className="h-px w-16 bg-border mx-auto border-t-2 border-dotted border-foreground/20" />

          <p className="font-serif text-sm text-muted-foreground italic leading-relaxed">
            {description}
          </p>

          <div className="pt-4">
            <button
              onClick={onRetry}
              className="btn btn-primary w-full h-11 text-sm shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
              aria-label="Retry loading analytics"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
