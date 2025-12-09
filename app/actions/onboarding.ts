// app/actions/onboarding.ts

"use server";

import { authenticatedFetch } from "@/app/actions/billing";
import { verifyCheckoutSession } from "@/app/actions/billing";

/**
 * Determines which onboarding route the user should be redirected to
 * based on their current progress (workspace existence, payment verification)
 */
export async function getOnboardingRoute(sessionId?: string): Promise<string> {
  try {
    // 1. Check if user already has organization/workspace
    const structureResult = await authenticatedFetch("/workspaces/structure");

    if (structureResult.success && structureResult.data?.length > 0) {
      const workspace = structureResult.data[0]?.workspaces?.[0];
      if (workspace?.slug) {
        // User already has workspace → redirect to dashboard
        return `/${workspace.slug}/dashboard`;
      }
    }

    // 2. Check if payment has been verified (if sessionId provided)
    if (sessionId) {
      const verifyResult = await verifyCheckoutSession(sessionId);
      if (verifyResult.success && verifyResult.verified) {
        // Payment verified but no workspace → go to workspace creation
        return "/onboarding/workspace";
      }
    }

    // 3. Check if user has an active subscription (paid but no workspace yet)
    // This handles the case where user paid, logged out, and came back
    const subscriptionResult = await authenticatedFetch("/billing/subscription");
    if (subscriptionResult.success && subscriptionResult.data?.subscription) {
      // Has active subscription but no workspace → go to workspace creation
      return "/onboarding/workspace";
    }

    // 4. No workspace, no verified payment, no subscription → start from beginning
    return "/onboarding/role";
  } catch (error) {
    console.error("[getOnboardingRoute] Error determining route:", error);
    // Fallback to role selection on any error
    return "/onboarding/role";
  }
}
