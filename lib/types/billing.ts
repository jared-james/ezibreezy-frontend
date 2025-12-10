// lib/types/billing.ts

/**
 * Billing and Subscription Types
 * Aligned with backend billing implementation
 */

export type PlanTier = "creator" | "agency" | "scale";
export type BillingCycle = "monthly" | "yearly";

export interface PricingPlan {
  tier: PlanTier;
  name: string;
  description: string;
  monthlyPriceId: string;
  yearlyPriceId: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
}

export interface OnboardingData {
  role: PlanTier;
  billingCycle: BillingCycle;
  selectedPriceId: string;
  sessionId?: string;
  organizationName?: string;
  workspaceName?: string;
  timezone?: string;
}

// Server action response types
export interface CreateCheckoutResponse {
  success: boolean;
  url?: string;
  sessionId?: string;
  error?: string;
}

export interface VerifySessionResponse {
  success: boolean;
  verified?: boolean;
  customerId?: string;
  subscriptionId?: string;
  priceId?: string;
  metadata?: Record<string, unknown>;
  error?: string;
}
