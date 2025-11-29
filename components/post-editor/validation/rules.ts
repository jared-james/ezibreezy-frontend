// components/post-editor/validation/rules.ts

export type ValidationRuleType =
  | "duration"
  | "aspectRatio"
  | "fileSize"
  | "required"
  | "resolution" // New
  | "fileType"; // New

export interface ValidationRule {
  type: ValidationRuleType;
  value?: number | string;
  min?: number;
  max?: number;
  message: string;
  // Specific properties for new rules
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
        max: 60, // Capped at 60s for Pages per specs
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
};
