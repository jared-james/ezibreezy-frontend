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

  // 1. Get Workspace Context (Server-Side)
  const userContext = await getUserAndOrganization();

  if (!userContext?.defaultWorkspaceId) {
    // If authenticated but no workspace context, something is wrong
    return (
      <div className="p-8 text-center text-red-500 font-serif">
        Error: Could not load workspace context.
      </div>
    );
  }

  const { defaultWorkspaceId: workspaceId } = userContext;
  const token = session.access_token;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";

  // 2. Prefetch Media (Server-Side) using Workspace ID
  // Match the filters logic used in the client-side useMediaList hook
  const filters = {
    sortBy: "createdAt",
    order: "desc",
    limit: 50,
    rootOnly: true,
  };

  const queryKey = ["media", workspaceId, filters];

  await queryClient.prefetchInfiniteQuery({
    queryKey,
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams({
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
          "x-workspace-id": workspaceId,
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
      <MediaRoom />
    </HydrationBoundary>
  );
}
