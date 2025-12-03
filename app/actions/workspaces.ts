// app/actions/workspaces.ts

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.BACKEND_URL;

export async function getWorkspaceStructure() {
  if (!BACKEND_URL) {
    return { success: false, error: "Backend URL is not configured." };
  }

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/workspaces/structure`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      // We don't cache this aggressively because permissions/structures change
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch workspace structure:", errorText);
      return { success: false, error: "Failed to load workspaces." };
    }

    const data = await response.json();

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching workspace structure:", error);
    return { success: false, error: "Connection failed." };
  }
}

export async function createWorkspace(data: {
  organizationId: string;
  name: string;
  timezone: string;
}) {
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

  try {
    const response = await fetch(`${BACKEND_URL}/workspaces`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        error: error.message || "Failed to create workspace",
      };
    }

    const workspace = await response.json();
    revalidatePath("/", "layout");
    return { success: true, data: workspace };
  } catch (error) {
    console.error("Error creating workspace:", error);
    return { success: false, error: "Connection failed" };
  }
}

export async function updateWorkspace(
  workspaceId: string,
  updates: { name?: string; timezone?: string; settings?: any }
) {
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

  try {
    const response = await fetch(`${BACKEND_URL}/workspaces/${workspaceId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        error: error.message || "Failed to update workspace",
      };
    }

    const workspace = await response.json();
    revalidatePath("/", "layout");
    return { success: true, data: workspace };
  } catch (error) {
    console.error("Error updating workspace:", error);
    return { success: false, error: "Connection failed" };
  }
}

export async function deleteWorkspace(workspaceId: string) {
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

  try {
    const response = await fetch(`${BACKEND_URL}/workspaces/${workspaceId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        error: error.message || "Failed to delete workspace",
      };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error deleting workspace:", error);
    return { success: false, error: "Connection failed" };
  }
}

export async function inviteUserToWorkspace(data: {
  workspaceId: string;
  email: string;
  role: "admin" | "editor" | "viewer";
}) {
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

  try {
    // TODO: Verify this endpoint exists in your backend
    const response = await fetch(
      `${BACKEND_URL}/workspaces/${data.workspaceId}/invites`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          role: data.role,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        error: error.message || "Failed to send invite",
      };
    }

    const invite = await response.json();
    return { success: true, data: invite };
  } catch (error) {
    console.error("Error sending invite:", error);
    return { success: false, error: "Connection failed" };
  }
}
