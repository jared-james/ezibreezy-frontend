// app/actions/organization.ts

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
