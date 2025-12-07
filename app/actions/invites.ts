// app/actions/invites.ts

"use server";

const BACKEND_URL = process.env.BACKEND_URL;
const API_KEY = process.env.API_KEY || process.env.NEXT_PUBLIC_API_KEY;

// Updated interface to match the actual Backend response
interface InviteInfo {
  organizationName: string;
  inviterName: string;
  workspaceNames: string[];
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
        "x-api-key": API_KEY,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: "Invite not found or expired." };
      }
      return { success: false, error: "Failed to fetch invite details." };
    }

    const data = await response.json();

    // The backend returns: { organizationName, inviterName, workspaceNames }
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching invite details:", error);
    return { success: false, error: "Connection failed." };
  }
}
