// components/post-editor/validation/rules.ts

export type ValidationRuleType =
  | "duration"
  | "aspectRatio"
  | "fileSize"
  | "required"
  | "resolution"
  | "fileType";

export interface ValidationRule {
  type: ValidationRuleType;
  value?: number | string;
  min?: number;
  max?: number;
  message: string;
  minWidth?: number;
  minHeight?: number;
  allowedTypes?: string[];
  mediaType?: "image" | "video";
}

export interface PlatformValidationRules {
  [postType: string]: ValidationRule[];
}

export interface SocialPlatformRules {
  [platformId: string]: PlatformValidationRules;
}

export const POST_EDITOR_VALIDATION_RULES: SocialPlatformRules = {
  facebook: {
    story: [
      {
        type: "duration",
        min: 3,
        max: 60,
        message: "Facebook Stories must be between 3 and 60 seconds.",
        mediaType: "video",
      },
      {
        type: "aspectRatio",
        max: 0.62,
        message: "Facebook Stories require a vertical aspect ratio (9:16).",
      },
      {
        type: "resolution",
        minWidth: 540,
        minHeight: 960,
        message: "Video resolution is too low. Minimum required is 540x960.",
        mediaType: "video",
      },
      {
        type: "fileType",
        allowedTypes: ["video/mp4"],
        message: "Facebook Stories recommend .mp4 format.",
        mediaType: "video",
      },
    ],
  },
  instagram: {
    post: [
      {
        type: "aspectRatio",
        min: 0.8,
        max: 1.91,
        message:
          "Instagram Feed images must be between 4:5 (portrait) and 1.91:1 (landscape). Please crop the image.",
        mediaType: "image",
      },
      {
        type: "fileSize",
        max: 8 * 1024 * 1024,
        message: "Image exceeds Instagram's 8MB limit.",
        mediaType: "image",
      },
      {
        type: "fileSize",
        max: 300 * 1024 * 1024,
        message: "Video exceeds Instagram's 300MB limit.",
        mediaType: "video",
      },
      {
        type: "duration",
        min: 3,
        max: 900,
        message: "Instagram Videos must be between 3 seconds and 15 minutes.",
        mediaType: "video",
      },
      {
        type: "fileType",
        allowedTypes: ["video/mp4", "video/quicktime"],
        message: "Unsupported video format. Use MP4 or MOV.",
        mediaType: "video",
      },
    ],
    story: [
      {
        type: "duration",
        min: 3,
        max: 60,
        message: "Instagram Stories must be under 60 seconds.",
        mediaType: "video",
      },
      {
        type: "aspectRatio",
        max: 0.6,
        message: "Instagram Stories should be vertical (9:16).",
      },
    ],
    reel: [
      {
        type: "duration",
        min: 3,
        max: 900,
        message: "Instagram Reels must be between 3 seconds and 15 minutes.",
        mediaType: "video",
      },
      {
        type: "fileSize",
        max: 300 * 1024 * 1024,
        message: "Reel exceeds the 300MB file size limit.",
        mediaType: "video",
      },
      {
        type: "fileType",
        allowedTypes: ["video/mp4", "video/quicktime"],
        message: "Unsupported video format. Use MP4 or MOV.",
        mediaType: "video",
      },
    ],
  },
  tiktok: {
    post: [
      {
        type: "fileSize",
        max: 4 * 1024 * 1024 * 1024,
        message: "Video exceeds TikTok's 4GB file size limit.",
        mediaType: "video",
      },
      {
        type: "duration",
        min: 3,
        max: 600,
        message: "TikTok videos must be between 3 seconds and 10 minutes.",
        mediaType: "video",
      },
      {
        type: "resolution",
        minWidth: 360,
        minHeight: 360,
        message:
          "Video resolution is too low. TikTok requires at least 360 pixels.",
        mediaType: "video",
      },
      {
        type: "fileType",
        allowedTypes: ["video/mp4", "video/webm", "video/quicktime"],
        message: "Unsupported video format. TikTok accepts MP4, WebM, or MOV.",
        mediaType: "video",
      },
    ],
  },
  youtube: {
    post: [
      {
        type: "fileType",
        allowedTypes: [
          "video/mp4",
          "video/quicktime",
          "video/x-msvideo",
          "video/webm",
        ],
        message:
          "Unsupported video format. YouTube accepts MP4, MOV, AVI, or WebM.",
        mediaType: "video",
      },
      {
        type: "fileSize",
        max: 128 * 1024 * 1024 * 1024,
        message: "Video exceeds YouTube's 128GB file size limit.",
        mediaType: "video",
      },
    ],
  },
};
