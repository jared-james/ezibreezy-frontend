// components/onboarding/onboarding-provisioning.tsx

"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { syncUser } from "@/app/actions/user";

interface OnboardingProvisioningProps {
  onComplete: (workspaceId: string, workspaceSlug: string) => void;
}

type PollingStatus = "polling" | "success" | "timeout";

export default function OnboardingProvisioning({
  onComplete,
}: OnboardingProvisioningProps) {
  const [status, setStatus] = useState<PollingStatus>("polling");
  const [attempts, setAttempts] = useState(0);
  const MAX_ATTEMPTS = 30; // 60 seconds (30 attempts * 2 seconds)

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    let attemptCount = 0;

    const pollForWorkspace = async () => {
      try {
        console.log(`[Provisioning] Polling attempt ${attemptCount + 1}/${MAX_ATTEMPTS}`);
        const result = await syncUser();

        console.log("[Provisioning] Sync result:", {
          success: result.success,
          event: result.event,
          targetOrganizationId: result.targetOrganizationId,
          targetWorkspaceId: result.targetWorkspaceId,
          targetWorkspaceSlug: result.targetWorkspaceSlug,
        });

        if (!isMounted) return;

        // Success: Webhook completed, user has organization
        if (
          result.success &&
          result.event === "login" &&
          result.targetOrganizationId
        ) {
          console.log("[Provisioning] ✅ Workspace provisioned successfully!");
          setStatus("success");

          // Call the callback with workspace details
          if (result.targetWorkspaceId && result.targetWorkspaceSlug) {
            setTimeout(() => {
              onComplete(result.targetWorkspaceId, result.targetWorkspaceSlug);
            }, 1500); // Show success state briefly before redirecting
          }
          return;
        }

        // Still processing: Webhook hasn't completed yet
        if (result.success && result.event === "onboarding_required") {
          console.log("[Provisioning] ⏳ Still processing, polling again...");
          attemptCount++;
          setAttempts(attemptCount);

          // Check if we've exceeded max attempts
          if (attemptCount >= MAX_ATTEMPTS) {
            console.log("[Provisioning] ⚠️ Max attempts reached, timing out");
            setStatus("timeout");
            return;
          }

          // Poll again after 2 seconds
          timeoutId = setTimeout(() => {
            if (isMounted) {
              pollForWorkspace();
            }
          }, 2000);
        }
      } catch (error) {
        console.error("[Provisioning] Error during polling:", error);

        attemptCount++;
        setAttempts(attemptCount);

        if (attemptCount >= MAX_ATTEMPTS) {
          console.log("[Provisioning] ⚠️ Max attempts reached after error");
          setStatus("timeout");
          return;
        }

        // Retry on error
        timeoutId = setTimeout(() => {
          if (isMounted) {
            pollForWorkspace();
          }
        }, 2000);
      }
    };

    // Start polling
    pollForWorkspace();

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [onComplete]); // Only onComplete in dependencies, NOT attempts

  return (
    <div className="flex flex-col items-center justify-center space-y-6 min-h-[400px]">
      {status === "polling" && (
        <>
          <div className="relative">
            <Loader2 className="w-16 h-16 text-brand-primary animate-spin" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Building Your Workspace...
            </h2>
            <p className="font-serif text-foreground/60 max-w-md">
              Please wait while we provision your organization and workspace.
              This usually takes just a few seconds.
            </p>
            <p className="font-mono text-xs text-foreground/40 pt-2">
              Attempt {attempts + 1} of {MAX_ATTEMPTS}
            </p>
          </div>
        </>
      )}

      {status === "success" && (
        <>
          <div className="relative">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Workspace Created!
            </h2>
            <p className="font-serif text-foreground/60">
              Redirecting you to connect your accounts...
            </p>
          </div>
        </>
      )}

      {status === "timeout" && (
        <>
          <div className="relative">
            <XCircle className="w-16 h-16 text-amber-500" />
          </div>
          <div className="text-center space-y-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Taking Longer Than Expected
            </h2>
            <p className="font-serif text-foreground/60 max-w-md">
              Your workspace is still being set up. You can refresh this page in
              a moment, or contact support if the issue persists.
            </p>
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.reload();
                }
              }}
              className="inline-block bg-brand-primary text-white px-6 py-3 font-mono text-xs uppercase tracking-wider hover:bg-brand-primary-hover transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </>
      )}
    </div>
  );
}
