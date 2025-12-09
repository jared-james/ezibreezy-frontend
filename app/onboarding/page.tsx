// app/onboarding/page.tsx

import { redirect } from "next/navigation";
import { getOnboardingRoute } from "@/app/actions/onboarding";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; canceled?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;
  const canceled = params.canceled;

  // Handle payment cancellation
  if (canceled) {
    redirect("/onboarding/pricing");
  }

  // If session_id is present, redirect to checkout for verification
  if (sessionId) {
    redirect(`/onboarding/checkout?session_id=${sessionId}`);
  }

  // Otherwise, determine the correct step based on user's progress
  const route = await getOnboardingRoute();
  redirect(route);
}
