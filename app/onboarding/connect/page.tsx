// app/onboarding/connect/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingConnect from "@/components/onboarding/onboarding-connect";
import { syncUser } from "@/app/actions/user";

export default function ConnectPage() {
  const router = useRouter();
  const [workspaceData, setWorkspaceData] = useState<{
    id: string;
    slug: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Try to get workspace data from localStorage first (set by workspace page)
    const storedData = localStorage.getItem("onboarding_workspace_data");

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData.id && parsedData.slug) {
          setWorkspaceData(parsedData);
          setIsLoading(false);
          // Clean up the stored data
          localStorage.removeItem("onboarding_workspace_data");
          return;
        }
      } catch (error) {
        console.error("Failed to parse stored workspace data:", error);
      }
    }

    // Fallback: If no stored data, fetch from backend
    const fetchWorkspace = async () => {
      try {
        const result = await syncUser();
        if (result.targetWorkspaceId && result.targetWorkspaceSlug) {
          setWorkspaceData({
            id: result.targetWorkspaceId,
            slug: result.targetWorkspaceSlug,
          });
        } else {
          // No workspace found, redirect to workspace creation
          router.push("/onboarding/workspace");
        }
      } catch (error) {
        console.error("Failed to fetch workspace:", error);
        router.push("/onboarding/workspace");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspace();
  }, [router]);

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

  if (isLoading || !workspaceData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
          <p className="mt-4 font-serif text-foreground/60">
            Ready to connect your accounts?
          </p>
        </div>
      </div>
    );
  }

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
