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
      },
      {
        type: "aspectRatio",
        max: 0.62, // Strict vertical check (~9:16)
        message: "Facebook Stories require a vertical aspect ratio (9:16).",
      },
      {
        type: "resolution",
        minWidth: 540,
        minHeight: 960,
        message: "Video resolution is too low. Minimum required is 540x960.",
      },
      {
        type: "fileType",
        allowedTypes: ["video/mp4"],
        message: "Facebook Stories recommend .mp4 format.",
      },
    ],
  },
  instagram: {
    story: [],
    post: [],
  },
  // --- ADDED TIKTOK RULES ---
  tiktok: {
    post: [
      {
        type: "fileSize",
        max: 4 * 1024 * 1024 * 1024, // 4GB
        message: "Video exceeds TikTok's 4GB file size limit.",
      },
      {
        type: "duration",
        min: 3,
        max: 600, // 10 minutes
        message: "TikTok videos must be between 3 seconds and 10 minutes.",
      },
      {
        type: "resolution",
        minWidth: 360,
        minHeight: 360,
        message:
          "Video resolution is too low. TikTok requires at least 360 pixels.",
      },
      {
        type: "fileType",
        allowedTypes: ["video/mp4", "video/webm", "video/quicktime"], // .mp4, .webm, .mov
        message: "Unsupported video format. TikTok accepts MP4, WebM, or MOV.",
      },
    ],
  },
};
