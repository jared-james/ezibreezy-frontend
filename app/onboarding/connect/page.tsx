// app/onboarding/connect/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingConnect from "@/components/onboarding/onboarding-connect";
import { syncUser } from "@/app/actions/user";

export default function ConnectPage() {
  const router = useRouter();

  // Initialize workspace data from localStorage
  const [workspaceData, setWorkspaceData] = useState<{
    id: string;
    slug: string;
  } | null>(() => {
    if (typeof window === "undefined") return null;

    const storedData = localStorage.getItem("onboarding_workspace_data");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData.id && parsedData.slug) {
          return parsedData;
        }
      } catch (error) {
        console.error("Failed to parse stored workspace data:", error);
      }
    }
    return null;
  });

  const [isNavigating, setIsNavigating] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "confirming" | "confirmed" | "complete"
  >("confirming");

  useEffect(() => {
    // If no workspace data, fetch from backend as fallback
    if (!workspaceData) {
      const fetchWorkspace = async () => {
        try {
          const result = await syncUser();
          if (result.targetWorkspaceId && result.targetWorkspaceSlug) {
            setWorkspaceData({
              id: result.targetWorkspaceId,
              slug: result.targetWorkspaceSlug,
            });
          } else {
            // No workspace found, redirect to onboarding
            router.push("/onboarding");
          }
        } catch (error) {
          console.error("Failed to fetch workspace:", error);
          router.push("/onboarding");
        }
      };

      fetchWorkspace();
    }
  }, [workspaceData, router]);

  // Payment confirmation animation sequence
  useEffect(() => {
    if (workspaceData) {
      // Show "Confirming payment..." for 1.5 seconds
      const confirmedTimer = setTimeout(() => {
        setPaymentStatus("confirmed");
      }, 1500);

      // Show "Payment confirmed" for 1 second, then complete
      const completeTimer = setTimeout(() => {
        setPaymentStatus("complete");
      }, 2500);

      return () => {
        clearTimeout(confirmedTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [workspaceData]);

  // Prevent back navigation
  useEffect(() => {
    const preventBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    preventBack();
    window.addEventListener("popstate", preventBack);

    return () => {
      window.removeEventListener("popstate", preventBack);
    };
  }, []);

  const handleSkip = () => {
    if (workspaceData?.slug) {
      setIsNavigating(true);
      // Add a small delay to show the animation before navigating
      setTimeout(() => {
        router.push(`/${workspaceData.slug}/editorial`);
      }, 1500);
    }
  };

  if (isNavigating) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light animate-in fade-in duration-1000">
            Welcome to your new <span className="italic font-bold">organised chaos</span>
          </h2>
        </div>
      </div>
    );
  }

  // Payment confirmation flow
  if (!workspaceData || paymentStatus !== "complete") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          {paymentStatus === "confirming" && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
              <p className="mt-4 font-serif text-foreground/60 animate-in fade-in duration-500">
                Confirming payment...
              </p>
            </>
          )}
          {paymentStatus === "confirmed" && (
            <div className="animate-in fade-in duration-500">
              <div className="flex items-center justify-center mb-4">
                <svg
                  className="w-12 h-12 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="font-serif text-foreground text-lg">
                Payment confirmed
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 ease-out">
      <OnboardingConnect
        workspaceId={workspaceData.id}
        workspaceSlug={workspaceData.slug}
        onSkip={handleSkip}
      />
    </div>
  );
}
