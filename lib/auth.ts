// lib/auth.ts

"use server";

import { createClient } from "@/lib/supabase/server";

interface CurrentUserSecure {
  userId: string;
  email: string;
  displayName: string;
  accessToken: string;
}

interface WorkspaceStructureOrg {
  id: string;
  name: string;
  workspaces?: Array<{
    id: string;
    slug: string;
    name: string;
  }>;
}

export async function getCurrentUser(): Promise<CurrentUserSecure | null> {
  const supabase = await createClient();

  const [{ data: userData }, { data: sessionData }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.auth.getSession(),
  ]);

  const user = userData.user;
  const session = sessionData.session;

  if (!user || !session) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email!,
    displayName: user.user_metadata?.displayName || user.email!,
    accessToken: session.access_token,
  };
}

// ... remove types we don't need ...

export async function getUserAndOrganization() {
  const user = await getCurrentUser();

  console.log("[AUTH] getUserAndOrganization called");
  console.log("[AUTH] User data:", user ? { userId: user.userId, email: user.email } : null);

  if (!user) {
    console.log("[AUTH] No user found, returning null");
    return null;
  }

  // Fetch workspace structure to get organization and default workspace context
  const { serverFetch } = await import("@/lib/api/server-fetch");
  const structureResult = await serverFetch<WorkspaceStructureOrg[]>("/workspaces/structure");

  if (!structureResult.success || !structureResult.data || structureResult.data.length === 0) {
    console.error("[AUTH] Failed to fetch workspace structure:", structureResult.error);
    // Return user data without organization context
    const result = {
      ...user,
      organizationName: "",
      organizationId: "",
      defaultWorkspaceId: "",
      defaultWorkspaceSlug: "",
    };
    return result;
  }

  // Get the first organization and its first workspace as defaults
  const firstOrg = structureResult.data[0];
  const firstWorkspace = firstOrg.workspaces?.[0];

  const result = {
    ...user,
    organizationName: firstOrg.name || "",
    organizationId: firstOrg.id || "",
    defaultWorkspaceId: firstWorkspace?.id || "",
    defaultWorkspaceSlug: firstWorkspace?.slug || "",
  };

  console.log("[AUTH] Returning user context:", {
    userId: result.userId,
    email: result.email,
    organizationName: result.organizationName,
    organizationId: result.organizationId,
    defaultWorkspaceId: result.defaultWorkspaceId,
  });

  return result;
}
