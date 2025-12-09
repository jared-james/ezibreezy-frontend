// lib/hooks/use-timezone.ts

import { useState, useEffect } from "react";

export function useTimezone() {
  // Initialize with empty string to avoid server/client hydration mismatch
  const [timezone, setTimezone] = useState<string>("");

  useEffect(() => {
    // 1. Try to guess via Internationalization API
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detected) {
        setTimezone(detected);
      }
    } catch (e) {
      // 2. Fallback if detection is blocked by privacy settings
      console.warn("Timezone detection failed", e);
      setTimezone("UTC");
    }
  }, []);

  return { timezone, setTimezone };
}
