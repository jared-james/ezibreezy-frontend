// app/(app)/[workspace]/not-found.tsx

import Link from "next/link";
import Image from "next/image";

/**
 * Custom 404 page for invalid workspace routes
 *
 * This page is shown when:
 * - User navigates to /invalid-slug/dashboard
 * - Workspace exists but user doesn't have access
 * - Workspace was deleted
 */
export default function WorkspaceNotFound() {
  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center bg-[--background] px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative w-24 h-24 rounded-full bg-[--muted]/10 flex items-center justify-center">
            <Image
              src="/logo_smile.webp"
              alt="Logo"
              width={48}
              height={48}
              className="opacity-40 grayscale"
            />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="font-serif text-4xl font-medium text-[--foreground]">
            Workspace Not Found
          </h1>
          <p className="text-[--muted] text-lg">
            This workspace doesn&apos;t exist or you don&apos;t have access to it.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-brand-primary text-white font-medium hover:bg-brand-primary/90 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/settings/workspaces"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-[--border] text-[--foreground] font-medium hover:bg-[--muted]/5 transition-colors"
          >
            View Workspaces
          </Link>
        </div>

        {/* Help text */}
        <p className="text-sm text-[--muted]">
          If you believe this is an error, please contact your workspace administrator.
        </p>
      </div>
    </div>
  );
}
