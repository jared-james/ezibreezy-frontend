// components/post-editor/use-post-status-polling.ts

import { useState, useRef, useCallback } from "react";
import { getPostDetails } from "@/lib/api/publishing";

export function usePostStatusPolling() {
  const [isPolling, setIsPolling] = useState(false);
  const stopPollingRef = useRef(false);

  const startPolling = useCallback(
    async (
      postIds: string[],
      onSuccess: () => void,
      onError: (error: string) => void,
      onTimeout: () => void
    ) => {
      setIsPolling(true);
      stopPollingRef.current = false;

      const POLLING_INTERVAL = 2000;
      const MAX_ATTEMPTS = 5;
      let attempts = 0;

      const checkStatus = async () => {
        if (stopPollingRef.current) return;

        try {
          const mainPostId = postIds[0];
          const post = await getPostDetails(mainPostId);

          if (post.status === "sent") {
            setIsPolling(false);
            onSuccess();
            return;
          }

          if (post.status === "failed") {
            setIsPolling(false);
            onError(post.error || "The social platform rejected the post.");
            return;
          }

          attempts++;
          if (attempts >= MAX_ATTEMPTS) {
            setIsPolling(false);
            onTimeout();
            return;
          }

          setTimeout(checkStatus, POLLING_INTERVAL);
        } catch (e) {
          console.error("Polling error", e);
          setIsPolling(false);
          onTimeout();
        }
      };

      setTimeout(checkStatus, POLLING_INTERVAL);
    },
    []
  );

  const stopPolling = useCallback(() => {
    stopPollingRef.current = true;
    setIsPolling(false);
  }, []);

  return {
    isPolling,
    startPolling,
    stopPolling,
  };
}
