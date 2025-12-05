// app/(app)/error.tsx

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global Error Boundary for App Routes
 *
 * Catches errors from server components and provides user-friendly fallback UI.
 * Special handling for 403 Forbidden errors (workspace access denied).
 */
export default function AppError({ error, reset }: ErrorProps) {
  // Check if this is a 403 Forbidden error (workspace access denied)
  const is403 =
    error.message?.includes("403") || error.message?.includes("Forbidden");

  if (is403) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[--background] p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="font-serif text-4xl font-bold text-[--foreground]">
              Access Denied
            </h1>
            <p className="text-lg text-[--muted-foreground]">
              You no longer have access to this workspace.
            </p>
          </div>

          <p className="text-sm text-[--muted]">
            You may have been removed from this workspace, or it may have been
            deleted. Please contact your workspace administrator if you believe
            this is a mistake.
          </p>

          <Link href="/dashboard">
            <Button variant="primary" className="w-full">
              Return to Dashboard
            </Button>
          </Link>

          <p className="text-xs text-[--muted-foreground]">
            You&apos;ll be redirected to your default workspace.
          </p>
        </div>
      </div>
    );
  }

  // Generic error fallback
  return (
    <div className="flex min-h-screen items-center justify-center bg-[--background] p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="font-serif text-4xl font-bold text-[--foreground]">
            Something went wrong
          </h1>
          <p className="text-lg text-[--muted-foreground]">
            An unexpected error occurred while loading this page.
          </p>
        </div>

        {error.message && (
          <div className="rounded-lg bg-[--error] bg-opacity-10 p-4">
            <p className="text-sm text-[--error] font-mono">{error.message}</p>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" onClick={reset} className="flex-1">
            Try Again
          </Button>
          <Link href="/dashboard" className="flex-1">
            <Button variant="primary" className="w-full">
              Go Home
            </Button>
          </Link>
        </div>

        {error.digest && (
          <p className="text-xs text-[--muted-foreground]">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
