// lib/api/server-fetch.ts

"use server";

import { createClient } from "@/lib/supabase/server";

const BACKEND_URL = process.env.BACKEND_URL;

interface FetchOptions extends RequestInit {
  workspaceId?: string;
  skipWorkspaceHeader?: boolean;
}

export async function serverFetch<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  const { workspaceId, skipWorkspaceHeader, ...fetchOptions } = options;

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { success: false, error: "Not authenticated" };
  }

  if (!BACKEND_URL) {
    return { success: false, error: "Backend URL not configured" };
  }

  // Build headers
  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.access_token}`,
    "Content-Type": "application/json",
  };

  // Merge in any custom headers from fetchOptions
  if (fetchOptions.headers) {
    Object.assign(headers, fetchOptions.headers);
  }

  // Inject API key if available
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  if (apiKey) {
    headers["x-api-key"] = apiKey;
  }

  // Inject workspace header if provided and not skipped
  if (workspaceId && !skipWorkspaceHeader) {
    headers["x-workspace-id"] = workspaceId;
  }

  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
      cache: "no-store", // Default for dynamic data
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`,
      }));

      return {
        success: false,
        error: error.message || "Request failed",
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error(`[serverFetch] Error calling ${endpoint}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}
