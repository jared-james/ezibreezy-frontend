// app/actions/user.ts

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL;
if (!BACKEND_URL) {
  throw new Error("BACKEND_URL is not defined in environment variables");
}

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
      data: {
        displayName: newDisplayName,
      },
    });

    if (updateError) {
      console.error("Supabase update error:", updateError);
      return { success: false, error: updateError.message };
    }

    // Resync with backend to update the user record there as well
    const syncResult = await syncUser();

    if (!syncResult.success) {
      console.error("Warning: Backend sync failed after display name update.");
    }

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
 * Synchronizes the current Supabase user with the Backend database.
 *
 * @param options - Optional parameters for the sync process
 * @param options.inviteToken - If provided, the backend will attempt to accept this invite for the user
 */
export async function syncUser(options?: { inviteToken?: string }) {
  console.log("🔵 [syncUser] START - Options:", options);

  const supabase = await createClient();

  // 1. Get User Details
  console.log("🔵 [syncUser] Getting user from Supabase...");
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("❌ [syncUser] No authenticated user found. Error:", userError);
    return { success: false, error: "User not authenticated." };
  }

  const { id, email } = user;
  const displayName =
    user.user_metadata?.displayName || user.user_metadata?.full_name || "";

  console.log("🔵 [syncUser] User found:", { id, email, displayName });

  if (!email) {
    console.error(`❌ [syncUser] User ${id} has no email. Cannot sync.`);
    return { success: false, error: "User email is missing." };
  }

  // 2. Get Session for Authorization Header
  console.log("🔵 [syncUser] Getting session...");
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    console.error("❌ [syncUser] No session found. Cannot get access token.");
    return { success: false, error: "Session not found." };
  }

  console.log("🔵 [syncUser] Session found, token length:", session.access_token?.length);

  // 3. Check for Invite Token (Priority: Options -> Cookie)
  const cookieStore = await cookies();
  const tokenToUse =
    options?.inviteToken || cookieStore.get("invite_token")?.value;

  console.log("🔵 [syncUser] Invite token:", tokenToUse ? "Present" : "None");

  try {
    // 4. Call Backend Sync
    console.log("🔵 [syncUser] Calling backend /users/sync at:", BACKEND_URL);
    console.log("🔵 [syncUser] Request payload:", { id, email, displayName, hasInviteToken: !!tokenToUse });

    const fetchStart = Date.now();
    const response = await fetch(`${BACKEND_URL}/users/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      // Pass the invite token if it exists, so the backend can link the user to the workspace
      body: JSON.stringify({
        id,
        email,
        displayName,
        inviteToken: tokenToUse,
      }),
    });
    const fetchDuration = Date.now() - fetchStart;

    console.log("🔵 [syncUser] Backend response received in", fetchDuration, "ms");
    console.log("🔵 [syncUser] Response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ [syncUser] Failed to sync user with backend:", errorData.message);
      return {
        success: false,
        error: `Backend sync failed: ${
          errorData.message || response.statusText
        }`,
      };
    }

    // 5. Capture the Result (Target Context)
    console.log("🔵 [syncUser] Parsing response JSON...");
    const data = await response.json();
    console.log("🔵 [syncUser] Response data:", data);

    // Clean up cookie if it was used/consumed
    if (tokenToUse) {
      console.log("🔵 [syncUser] Deleting invite_token cookie");
      cookieStore.delete("invite_token");
    }

    console.log("🔵 [syncUser] Revalidating paths...");
    revalidatePath("/", "layout");

    console.log("✅ [syncUser] SUCCESS - Returning:", {
      success: true,
      targetWorkspaceId: data.targetWorkspaceId,
      targetOrganizationId: data.targetOrganizationId,
      event: data.event,
    });

    // Return the Target IDs so the Frontend knows where to go
    return {
      success: true,
      targetWorkspaceId: data.targetWorkspaceId,
      targetOrganizationId: data.targetOrganizationId,
      event: data.event,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unknown server error occurred.";
    console.error("❌ [syncUser] Error calling sync user endpoint:", message);
    console.error("❌ [syncUser] Error details:", error);
    return { success: false, error: "Failed to connect to backend service." };
  }
}
