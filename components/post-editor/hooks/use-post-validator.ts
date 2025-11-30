// components/post-editor/hooks/use-post-validator.ts

import { useState, useCallback, useEffect } from "react";
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
  postType: "post" | "story" | "reel";
}

interface MediaMetadata {
  width: number;
  height: number;
  duration: number;
  ratio: number;
  mimeType?: string;
  size?: number;
}

export type MediaErrors = Record<string, Record<string, string[]>>;

export function usePostValidator({
  selectedAccounts,
  platformMediaSelections,
  stagedMediaItems,
  facebookPostType,
  postType,
}: UsePostValidatorProps) {
  const [blockingErrors, setBlockingErrors] = useState<string[]>([]);
  const [mediaErrors, setMediaErrors] = useState<MediaErrors>({});
  const [isValidating, setIsValidating] = useState(false);

  const getVideoMetadata = (source: File | string): Promise<MediaMetadata> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.crossOrigin = "anonymous";

      let url = "";
      let mimeType: string | undefined;
      let size: number | undefined;

      if (source instanceof File) {
        url = URL.createObjectURL(source);
        mimeType = source.type;
        size = source.size;
      } else {
        const separator = source.includes("?") ? "&" : "?";
        url = `${source}${separator}t=${new Date().getTime()}`;
        if (source.endsWith(".mp4")) mimeType = "video/mp4";
        if (source.endsWith(".mov")) mimeType = "video/quicktime";
      }

      video.onloadedmetadata = () => {
        if (source instanceof File) URL.revokeObjectURL(url);
        resolve({
          width: video.videoWidth,
          height: video.videoHeight,
          duration: video.duration,
          ratio: video.videoWidth / video.videoHeight,
          mimeType,
          size,
        });
      };

      video.onerror = () => {
        if (source instanceof File) URL.revokeObjectURL(url);
        resolve({ width: 0, height: 0, duration: 0, ratio: 0, mimeType, size });
      };

      video.src = url;
    });
  };

  const getImageMetadata = (source: File | string): Promise<MediaMetadata> => {
    return new Promise((resolve) => {
      const img = new Image();
      let url = "";
      let mimeType: string | undefined;
      let size: number | undefined;

      if (source instanceof File) {
        url = URL.createObjectURL(source);
        mimeType = source.type;
        size = source.size;
      } else {
        url = source;
      }

      img.onload = () => {
        if (source instanceof File) URL.revokeObjectURL(url);
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          duration: 0,
          ratio: img.naturalWidth / img.naturalHeight,
          mimeType,
          size,
        });
      };

      img.onerror = () => {
        if (source instanceof File) URL.revokeObjectURL(url);
        resolve({ width: 0, height: 0, duration: 0, ratio: 0, mimeType, size });
      };

      img.src = url;
    });
  };

  const checkRule = (
    rule: ValidationRule,
    metadata: MediaMetadata
  ): string | null => {
    const hasDimensions = metadata.width > 0 && metadata.height > 0;
    const isVideo = metadata.duration > 0;

    if (rule.mediaType === "image" && isVideo) return null;
    if (rule.mediaType === "video" && !isVideo) return null;

    if (rule.type === "duration" && metadata.duration === 0) return null;

    switch (rule.type) {
      case "duration":
        if (metadata.duration > 0) {
          if (rule.min && metadata.duration < rule.min) return rule.message;
          if (rule.max && metadata.duration > rule.max) return rule.message;
        }
        break;

      case "aspectRatio":
        if (hasDimensions) {
          if (rule.max && metadata.ratio > rule.max) return rule.message;
          if (rule.min && metadata.ratio < rule.min) return rule.message;
        }
        break;

      case "resolution":
        if (hasDimensions) {
          if (rule.minWidth && metadata.width < rule.minWidth)
            return rule.message;
          if (rule.minHeight && metadata.height < rule.minHeight)
            return rule.message;
        }
        break;

      case "fileType":
        if (metadata.mimeType && rule.allowedTypes) {
          if (!rule.allowedTypes.includes(metadata.mimeType)) {
            return rule.message;
          }
        }
        break;

      case "fileSize":
        if (metadata.size) {
          if (rule.max && metadata.size > rule.max) return rule.message;
        }
        break;
    }
    return null;
  };

  useEffect(() => {
    let isMounted = true;

    const runValidation = async () => {
      const newMediaErrors: MediaErrors = {};

      if (selectedAccounts["facebook"]?.length > 0) {
        const fbRules =
          POST_EDITOR_VALIDATION_RULES["facebook"]?.[facebookPostType] || [];
        const fbMediaUids = platformMediaSelections["facebook"] || [];

        const fbVideoItems = fbMediaUids
          .map((uid) => stagedMediaItems.find((i) => i.uid === uid))
          .filter((item) => item?.type === "video");
        const fbImageItems = fbMediaUids
          .map((uid) => stagedMediaItems.find((i) => i.uid === uid))
          .filter((item) => item?.type === "image");

        if (fbVideoItems.length > 1) {
          if (!newMediaErrors["facebook"]) newMediaErrors["facebook"] = {};
          fbVideoItems.forEach((item) => {
            if (item) {
              newMediaErrors["facebook"][item.uid] = [
                ...(newMediaErrors["facebook"][item.uid] || []),
                "Facebook allows only one video per post.",
              ];
            }
          });
        }

        if (fbVideoItems.length > 0 && fbImageItems.length > 0) {
          if (!newMediaErrors["facebook"]) newMediaErrors["facebook"] = {};
          [...fbVideoItems, ...fbImageItems].forEach((item) => {
            if (item) {
              newMediaErrors["facebook"][item.uid] = [
                ...(newMediaErrors["facebook"][item.uid] || []),
                "Facebook does not support mixing photos and videos.",
              ];
            }
          });
        }

        if (fbRules.length > 0) {
          for (const uid of fbMediaUids) {
            const item = stagedMediaItems.find((i) => i.uid === uid);
            if (item?.type === "video") {
              const source = item.file || item.mediaUrl || item.preview;
              if (!source) continue;
              const metadata = await getVideoMetadata(source);
              if (!isMounted) return;

              const itemErrors: string[] = [];
              for (const rule of fbRules) {
                const error = checkRule(rule, metadata);
                if (error) itemErrors.push(error);
              }
              if (itemErrors.length > 0) {
                if (!newMediaErrors["facebook"])
                  newMediaErrors["facebook"] = {};
                newMediaErrors["facebook"][uid] = [
                  ...(newMediaErrors["facebook"][uid] || []),
                  ...itemErrors,
                ];
              }
            }
          }
        }
      }

      if (selectedAccounts["tiktok"]?.length > 0) {
        const tiktokRules =
          POST_EDITOR_VALIDATION_RULES["tiktok"]?.["post"] || [];
        const tiktokMediaUids = platformMediaSelections["tiktok"] || [];

        for (const uid of tiktokMediaUids) {
          const item = stagedMediaItems.find((i) => i.uid === uid);
          if (item?.type === "video") {
            const source = item.file || item.mediaUrl || item.preview;
            if (!source) continue;
            const metadata = await getVideoMetadata(source);
            if (!isMounted) return;

            const itemErrors: string[] = [];
            for (const rule of tiktokRules) {
              const error = checkRule(rule, metadata);
              if (error) itemErrors.push(error);
            }
            if (itemErrors.length > 0) {
              if (!newMediaErrors["tiktok"]) newMediaErrors["tiktok"] = {};
              newMediaErrors["tiktok"][uid] = itemErrors;
            }
          }
        }
      }

      if (selectedAccounts["instagram"]?.length > 0) {
        const igRules =
          POST_EDITOR_VALIDATION_RULES["instagram"]?.[postType] || [];
        const igMediaUids = platformMediaSelections["instagram"] || [];

        for (const uid of igMediaUids) {
          const item = stagedMediaItems.find((i) => i.uid === uid);
          if (!item) continue;

          const source = item.file || item.mediaUrl || item.preview;
          if (!source) continue;

          let metadata: MediaMetadata;
          if (item.type === "video") {
            metadata = await getVideoMetadata(source);
          } else {
            metadata = await getImageMetadata(source);
          }
          if (!isMounted) return;

          const itemErrors: string[] = [];
          const hasCrop = item.crops && item.crops["instagram"];

          for (const rule of igRules) {
            if (rule.type === "aspectRatio" && hasCrop) {
              continue;
            }

            const error = checkRule(rule, metadata);
            if (error) itemErrors.push(error);
          }

          if (itemErrors.length > 0) {
            if (!newMediaErrors["instagram"]) newMediaErrors["instagram"] = {};
            newMediaErrors["instagram"][uid] = itemErrors;
          }
        }
      }

      if (isMounted) setMediaErrors(newMediaErrors);
    };

    runValidation();

    return () => {
      isMounted = false;
    };
  }, [
    selectedAccounts,
    platformMediaSelections,
    stagedMediaItems,
    facebookPostType,
    postType,
  ]);

  const validatePost = useCallback(async (): Promise<boolean> => {
    setIsValidating(true);
    const flatErrors = Object.values(mediaErrors).flatMap((platformErrors) =>
      Object.values(platformErrors).flat()
    );

    if (flatErrors.length > 0) {
      const uniqueErrors = Array.from(new Set(flatErrors));
      setBlockingErrors(uniqueErrors);
      setIsValidating(false);
      return false;
    }

    setBlockingErrors([]);
    setIsValidating(false);
    return true;
  }, [mediaErrors]);

  return {
    validatePost,
    validationErrors: blockingErrors,
    mediaErrors,
    isValidating,
    clearErrors: () => setBlockingErrors([]),
  };
}
