// lib/auth.ts

import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email!,
    displayName: user.user_metadata?.displayName || user.email!,
  };
}

interface UserOrganizationContext {
  displayName: string;
  organizationName: string;
  organizationId: string;
}

export async function getUserAndOrganization() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  if (!BACKEND_URL || !API_KEY) {
    console.error("Backend URL or API Key is missing for server fetch.");
    return {
      ...user,
      organizationName: "API Config Error",
      organizationId: "error",
    };
  }

  try {
    const supabase = await createClient();
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;

    if (!session) throw new Error("No active Supabase session.");

    const fetchResponse = await fetch(`${BACKEND_URL}/users/me/context`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "x-api-key": API_KEY,
      },
      cache: "no-store",
    });

    if (!fetchResponse.ok) {
      console.error("Backend context fetch failed:", fetchResponse.status);
      throw new Error("Failed to load organization context.");
    }

    const context: UserOrganizationContext = await fetchResponse.json();

    return {
      ...user,
      displayName: context.displayName,
      organizationName: context.organizationName,
      organizationId: context.organizationId,
    };
  } catch (error) {
    console.error("Error fetching user and organization context:", error);
    return {
      ...user,
      organizationName: "Org Load Failed",
      organizationId: "error",
    };
  }
}
