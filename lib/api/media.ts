// lib/api/media.ts
import apiClient from "./index";

export interface UploadMediaResponse {
  mediaId: string;
}

/**
 * Uploads a media file for a specific integration.
 * The backend will handle forwarding this to the correct platform (e.g., X).
 * @param file The media file to upload.
 * @param integrationId The ID of the integration to associate the media with.
 * @returns The platform-specific media ID.
 */
export const uploadMedia = async (
  file: File,
  integrationId: string
): Promise<UploadMediaResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("integrationId", integrationId);

  const response = await apiClient.post<UploadMediaResponse>(
    "/media/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
