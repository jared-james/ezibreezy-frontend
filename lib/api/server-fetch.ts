import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

type FetchOptions = RequestInit & {
  workspaceId?: string; // Can be UUID or Slug
  skipAuth?: boolean;
};

export async function serverFetch<T>(
  endpoint: string,
  { workspaceId, skipAuth = false, ...options }: FetchOptions = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    // 1. Handle Authentication
    if (!skipAuth) {
      const supabase = await createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return { success: false, error: "Unauthorized: No active session" };
      }
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }

    // 2. Handle Workspace Context (The "Hybrid Routing" Magic)
    // We pass whatever we have (Slug or UUID). The Backend WorkspaceGuard resolves it.
    if (workspaceId) {
      headers["x-workspace-id"] = workspaceId;
    }

    // 3. Make the Request
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      headers,
      cache: options.cache || "no-store", // Default to no-store for dynamic data
    });

    // 4. Handle Errors gracefully
    if (!response.ok) {
      // Handle Authentication Errors (Token expired, etc)
      if (response.status === 401) {
        redirect("/auth/login"); // Next.js redirect throws, so this stops execution
      }

      const errorData = await response
        .json()
        .catch(() => ({ message: response.statusText }));

      // Return structured error for UI to handle (toasts, alerts)
      return {
        success: false,
        error:
          errorData.message || `Request failed with status ${response.status}`,
      };
    }

    // 5. Return Data
    // Check if response has content before parsing JSON
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    return { success: true, data };
  } catch (error) {
    // Catch network errors or JSON parse errors
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error; // Let Next.js handle the redirect
    }

    console.error(`[ServerFetch] Error calling ${endpoint}:`, error);
    return {
      success: false,
      error: "Network error or backend unreachable.",
    };
  }
}
