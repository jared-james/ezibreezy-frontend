// app/api/connections/[platform]/connect/route.ts

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const supabase = await createClient();

  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { platform } = await params;

  if (!platform) {
    return NextResponse.json(
      { error: "Platform parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Call your backend with the auth token
    const response = await fetch(
      `${BACKEND_URL}/connections/${platform}/connect`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        redirect: "manual", // Don't follow redirects automatically
      }
    );

    // The backend will return a redirect to X's OAuth page
    const redirectUrl = response.headers.get("location");

    if (!redirectUrl) {
      return NextResponse.json(
        { error: "No redirect URL received from backend" },
        { status: 500 }
      );
    }

    // Redirect the user to X's OAuth page
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Error initiating connection:", error);
    return NextResponse.json(
      { error: "Failed to initiate connection" },
      { status: 500 }
    );
  }
}
