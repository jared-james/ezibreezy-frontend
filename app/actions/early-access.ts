// app/actions/early-access.ts

"use server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.EARLY_ACCESS_API_KEY;

interface SignupPayload {
  email: string;
  name?: string;
  referralSource?: string;
}

export async function signupForWaitlist(payload: SignupPayload) {
  console.log("API_KEY", API_KEY);

  if (!BACKEND_URL || !API_KEY) {
    console.error("API configuration missing for waitlist signup.");
    return { success: false, error: "Server configuration error." };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/early-access/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify(payload),
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

    console.error(`[Server Action Error] Waitlist Signup: ${message}`);
    return { success: false, error: "Failed to connect to backend service." };
  }
}
