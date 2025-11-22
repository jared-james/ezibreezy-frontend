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
    const fetchResponse = await fetch(`${BACKEND_URL}/users/me/context`, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
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
