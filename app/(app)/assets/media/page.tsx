// app/(app)/assets/media/page.tsx

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/server";
import { getUserAndOrganization } from "@/lib/auth";
import MediaRoom from "@/components/media-room/media-room";
import { redirect } from "next/navigation";

// Define response types inline for server-fetch
interface MediaListResponse {
  data: any[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export default async function MediaRoomPage() {
  const queryClient = new QueryClient();
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  // 1. Get Organization Context (Server-Side)
  // Instead of fetching connections, we get the organization ID directly associated with the user
  const userContext = await getUserAndOrganization();

  if (!userContext?.organizationId) {
    // If authenticated but no organization context, something is wrong
    return (
      <div className="p-8 text-center text-red-500 font-serif">
        Error: Could not load organization context.
      </div>
    );
  }

  const { organizationId } = userContext;
  const token = session.access_token;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";

  // 2. Prefetch Media (Server-Side) using Organization ID
  // Match the filters logic used in the client-side useMediaList hook
  const filters = {
    sortBy: "createdAt",
    order: "desc",
    limit: 50,
    rootOnly: true,
  };

  const queryKey = ["media", organizationId, filters];

  await queryClient.prefetchInfiniteQuery({
    queryKey,
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      // Changed param from integrationId to organizationId
      const params = new URLSearchParams({
        organizationId: organizationId,
        rootOnly: "true",
        sortBy: "createdAt",
        order: "desc",
        limit: "50",
        offset: String(pageParam),
      });

      const res = await fetch(`${apiUrl}/media?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch media");
      }

      return res.json() as Promise<MediaListResponse>;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* Pass organizationId so the client component doesn't have to wait to fetch it */}
      <MediaRoom preloadedOrganizationId={organizationId} />
    </HydrationBoundary>
  );
}
