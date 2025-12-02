// instrumentation-client.ts

import posthog from "posthog-js";

// ⛔ No PostHog on localhost / dev
if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    ui_host: "https://us.posthog.com",
    defaults: "2025-05-24",
    capture_exceptions: true,
  });
}
