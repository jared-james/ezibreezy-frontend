// app/actions/workspaces.ts

"use server";

import { serverFetch } from "@/lib/api/server-fetch";
import { revalidatePath } from "next/cache";
import { cache } from "react"; // <--- 1. Import cache

export interface WorkspaceInviteConfig {
  workspaceId: string;
  role: "admin" | "editor" | "viewer";
}

// 2. Wrap the async function in cache()
// This enables Request Memoization within the same server request cycle.
export const getWorkspaceStructure = cache(async () => {
  return await serverFetch<any[]>("/workspaces/structure");
});

// --- NEW: Fetch single workspace details (Fast & Specific) ---
// GET /workspaces/:id
// We also cache this, just in case multiple components need details for the CURRENT workspace.
export const getWorkspaceDetails = cache(async (workspaceIdOrSlug: string) => {
  // We pass the slug/ID in options.workspaceId so serverFetch adds the
  // x-workspace-id header. The backend Guard uses this to validate access.
  return await serverFetch<any>(`/workspaces/${workspaceIdOrSlug}`, {
    workspaceId: workspaceIdOrSlug,
  });
});

export async function createWorkspace(data: {
  organizationId: string;
  name: string;
  timezone: string;
}) {
  const result = await serverFetch<any>("/workspaces", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (result.success) {
    revalidatePath("/", "layout");
  }
  return result;
}

export async function updateWorkspace(
  workspaceId: string, // UUID
  updates: { name?: string; timezone?: string; settings?: any }
) {
  const result = await serverFetch<any>(`/workspaces/${workspaceId}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
    workspaceId, // Sets x-workspace-id header for security context
  });

  if (result.success) {
    revalidatePath("/", "layout");
  }
  return result;
}

export async function deleteWorkspace(workspaceId: string) {
  const result = await serverFetch(`/workspaces/${workspaceId}`, {
    method: "DELETE",
    workspaceId,
  });

  if (result.success) {
    revalidatePath("/", "layout");
  }
  return result;
}

export async function inviteUserToOrganization(
  contextWorkspaceId: string,
  data: {
    email: string;
    orgRole: "owner" | "admin" | "member";
    workspaces: WorkspaceInviteConfig[];
  }
): Promise<{
  success: boolean;
  data?: { provisioned: boolean };
  error?: string;
}> {
  return await serverFetch<{ provisioned: boolean }>(
    `/workspaces/${contextWorkspaceId}/invites`,
    {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        orgRole: data.orgRole,
        workspaces: data.workspaces,
      }),
      workspaceId: contextWorkspaceId,
    }
  );
}
