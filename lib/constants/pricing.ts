// lib/constants/pricing.ts

import type { PlanTier, PricingPlan } from "@/lib/types/billing";

export const PRICING_PLANS: Record<PlanTier, PricingPlan> = {
  creator: {
    tier: "creator",
    name: "Creator",
    description: "Perfect for solo creators building their personal brand",
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREATOR_MONTHLY || "",
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREATOR_YEARLY || "",
    monthlyPrice: 25,
    yearlyPrice: 240,
    features: [
      "1 user account",
      "2 workspaces",
      "20 social connections",
      "Social Inbox",
      "Advanced Analytics",
      "Hashtag & Label Manager", // Combined for space
      "First comment scheduling",
      "Social Calendar",
      "Canva integration",
      "20GB Media Storage",
    ],
  },
  agency: {
    tier: "agency",
    name: "Agency",
    description: "For growing teams managing multiple brands or clients",
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_AGENCY_MONTHLY || "",
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_AGENCY_YEARLY || "",
    monthlyPrice: 70,
    yearlyPrice: 672,
    features: [
      // Added this line:
      "Everything in Creator +",
      "5 team members",
      "5 workspaces",
      "50 social connections",
      "Roles and permissions",
      "Internal collaboration & approvals",
      "External client workflows",
      "50GB Media Storage",
    ],
  },
  scale: {
    tier: "scale",
    name: "Scale",
    description: "For large organizations requiring scale and more security",
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_SCALE_MONTHLY || "",
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_SCALE_YEARLY || "",
    monthlyPrice: 150,
    yearlyPrice: 1440,
    features: [
      // Added this line:
      "Everything in Agency +",
      "Unlimited team members",
      "Unlimited workspaces",
      "Unlimited social connections",
      "Dedicated Success Manager",
      "SSO Enforcement",
      "99.9% Uptime SLA",
      "Advanced Audit Logs",
      "White-glove phone support",
      "100GB Media Storage",
    ],
  },
};

// Role selection options with descriptions
export const ROLE_OPTIONS: Array<{
  tier: PlanTier;
  title: string;
  description: string;
  icon: string;
}> = [
  {
    tier: "creator",
    title: "Solo Creator",
    description: "I'm a solo operator managing my own content and brand.",
    icon: "user",
  },
  {
    tier: "agency",
    title: "Agency / Team",
    description: "We are a team managing content for multiple clients.",
    icon: "users",
  },
  {
    tier: "scale",
    title: "Scale",
    description: "We are a large organization with complex compliance needs.",
    icon: "building",
  },
];
