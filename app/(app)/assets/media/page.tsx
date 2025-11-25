// app/(app)/assets/media/page.tsx

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import MediaRoom from "@/components/media-room/media-room";
import { redirect } from "next/navigation";

// Define response types inline for server-fetch to avoid client-side dep issues
interface Connection {
  id: string;
  platform: string;
}

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

  const token = session.access_token;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";

  // 1. Fetch Connections (Server-Side) to get the Default Integration ID
  let integrationId: string | null = null;

  try {
    const connectionsRes = await fetch(`${apiUrl}/integrations/connections`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (connectionsRes.ok) {
      const connections: Connection[] = await connectionsRes.json();
      if (connections.length > 0) {
        integrationId = connections[0].id;
      }
    }
  } catch (error) {
    console.error("Error prefetching connections:", error);
  }

  // 2. Prefetch Media (Server-Side) if we found an integration
  if (integrationId) {
    // FIX: Construct filters EXACTLY matching the Client Side `useMemo` order
    // Client Order: sortBy, order, limit, THEN rootOnly/folderId
    const filters = {
      sortBy: "createdAt",
      order: "desc",
      limit: 50,
      rootOnly: true, // This needs to be last to match client construction
    };

    const queryKey = ["media", integrationId, filters];

    await queryClient.prefetchInfiniteQuery({
      queryKey,
      initialPageParam: 0,
      queryFn: async ({ pageParam = 0 }) => {
        const params = new URLSearchParams({
          integrationId: integrationId!,
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
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MediaRoom preloadedIntegrationId={integrationId} />
    </HydrationBoundary>
  );
}
