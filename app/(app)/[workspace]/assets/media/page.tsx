// app/(app)/[workspace]/assets/media/page.tsx

// app/(app)/assets/media/page.tsx

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/server";
import MediaRoom from "@/components/media-room/media-room";
import { redirect } from "next/navigation";

// Media library is relatively stable - cache for 1 minute
export const revalidate = 60;

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

interface PageProps {
  params: Promise<{ workspace: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function MediaRoomPage({ params }: PageProps) {
  const queryClient = new QueryClient();
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const { workspace: workspaceId } = await params;

  const token = session.access_token;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";

  // Prefetch Media (Server-Side) using Workspace ID from URL
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
      const urlParams = new URLSearchParams({
        rootOnly: "true",
        sortBy: "createdAt",
        order: "desc",
        limit: "50",
        offset: String(pageParam),
      });

      const res = await fetch(`${apiUrl}/media?${urlParams}`, {
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
