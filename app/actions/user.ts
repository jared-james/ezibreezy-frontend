// app/actions/user.ts

"use server";

import { createClient } from "@/lib/supabase/server";
import { authenticatedFetch } from "@/app/actions/billing";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { CompleteOnboardingRequest } from "@/lib/types/onboarding";

const BACKEND_URL = process.env.BACKEND_URL;
const API_KEY = process.env.API_KEY || process.env.NEXT_PUBLIC_API_KEY;

if (!BACKEND_URL) {
  throw new Error("BACKEND_URL is not defined in environment variables");
}

// Get user context (default workspace + permissions)
export async function getUserContext() {
  return await authenticatedFetch("/users/me/context", {
    headers: {
      "x-api-key": API_KEY || "",
    },
  });
}

// Sync user to backend (handles invite token if present)
export async function syncUser(options?: { inviteToken?: string }) {
  const supabase = await createClient();

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

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { success: false, error: "Session not found." };
  }

  const cookieStore = await cookies();
  const tokenToUse =
    options?.inviteToken || cookieStore.get("invite_token")?.value;

  try {
    const response = await fetch(`${BACKEND_URL}/users/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
        "x-api-key": API_KEY || "",
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
        statusCode: response.status,
      };
    }

    const data = await response.json();

    if (tokenToUse) {
      cookieStore.delete("invite_token");
    }

    revalidatePath("/", "layout");

    return {
      success: true,
      targetWorkspaceId: data.targetWorkspaceId,
      targetWorkspaceSlug: data.targetWorkspaceSlug,
      targetOrganizationId: data.targetOrganizationId,
      event: data.event,
    };
  } catch {
    return { success: false, error: "Failed to connect to backend service." };
  }
}

// Complete onboarding (create org + workspace)
export async function completeOnboarding(data: CompleteOnboardingRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "User not authenticated." };
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { success: false, error: "Session not found." };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/users/onboarding/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
        "x-api-key": API_KEY || "",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: `Onboarding failed: ${errorData.message || response.statusText}`,
        statusCode: response.status,
      };
    }

    const responseData = await response.json();

    revalidatePath("/", "layout");

    return {
      success: true,
      targetWorkspaceId: responseData.targetWorkspaceId,
      targetWorkspaceSlug: responseData.targetWorkspaceSlug,
      targetOrganizationId: responseData.targetOrganizationId,
      event: responseData.event,
    };
  } catch {
    return {
      success: false,
      error: "Failed to connect to backend service.",
    };
  }
}

// Update display name in Supabase and backend
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

    // Sync backend with new profile data
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

// Initiate email change
export async function updateEmail(newEmail: string) {
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
      email: newEmail,
    });

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unknown error occurred during email update.";
    return { success: false, error: message };
  }
}

// 1. Send Password Reset Email (The Security Trigger)
export async function triggerPasswordReset(workspaceSlug: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError || !user || !user.email) {
    return {
      success: false,
      error: "User not authenticated or email missing.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Redirect back to the Profile Settings page, but with a flag enabled
  const redirectTo = `${siteUrl}/auth/callback?next=/${workspaceSlug}/settings/profile?recovery=true`;

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unknown error occurred sending reset email.";
    return { success: false, error: message };
  }
}

// 2. Update Password (The Final Step)
export async function updatePassword(newPassword: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError || !user) {
    return { success: false, error: "User not authenticated." };
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unknown error occurred during password update.";
    return { success: false, error: message };
  }
}

// NEW: Delete Account (Danger Zone)
export async function deleteAccount() {
  // 1. Backend Deletion (Checks ownership, deletes data)
  const result = await authenticatedFetch("/users/me", {
    method: "DELETE",
  });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  // 2. Supabase Auth Deletion (Sign out locally)
  // Note: We don't delete from Supabase Admin API here because the backend handles the critical data.
  // The user remains in Supabase Auth but is orphaned/disabled effectively.
  // Ideally, the Backend would use the Service Role key to delete the user from Supabase entirely,
  // but for now, signing them out is the immediate frontend step.
  const supabase = await createClient();
  await supabase.auth.signOut();

  return { success: true };
}
