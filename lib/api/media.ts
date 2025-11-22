// lib/api/media.ts
import apiClient from "./index";

export interface UploadMediaResponse {
  mediaId: string;
}

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
