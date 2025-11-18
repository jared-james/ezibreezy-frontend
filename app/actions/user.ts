// app/actions/user.ts

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.BACKEND_URL;
if (!BACKEND_URL) {
  throw new Error("BACKEND_URL is not defined in environment variables");
}

export async function syncUser() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    console.error("No user session found. Cannot sync user.");
    return { success: false, error: "User not authenticated." };
  }

  const { user } = session;
  const { id, email } = user;
  const displayName = user.user_metadata?.displayName ?? "";

  if (!email) {
    console.error(`User ${id} has no email. Cannot sync.`);
    return { success: false, error: "User email is missing." };
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

    console.log(`User ${id} successfully synced with backend.`);
    revalidatePath("/", "layout"); // Revalidates all pages
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
