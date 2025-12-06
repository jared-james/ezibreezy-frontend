// proxy.ts

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { RESERVED_SLUGS } from "./lib/constants/reserved-slugs";

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

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // === EXCLUDED ROUTES (no workspace logic) ===
  const excludedRoutes = [
    "/auth",
    "/join", // Invite flow - token in URL must be preserved
    "/onboarding", // New user setup - no workspace yet
    "/account", // User-level settings
    "/api",
    "/_next",
  ];

  const isExcluded = excludedRoutes.some((route) => pathname.startsWith(route));

  // Skip workspace logic for excluded routes
  if (isExcluded) {
    return response;
  }

  // === CHECK IF PATH-BASED WORKSPACE ROUTE ===
  const pathSegments = pathname.split("/").filter(Boolean);
  const firstSegment = pathSegments[0];

  // If first segment is not reserved, it's a workspace slug
  if (
    firstSegment &&
    !(RESERVED_SLUGS as readonly string[]).includes(firstSegment)
  ) {
    // Valid workspace route: /:workspace/...
    // TODO: Optionally validate workspace exists and user has access
    return response;
  }

  // === HANDLE ROOT/MISSING WORKSPACE ===
  // User accessing root or routes without workspace in path
  if (!user || !session) {
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const BACKEND_URL = process.env.BACKEND_URL;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    if (!BACKEND_URL) {
      console.error("[Proxy] BACKEND_URL not configured");
      return response;
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
      return response;
    }

    const context = await contextResponse.json();
    const defaultWorkspaceSlug = context.defaultWorkspaceSlug;

    // No workspaces - redirect to onboarding
    if (!defaultWorkspaceSlug) {
      const onboardingUrl = new URL("/onboarding", request.url);
      return NextResponse.redirect(onboardingUrl);
    }

    // Redirect to default workspace with path-based routing
    // / → /:workspace/dashboard
    // /any-page → /:workspace/any-page (if not reserved)
    const newPath =
      pathname === "/"
        ? `/${defaultWorkspaceSlug}/dashboard`
        : `/${defaultWorkspaceSlug}${pathname}`;

    const redirectUrl = new URL(newPath, request.url);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("[Proxy] Error:", error);
    return response;
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
