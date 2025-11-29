// components/post-editor/validation/rules.ts

export type ValidationRuleType =
  | "duration"
  | "aspectRatio"
  | "fileSize"
  | "required";

export interface ValidationRule {
  type: ValidationRuleType;
  value?: number | string;
  min?: number;
  max?: number;
  message: string;
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
        message: "Facebook Stories must be between 3 and 60 seconds long.",
      },
      {
        type: "aspectRatio",
        max: 0.62, // ~9:16 is 0.5625. Allowing up to 0.62 for slight variance.
        message: "Facebook Stories require a vertical aspect ratio (9:16).",
      },
    ],
  },
  // Future expansion
  instagram: {
    story: [],
    post: [],
  },
};
