// app/actions/user.ts

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL;
if (!BACKEND_URL) {
  throw new Error("BACKEND_URL is not defined in environment variables");
}

/**
 * Updates the display name in Supabase and syncs with the backend.
 */
export async function updateDisplayName(newDisplayName: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError || !user) {
    return { success: false, error: "User not authenticated." };
  }

  try {
    const { error: updateError } = await supabase.auth.updateUser({
      data: { displayName: newDisplayName },
    });

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    await syncUser();
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unknown error occurred during update.";
    return { success: false, error: message };
  }
}

/**
 * Synchronizes the current Supabase user with the backend.
 *
 * @param options Optional sync options (ex: inviteToken)
 */
export async function syncUser(options?: { inviteToken?: string }) {
  const supabase = await createClient();

  // Get user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "User not authenticated." };
  }

  const { id, email } = user;
  const displayName =
    user.user_metadata?.displayName || user.user_metadata?.full_name || "";

  if (!email) {
    return { success: false, error: "User email is missing." };
  }

  // Get session for access token
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { success: false, error: "Session not found." };
  }

  // Resolve invite token
  const cookieStore = await cookies();
  const tokenToUse =
    options?.inviteToken || cookieStore.get("invite_token")?.value;

  try {
    const response = await fetch(`${BACKEND_URL}/users/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        id,
        email,
        displayName,
        inviteToken: tokenToUse,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: `Backend sync failed: ${
          errorData.message || response.statusText
        }`,
      };
    }

    const data = await response.json();

    // Clear invite cookie if used
    if (tokenToUse) {
      cookieStore.delete("invite_token");
    }

    revalidatePath("/", "layout");

    return {
      success: true,
      targetWorkspaceId: data.targetWorkspaceId, // Keep for UUID fallback
      targetWorkspaceSlug: data.targetWorkspaceSlug, // NEW: Prefer slug for redirects
      targetOrganizationId: data.targetOrganizationId,
      event: data.event,
    };
  } catch {
    return { success: false, error: "Failed to connect to backend service." };
  }
}
