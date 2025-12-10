// lib/api/media-upload.ts

import { getClientSessionToken } from "@/app/actions/session";
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
  // 1. Retrieve the access token via Server Action
  // (Only the server can read the httpOnly cookies to get the token)
  const accessToken = await getClientSessionToken();

  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  // 2. Prepare FormData
  const formData = new FormData();
  formData.append("file", file);
  if (thumbnail) {
    formData.append("thumbnail", thumbnail);
  }

  // 3. Make direct request to backend API using the retrieved token
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/media/upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
