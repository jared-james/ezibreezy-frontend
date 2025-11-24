import { useState, useRef, useCallback, useEffect } from "react";
import { getPostDetails } from "@/lib/api/publishing";
import { toast } from "sonner";

export function usePostStatusPolling() {
  const [isPolling, setIsPolling] = useState(false);
  const stopPollingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (stopPollingRef.current === false) {
        stopPollingRef.current = true;
        toast.dismiss("publishing-toast");
      }
    };
  }, []);

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
            stopPollingRef.current = true;
            onSuccess();
            return;
          }

          if (post.status === "failed") {
            setIsPolling(false);
            stopPollingRef.current = true;
            onError(post.error || "The social platform rejected the post.");
            return;
          }

          attempts++;
          if (attempts >= MAX_ATTEMPTS) {
            setIsPolling(false);
            stopPollingRef.current = true;
            onTimeout();
            return;
          }

          setTimeout(checkStatus, POLLING_INTERVAL);
        } catch (e) {
          console.error("Polling error", e);
          setIsPolling(false);
          stopPollingRef.current = true;
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
