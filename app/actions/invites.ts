// app/actions/invites.ts

"use server";

const BACKEND_URL = process.env.BACKEND_URL;
// We use the server-side API key. Ensure this is set in your .env.local
// You might be using NEXT_PUBLIC_API_KEY in other files, but for server-to-server
// it's safer to use a dedicated secret if you have one, or reuse the existing one.
const API_KEY = process.env.API_KEY || process.env.NEXT_PUBLIC_API_KEY;

interface InviteInfo {
  workspaceName: string;
  inviterName: string;
}

export async function getInviteDetails(
  token: string
): Promise<{ success: boolean; data?: InviteInfo; error?: string }> {
  if (!BACKEND_URL || !API_KEY) {
    console.error("Missing configuration: BACKEND_URL or API_KEY not set");
    return { success: false, error: "System configuration error." };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/invites/${token}/info`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY, // The secret handshake
      },
      cache: "no-store", // Ensure we don't cache stale invites
    });

    if (!response.ok) {
      // If 404, it means token is invalid or expired
      if (response.status === 404) {
        return { success: false, error: "Invite not found or expired." };
      }
      return { success: false, error: "Failed to fetch invite details." };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching invite details:", error);
    return { success: false, error: "Connection failed." };
  }
}
