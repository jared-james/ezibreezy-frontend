// lib/utils/workspace.ts

import { RESERVED_SLUGS } from "@/lib/constants/reserved-slugs";

/**
 * Extract workspace slug from URL pathname
 *
 * Handles path-based workspace routing where workspace is the first segment:
 * - /marketing-team/calendar → "marketing-team"
 * - /auth/login → null (reserved slug)
 * - / → null (no workspace)
 *
 * @param pathname - The URL pathname (e.g., from window.location.pathname or request.nextUrl.pathname)
 * @returns Workspace slug if valid, null otherwise
 *
 * @example
 * extractWorkspaceFromPathname("/marketing-team/calendar") // "marketing-team"
 * extractWorkspaceFromPathname("/auth/login") // null
 * extractWorkspaceFromPathname("/") // null
 */
export function extractWorkspaceFromPathname(pathname: string): string | null {
  // Split pathname and remove empty segments
  const segments = pathname.split("/").filter(Boolean);

  // No segments = root or invalid path
  if (segments.length === 0) {
    return null;
  }

  const firstSegment = segments[0];

  // Check if first segment is a reserved slug (case-insensitive)
  const isReserved = (RESERVED_SLUGS as readonly string[]).includes(
    firstSegment.toLowerCase()
  );

  if (isReserved) {
    return null;
  }

  // First segment is a valid workspace slug
  return firstSegment;
}

/**
 * Extract workspace slug from current browser location
 *
 * SSR-safe wrapper around extractWorkspaceFromPathname that uses window.location.
 * Only works in browser context - returns null during SSR.
 *
 * @returns Workspace slug if in browser and valid workspace context, null otherwise
 *
 * @example
 * // In browser at /marketing-team/calendar
 * getWorkspaceFromLocation() // "marketing-team"
 *
 * // During SSR
 * getWorkspaceFromLocation() // null
 */
export function getWorkspaceFromLocation(): string | null {
  // SSR safety check
  if (typeof window === "undefined") {
    return null;
  }

  return extractWorkspaceFromPathname(window.location.pathname);
}

/**
 * Check if a pathname represents a workspace-scoped route
 *
 * @param pathname - The URL pathname to check
 * @returns True if pathname starts with a workspace slug
 *
 * @example
 * isWorkspaceRoute("/marketing-team/calendar") // true
 * isWorkspaceRoute("/auth/login") // false
 * isWorkspaceRoute("/") // false
 */
export function isWorkspaceRoute(pathname: string): boolean {
  return extractWorkspaceFromPathname(pathname) !== null;
}
