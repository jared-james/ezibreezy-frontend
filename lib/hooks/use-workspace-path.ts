// lib/hooks/use-workspace-path.ts

"use client";

import { useParams } from "next/navigation";

/**
 * Hook to build workspace-scoped paths
 *
 * Replaces useWorkspaceLink for path-based routing.
 * Automatically prepends the current workspace slug to any path.
 *
 * @param path - The workspace-relative path (e.g., "calendar" or "/calendar")
 * @returns The full workspace path (e.g., "/marketing-team/calendar")
 *
 * @example
 * ```tsx
 * const calendarPath = useWorkspacePath('calendar');
 * return <Link href={calendarPath}>Calendar</Link>;
 * // Result: <Link href="/marketing-team/calendar">
 * ```
 */
export function useWorkspacePath(path: string = ""): string {
  const params = useParams<{ workspace?: string }>();
  const workspace = params?.workspace;

  if (!workspace) {
    console.warn("[useWorkspacePath] No workspace in route params");
    return path;
  }

  // Remove leading slash from path if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // Build workspace-scoped path
  return `/${workspace}${cleanPath ? "/" + cleanPath : ""}`;
}

/**
 * Hook to get current workspace slug from URL
 *
 * @returns The workspace slug or null if not in workspace context
 *
 * @example
 * ```tsx
 * const workspace = useWorkspaceSlug();
 * console.log(workspace); // "marketing-team" or null
 * ```
 */
export function useWorkspaceSlug(): string | null {
  const params = useParams<{ workspace?: string }>();
  return params?.workspace || null;
}
