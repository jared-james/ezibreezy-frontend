// lib/hooks/use-workspace-link.ts

"use client";

import { useSearchParams } from "next/navigation";

/**
 * Hook to preserve workspace slug in navigation links
 *
 * Problem: If user navigates from /dashboard?workspace=marketing to /analytics,
 * the workspace parameter is dropped, causing the proxy to redirect to default workspace.
 *
 * Solution: This hook appends the current workspace slug to any path you provide.
 *
 * @param path - The path to navigate to (e.g., "/analytics")
 * @returns The path with workspace preserved (e.g., "/analytics?workspace=marketing")
 *
 * @example
 * ```tsx
 * const analyticsHref = useWorkspaceLink('/analytics');
 * return <Link href={analyticsHref}>Analytics</Link>;
 * ```
 */
export function useWorkspaceLink(path: string): string {
  const searchParams = useSearchParams();
  const workspace = searchParams.get("workspace");

  // If we have workspace context, preserve it
  if (workspace) {
    const separator = path.includes("?") ? "&" : "?";
    return `${path}${separator}workspace=${workspace}`;
  }

  // No context - let proxy handle redirect
  return path;
}
