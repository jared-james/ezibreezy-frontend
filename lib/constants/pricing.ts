// lib/constants/pricing.ts

import type { PlanTier, PricingPlan } from "@/lib/types/billing";

/**
 * Pricing Plans Configuration
 * Aligned with backend billing limits and Stripe price IDs
 */

export const PRICING_PLANS: Record<PlanTier, PricingPlan> = {
  creator: {
    tier: "creator",
    name: "Creator",
    description: "Perfect for solo creators building their personal brand",
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREATOR_MONTHLY || "",
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREATOR_YEARLY || "",
    monthlyPrice: 20,
    yearlyPrice: 200, // $20/month equivalent
    features: [
      "1 user account",
      "2 workspaces",
      "20 social connections",
      "10 GB media storage",
      "Unified Social Inbox",
      "AI-powered caption writing",
      "Basic performance analytics",
    ],
    limits: {
      users: 1,
      workspaces: 2,
      integrations: 20,
      storage: "10 GB",
    },
  },
  agency: {
    tier: "agency",
    name: "Agency",
    description: "For growing teams managing multiple brands or clients",
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_AGENCY_MONTHLY || "",
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_AGENCY_YEARLY || "",
    monthlyPrice: 49,
    yearlyPrice: 490, // $49/month equivalent
    features: [
      "Unlimited team members",
      "5 workspaces",
      "50 social connections",
      "50 GB media storage",
      "Approval workflows & comments",
      "Advanced analytics & reporting",
      "Client management tools",
    ],
    limits: {
      users: -1, // -1 often represents unlimited in logic
      workspaces: 5,
      integrations: 50,
      storage: "50 GB",
    },
  },
  enterprise: {
    tier: "enterprise",
    name: "Enterprise",
    description: "For large organizations requiring scale and security",
    monthlyPriceId:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY || "",
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_YEARLY || "",
    monthlyPrice: 149,
    yearlyPrice: 1490, // $149/month equivalent
    features: [
      "Unlimited team members",
      "Unlimited workspaces",
      "Unlimited social connections",
      "1 TB media storage",
      "Dedicated Success Manager",
      "Custom Onboarding & Training",
      "SSO (Single Sign-On) Enforcement",
      "99.9% Uptime SLA",
      "Advanced Audit Logs",
      "24/7 White-glove phone support",
    ],
    limits: {
      users: -1,
      workspaces: -1,
      integrations: -1,
      storage: "1 TB",
    },
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
    tier: "enterprise",
    title: "Enterprise",
    description: "We are a large organization with complex compliance needs.",
    icon: "building",
  },
];
