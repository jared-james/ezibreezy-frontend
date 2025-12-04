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

      // Clean up the URL
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("invite");
      router.replace(`?${newParams.toString()}`);
    } else if (inviteStatus === "error") {
      toast.error("There was an issue processing your invite.");
    }
  }, [searchParams, router]);

  return null;
}
