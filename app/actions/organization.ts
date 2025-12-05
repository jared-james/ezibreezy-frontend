// app/actions/organization.ts

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { authenticatedFetch } from "./billing";
import { getUserAndOrganization } from "@/lib/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function updateOrganizationName(
  organizationId: string,
  name: string
) {
  if (!BACKEND_URL || !API_KEY) {
    return { success: false, error: "API configuration missing." };
  }

  const supabase = await createClient();
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;

  if (!session) {
    return { success: false, error: "User not authenticated." };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/users/organization/name`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({ organizationId, name }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Unknown backend error." }));
      return {
        success: false,
        error: errorData.message || "Failed to update organization name.",
      };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Server action error updating org name:", error);
    return { success: false, error: "Failed to connect to backend service." };
  }
}

export async function getOrganizationMembers(organizationId: string) {
  const userContext = await getUserAndOrganization();

  if (!userContext) {
    return { success: false, error: "Not authenticated" };
  }

  // Security check: ensure the user requesting belongs to the org they are querying
  if (userContext.organizationId !== organizationId) {
    return {
      success: false,
      error: "Unauthorized access to organization members.",
    };
  }

  try {
    const response = await authenticatedFetch(
      `/users/organization/${organizationId}/members`
    );
    return response;
  } catch (error) {
    console.error("Error fetching organization members:", error);
    return { success: false, error: "Failed to load members" };
  }
}
