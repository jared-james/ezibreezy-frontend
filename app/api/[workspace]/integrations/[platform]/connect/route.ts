// app/api/[workspace]/integrations/[platform]/connect/route.ts

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspace: string; platform: string }> }
) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Extract workspace and platform from the dynamic route segments
  const { workspace, platform } = await params;

  if (!platform || !workspace) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const backendUrl = `${BACKEND_URL}/integrations/${platform}/connect`;

    const response = await fetch(backendUrl, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        // Pass the slug directly; backend WorkspaceGuard handles resolution
        "x-workspace-id": workspace,
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
