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

export async function getUserAndOrganization() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  // Fetch workspace structure for organization + workspace context
  const { serverFetch } = await import("@/lib/api/server-fetch");
  const structureResult = await serverFetch<WorkspaceStructureOrg[]>(
    "/workspaces/structure"
  );

  if (!structureResult.success || !structureResult.data?.length) {
    return {
      ...user,
      organizationName: "",
      organizationId: "",
      defaultWorkspaceId: "",
      defaultWorkspaceSlug: "",
    };
  }

  const firstOrg = structureResult.data[0];
  const firstWorkspace = firstOrg.workspaces?.[0];

  return {
    ...user,
    organizationName: firstOrg.name || "",
    organizationId: firstOrg.id || "",
    defaultWorkspaceId: firstWorkspace?.id || "",
    defaultWorkspaceSlug: firstWorkspace?.slug || "",
  };
}
