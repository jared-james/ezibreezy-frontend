// app/actions/workspaces.ts

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cache } from "react"; // Added this

const BACKEND_URL = process.env.BACKEND_URL;

// Wrapped in cache()
export const getWorkspaceStructure = cache(async () => {
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
});

// ... (keep the rest of the file: createWorkspace, updateWorkspace, deleteWorkspace, etc.) ...
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

export interface WorkspaceInviteConfig {
  workspaceId: string;
  role: "admin" | "editor" | "viewer";
}

export async function inviteUserToOrganization(
  contextWorkspaceId: string,
  data: {
    email: string;
    orgRole: "owner" | "admin" | "member";
    workspaces: WorkspaceInviteConfig[];
  }
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
    const response = await fetch(
      `${BACKEND_URL}/workspaces/${contextWorkspaceId}/invites`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          orgRole: data.orgRole,
          workspaces: data.workspaces,
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

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Error sending invite:", error);
    return { success: false, error: "Connection failed" };
  }
}
