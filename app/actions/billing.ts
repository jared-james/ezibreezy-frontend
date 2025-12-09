// app/actions/billing.ts

"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  CreateCheckoutResponse,
  VerifySessionResponse,
  PlanTier,
} from "@/lib/types/billing";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";
const API_KEY = process.env.API_KEY || process.env.NEXT_PUBLIC_API_KEY;

export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { success: false, error: "User is not authenticated." };
  }

  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "An unexpected error occurred." }));
      return { success: false, error: errorData.message };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unknown server error occurred.";

    console.error(
      `[Server Action Error] Endpoint: ${endpoint}, Error: ${message}`
    );

    return { success: false, error: "An unexpected server error occurred." };
  }
}

/**
 * Create Stripe checkout session for onboarding
 * Calls backend: POST /billing/checkout/onboarding
 */
export async function createOnboardingCheckout(data: {
  priceId: string;
  role: PlanTier;
  organizationName: string;
  workspaceName: string;
  timezone: string;
}): Promise<CreateCheckoutResponse> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { success: false, error: "User is not authenticated." };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/billing/checkout/onboarding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
        "x-api-key": API_KEY || "",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: `Checkout failed: ${errorData.message || response.statusText}`,
      };
    }

    const responseData = await response.json();

    return {
      success: true,
      url: responseData.url,
      sessionId: responseData.sessionId,
    };
  } catch (error) {
    console.error("[createOnboardingCheckout] Error:", error);
    return {
      success: false,
      error: "Failed to create checkout session.",
    };
  }
}

/**
 * Verify Stripe checkout session
 * Calls backend: GET /billing/verify-session?sessionId={sessionId}
 */
export async function verifyCheckoutSession(
  sessionId: string
): Promise<VerifySessionResponse> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { success: false, error: "User is not authenticated." };
  }

  try {
    const url = new URL(`${BACKEND_URL}/billing/verify-session`);
    url.searchParams.set("sessionId", sessionId);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "x-api-key": API_KEY || "",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: `Verification failed: ${
          errorData.message || response.statusText
        }`,
      };
    }

    const data = await response.json();

    return {
      success: true,
      verified: data.verified,
      customerId: data.customerId,
      subscriptionId: data.subscriptionId,
      priceId: data.priceId,
      metadata: data.metadata,
    };
  } catch (error) {
    console.error("[verifyCheckoutSession] Error:", error);
    return {
      success: false,
      error: "Failed to verify checkout session.",
    };
  }
}

/**
 * Store payment session immediately after Stripe redirect
 * This MUST be called when user returns from Stripe BEFORE showing workspace form
 * Calls backend: POST /billing/store-payment-session
 */
export async function storePaymentSession(sessionId: string): Promise<{
  success: boolean;
  verified?: boolean;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { success: false, error: "User is not authenticated." };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/billing/store-payment-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
        "x-api-key": API_KEY || "",
      },
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: `Failed to store payment session: ${
          errorData.message || response.statusText
        }`,
      };
    }

    const data = await response.json();

    return {
      success: data.success,
      verified: data.verified,
    };
  } catch (error) {
    console.error("[storePaymentSession] Error:", error);
    return {
      success: false,
      error: "Failed to store payment session.",
    };
  }
}
