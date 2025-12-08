// lib/api/media-upload.ts

import { createClient } from "@/lib/supabase/client";
import { UploadMediaResponse } from "@/lib/types/media";

/**
 * Upload media file directly to the backend API
 * This bypasses the Next.js server action to avoid double-uploading large files
 */
export async function uploadMediaDirect(
  file: File,
  workspaceId: string,
  thumbnail?: File
): Promise<UploadMediaResponse> {
  // Get the Supabase session from the client
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Not authenticated");
  }

  // Prepare FormData with file and optional thumbnail
  const formData = new FormData();
  formData.append("file", file);
  if (thumbnail) {
    formData.append("thumbnail", thumbnail);
  }

  // Make direct request to backend API
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/media/upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "x-workspace-id": workspaceId,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Upload failed with status ${response.status}`
    );
  }

  return response.json();
}
