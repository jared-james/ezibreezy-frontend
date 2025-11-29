// components/post-editor/hooks/use-post-validator.ts

import { useState, useCallback } from "react";
import { MediaItem } from "@/lib/store/editorial-store";
import {
  POST_EDITOR_VALIDATION_RULES,
  ValidationRule,
} from "../validation/rules";

interface UsePostValidatorProps {
  selectedAccounts: Record<string, string[]>;
  platformMediaSelections: Record<string, string[]>;
  stagedMediaItems: MediaItem[];
  facebookPostType: "post" | "story" | "reel";
}

interface VideoMetadata {
  width: number;
  height: number;
  duration: number;
  ratio: number;
}

export function usePostValidator({
  selectedAccounts,
  platformMediaSelections,
  stagedMediaItems,
  facebookPostType,
}: UsePostValidatorProps) {
  const [errors, setErrors] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  // Helper to extract metadata from a video source (File or URL)
  const getVideoMetadata = (source: File | string): Promise<VideoMetadata> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.crossOrigin = "anonymous";

      let url = "";
      if (source instanceof File) {
        url = URL.createObjectURL(source);
      } else {
        // Cache buster for network URLs to avoid CORS issues with cached content
        const separator = source.includes("?") ? "&" : "?";
        url = `${source}${separator}t=${new Date().getTime()}`;
      }

      video.onloadedmetadata = () => {
        if (source instanceof File) URL.revokeObjectURL(url);
        resolve({
          width: video.videoWidth,
          height: video.videoHeight,
          duration: video.duration,
          ratio: video.videoWidth / video.videoHeight,
        });
      };

      video.onerror = () => {
        if (source instanceof File) URL.revokeObjectURL(url);
        // If we can't load metadata, we resolve with safe defaults to avoid blocking
        // valid posts due to network/cors flukes, but log the warning.
        console.warn(
          "[Validator] Could not load video metadata for validation"
        );
        resolve({ width: 0, height: 0, duration: 0, ratio: 0 });
      };

      video.src = url;
    });
  };

  const checkRule = (
    rule: ValidationRule,
    metadata: VideoMetadata
  ): string | null => {
    switch (rule.type) {
      case "duration":
        if (metadata.duration > 0) {
          // Only check if we successfully got duration
          if (rule.min && metadata.duration < rule.min) return rule.message;
          if (rule.max && metadata.duration > rule.max) return rule.message;
        }
        break;
      case "aspectRatio":
        if (metadata.ratio > 0) {
          // Only check if we successfully got dimensions
          if (rule.max && metadata.ratio > rule.max) return rule.message;
        }
        break;
    }
    return null;
  };

  const validatePost = useCallback(async (): Promise<boolean> => {
    setIsValidating(true);
    setErrors([]);
    const newErrors: string[] = [];

    try {
      // 1. Facebook Validation
      if (selectedAccounts["facebook"]?.length > 0) {
        // Get rules for current post type (e.g. "story")
        const rules =
          POST_EDITOR_VALIDATION_RULES["facebook"]?.[facebookPostType] || [];

        if (rules.length > 0) {
          const fbMediaUids = platformMediaSelections["facebook"] || [];

          for (const uid of fbMediaUids) {
            const item = stagedMediaItems.find((i) => i.uid === uid);

            if (item?.type === "video") {
              // Determine source
              const source = item.file || item.mediaUrl || item.preview;
              if (!source) continue;

              const metadata = await getVideoMetadata(source);

              for (const rule of rules) {
                const error = checkRule(rule, metadata);
                if (error) newErrors.push(error);
              }
            }
          }
        }
      }

      // Add other platform validations here as needed...
    } catch (err) {
      console.error("[Validator] Unexpected validation error", err);
      newErrors.push("An unexpected error occurred while validating media.");
    } finally {
      setIsValidating(false);
    }

    if (newErrors.length > 0) {
      // Deduplicate errors
      const uniqueErrors = Array.from(new Set(newErrors));
      setErrors(uniqueErrors);
      return false;
    }

    return true;
  }, [
    selectedAccounts,
    platformMediaSelections,
    stagedMediaItems,
    facebookPostType,
  ]);

  return {
    validatePost,
    validationErrors: errors,
    isValidating,
    clearErrors: () => setErrors([]),
  };
}
