// lib/hooks/use-workspace-path.ts

"use client";

import { useParams } from "next/navigation";

/**
 * Returns a full workspace-scoped path based on the current URL slug.
 *
 * @param path - Relative workspace path (e.g., "calendar" or "/calendar")
 * @returns A scoped path (e.g., "/marketing-team/calendar")
 */
export function useWorkspacePath(path: string = ""): string {
  const params = useParams<{ workspace?: string }>();
  const workspace = params?.workspace;

  if (!workspace) {
    return path;
  }

  const cleanPath = path.replace(/^\//, "");

  return `/${workspace}${cleanPath ? `/${cleanPath}` : ""}`;
}

/**
 * Returns the current workspace slug from the URL.
 *
 * @returns Workspace slug or null if outside workspace context.
 */
export function useWorkspaceSlug(): string | null {
  const params = useParams<{ workspace?: string }>();
  return params?.workspace || null;
}
