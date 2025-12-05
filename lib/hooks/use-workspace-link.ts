// lib/hooks/use-workspace-link.ts

"use client";

import { useSearchParams } from "next/navigation";

/**
 * Hook to preserve workspaceId in navigation links
 *
 * Problem: If user navigates from /dashboard?workspaceId=ws_123 to /analytics,
 * the workspaceId is dropped, causing the proxy to redirect to default workspace.
 *
 * Solution: This hook appends the current workspaceId to any path you provide.
 *
 * @param path - The path to navigate to (e.g., "/analytics")
 * @returns The path with workspaceId preserved (e.g., "/analytics?workspaceId=ws_123")
 *
 * @example
 * ```tsx
 * const analyticsHref = useWorkspaceLink('/analytics');
 * return <Link href={analyticsHref}>Analytics</Link>;
 * ```
 */
export function useWorkspaceLink(path: string): string {
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  // If we have workspace context, preserve it
  if (workspaceId) {
    const separator = path.includes("?") ? "&" : "?";
    return `${path}${separator}workspaceId=${workspaceId}`;
  }

  // No context - let proxy handle redirect
  return path;
}
