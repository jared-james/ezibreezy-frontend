// lib/hooks/use-client-data.ts

"use client";

import { useQuery } from "@tanstack/react-query";
import { getClientDataForEditor } from "@/app/actions/data";

export function useClientData() {
  const { data } = useQuery({
    queryKey: ["clientEditorData"],
    queryFn: getClientDataForEditor,
    staleTime: Infinity,
  });

  return {
    organizationId: data?.organizationId || null,
    userId: data?.userId || null,
    connections: data?.connections || [],
  };
}
