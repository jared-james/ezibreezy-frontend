// proxy.ts

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { data: { session } } = await supabase.auth.getSession();

  // === WORKSPACE CONTEXT ENFORCEMENT ===
  const { pathname, searchParams } = request.nextUrl;

  // CRITICAL: Exclude routes that should NOT have workspace enforcement
  const excludedRoutes = [
    "/auth",
    "/join", // Invite flow - token in URL must be preserved
    "/onboarding", // New user setup - no workspace yet
    "/api",
    "/_next",
  ];

  const isExcluded = excludedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Skip workspace logic for excluded routes
  if (isExcluded) {
    return response;
  }

  // Define Work Mode routes that require workspace context
  const workModeRoutes = [
    "/dashboard",
    "/calendar",
    "/editorial",
    "/ideas",
    "/analytics",
    "/assets",
    "/settings/workspace",
    "/settings/integrations",
  ];

  const isWorkMode = workModeRoutes.some((route) => pathname.startsWith(route));

  // If this is a Work Mode route and no workspaceId in URL, redirect to default
  if (isWorkMode && !searchParams.has("workspaceId")) {
    // User must be authenticated to fetch default workspace
    if (!user || !session) {
      const loginUrl = new URL("/auth/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Fetch default workspace from backend
      const BACKEND_URL = process.env.BACKEND_URL;
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;

      if (!BACKEND_URL) {
        console.error("[Proxy] BACKEND_URL not configured");
        return response; // Let page handle error
      }

      const contextResponse = await fetch(`${BACKEND_URL}/users/me/context`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "x-api-key": apiKey || "",
        },
        cache: "no-store",
      });

      if (!contextResponse.ok) {
        console.error(
          "[Proxy] Failed to fetch user context:",
          contextResponse.status
        );
        return response; // Let page handle error
      }

      const context = await contextResponse.json();
      const defaultWorkspaceId = context.defaultWorkspaceId;

      // No workspaces - redirect to onboarding
      if (!defaultWorkspaceId) {
        const onboardingUrl = new URL("/onboarding", request.url);
        return NextResponse.redirect(onboardingUrl);
      }

      // Redirect to same URL with workspaceId parameter
      const redirectUrl = new URL(request.url);
      redirectUrl.searchParams.set("workspaceId", defaultWorkspaceId);

      return NextResponse.redirect(redirectUrl);
    } catch (error) {
      console.error("[Proxy] Error fetching default workspace:", error);
      // Let the page handle the error gracefully
      return response;
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
