// lib/utils/video-thumbnail.ts

/**
 * Generates a JPEG thumbnail from the first second of a video file.
 * This runs entirely in the browser, saving server CPU costs.
 */
export async function generateVideoThumbnail(
  videoFile: File,
  quality = 0.7
): Promise<File> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Create a URL for the video file
    const url = URL.createObjectURL(videoFile);

    video.src = url;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous"; // Good practice, though mostly relevant for remote URLs

    // Load metadata to get dimensions
    video.addEventListener("loadedmetadata", () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // 1. Define the frame index you want (5th frame)
      const targetFrame = 5;

      // 2. Assume a standard frame rate (e.g., 30fps or 24fps)
      // Most web video is 30fps.
      const assumedFps = 30;

      // 3. Calculate timestamp in seconds
      const seekTime = targetFrame / assumedFps;

      // 4. Set time, ensuring we don't exceed video duration if it's extremely short
      video.currentTime = Math.min(seekTime, video.duration);
    });

    // Once the video has seeked to the frame
    video.addEventListener("seeked", () => {
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      try {
        // Draw the current video frame to the canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to Blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to generate thumbnail blob"));
              return;
            }

            // Create a File object from the Blob
            const thumbnailFile = new File(
              [blob],
              videoFile.name.replace(/\.[^/.]+$/, "") + "_thumb.jpg",
              { type: "image/jpeg" }
            );

            // Cleanup
            URL.revokeObjectURL(url);
            resolve(thumbnailFile);
          },
          "image/jpeg",
          quality
        );
      } catch (error) {
        reject(error);
      }
    });

    video.addEventListener("error", (e) => {
      reject(new Error("Error loading video file"));
    });
  });
}
