// app/onboarding/role/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingRole from "@/components/onboarding/onboarding-role";
import type { PlanTier } from "@/lib/types/billing";

export default function RolePage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<PlanTier | null>(null);

  const handleSelectRole = (role: PlanTier) => {
    setSelectedRole(role);
    localStorage.setItem("onboarding_role", role);
    router.push("/onboarding/pricing");
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <OnboardingRole
        selectedRole={selectedRole}
        onSelectRole={handleSelectRole}
      />
    </div>
  );
}
