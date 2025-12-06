// lib/auth.ts

"use server";

import { createClient } from "@/lib/supabase/server";

interface CurrentUserSecure {
  userId: string;
  email: string;
  displayName: string;
  accessToken: string;
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

  // 🚀 OPTIMIZATION: Removed redundant backend fetch.
  // The layout already fetches the workspace structure which contains all the context we need.
  const result = {
    ...user,
    organizationName: "", // Deprecated: UI should use workspace structure
    organizationId: "",
    defaultWorkspaceId: "",
    defaultWorkspaceSlug: "",
  };

  console.log("[AUTH] Returning user context:", {
    userId: result.userId,
    email: result.email,
    organizationName: result.organizationName,
    organizationId: result.organizationId,
  });

  return result;
}
