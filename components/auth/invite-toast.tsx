// components/auth/invite-toast.tsx

"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export function InviteToast() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const inviteStatus = searchParams.get("invite");

    if (inviteStatus === "success") {
      toast.success("Invitation accepted! Welcome to the workspace.");

      // Clean up the URL - only remove 'invite' param
      // WorkspaceQuerySelector will handle 'workspaceId' cleanup
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("invite");

      // Only update URL if we actually removed something
      const newUrl = newParams.toString()
        ? `?${newParams.toString()}`
        : window.location.pathname;
      router.replace(newUrl, { scroll: false });
    } else if (inviteStatus === "error") {
      toast.error("There was an issue processing your invite.");

      // Clean up error param
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("invite");
      const newUrl = newParams.toString()
        ? `?${newParams.toString()}`
        : window.location.pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, router]);

  return null;
}
