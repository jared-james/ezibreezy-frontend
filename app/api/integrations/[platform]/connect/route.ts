// app/api/integrations/[platform]/connect/route.ts

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const supabase = await createClient();

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

  // Get workspaceId from query params
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspaceId");

  if (!workspaceId) {
    return NextResponse.json(
      { error: "Workspace ID is required" },
      { status: 400 }
    );
  }

  try {
    const backendUrl = `${BACKEND_URL}/integrations/${platform}/connect`;

    const response = await fetch(backendUrl, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "x-workspace-id": workspaceId,
      },
      redirect: "manual",
    });

    const redirectUrl = response.headers.get("location");

    if (!redirectUrl) {
      return NextResponse.json(
        { error: "No redirect URL received from backend" },
        { status: 500 }
      );
    }

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Error initiating connection:", error);
    return NextResponse.json(
      { error: "Failed to initiate connection" },
      { status: 500 }
    );
  }
}
