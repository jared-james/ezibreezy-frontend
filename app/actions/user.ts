// app/actions/user.ts

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

export async function syncUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("No authenticated user found. Cannot sync user.");
    return { success: false, error: "User not authenticated." };
  }

  const { id, email } = user;
  const displayName = user.user_metadata?.displayName ?? "";

  if (!email) {
    console.error(`User ${id} has no email. Cannot sync.`);
    return { success: false, error: "User email is missing." };
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    console.error("No session found. Cannot get access token.");
    return { success: false, error: "Session not found." };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/users/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ id, email, displayName }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to sync user with backend:", errorData.message);
      return {
        success: false,
        error: `Backend sync failed: ${errorData.message}`,
      };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unknown server error occurred.";
    console.error("Error calling sync user endpoint:", message);
    return { success: false, error: "Failed to connect to backend service." };
  }
}
