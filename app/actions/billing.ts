// app/actions/billing.ts

"use server";

import { createClient } from "@/lib/supabase/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { success: false, error: "User is not authenticated." };
  }

  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "An unexpected error occurred." }));
      return { success: false, error: errorData.message };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unknown server error occurred.";

    console.error(
      `[Server Action Error] Endpoint: ${endpoint}, Error: ${message}`
    );

    return { success: false, error: "An unexpected server error occurred." };
  }
}
