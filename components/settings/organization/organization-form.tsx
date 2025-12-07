// components/settings/organization/organization-form.tsx

"use client";

import { useState } from "react";
import { Loader2, AlertTriangle, Building2, Save } from "lucide-react";
import { updateOrganizationName } from "@/app/actions/organization";
import { toast } from "sonner";

interface OrganizationFormProps {
  initialOrgName: string;
  organizationId: string;
  initialRole: "owner" | "admin" | "member";
}

export default function OrganizationForm({
  initialOrgName,
  organizationId,
  initialRole,
}: OrganizationFormProps) {
  const [orgName, setOrgName] = useState(initialOrgName);
  const [isUpdatingOrg, setIsUpdatingOrg] = useState(false);

  const isAdmin = initialRole === "owner" || initialRole === "admin";

  if (!isAdmin) {
    return (
      <div className="border border-error/50 bg-error/5 p-8 text-center rounded-sm">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-error/10 flex items-center justify-center border border-error/20">
            <AlertTriangle className="h-6 w-6 text-error" />
          </div>
        </div>
        <h3 className="font-serif text-xl font-bold text-error mb-2">
          Access Restricted
        </h3>
        <p className="font-serif text-muted-foreground max-w-md mx-auto">
          You do not have permission to modify organization details. Please
          contact an administrator.
        </p>
      </div>
    );
  }

  const handleOrgNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim() || orgName === initialOrgName) return;

    setIsUpdatingOrg(true);
    const result = await updateOrganizationName(organizationId, orgName);
    setIsUpdatingOrg(false);

    if (result.success) {
      toast.success("Organization name updated successfully.");
    } else {
      toast.error(`Failed to update name: ${result.error}`);
      setOrgName(initialOrgName);
    }
  };

  const isOrgDirty =
    orgName.trim() !== initialOrgName && orgName.trim().length > 0;

  return (
    <section>
      <div className="max-w-2xl mb-8">
        <h3 className="font-serif text-xl font-bold text-foreground tracking-tight">
          Organization Details
        </h3>
        <p className="font-serif text-sm text-muted-foreground mt-2 leading-relaxed max-w-lg">
          Manage your organization's basic information and settings.
        </p>
      </div>

      <div className="space-y-8 max-w-3xl">
        <div className="space-y-4">
          <label className="eyebrow block">Organization Name</label>
          <div className="flex items-center gap-4 border-b border-border hover:border-foreground/30 transition-colors pb-2">
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Your Organization Name"
              className="flex-1 h-auto py-2 bg-transparent border-none rounded-none text-xl font-serif text-foreground placeholder:text-muted-foreground/20 px-0 focus-visible:ring-0 shadow-none outline-none"
              disabled={isUpdatingOrg}
            />
            <button
              type="button"
              onClick={handleOrgNameSubmit}
              disabled={isUpdatingOrg || !isOrgDirty}
              className={`btn btn-primary h-8 px-4 transition-all duration-300 ${
                isOrgDirty
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 pointer-events-none translate-x-4"
              }`}
            >
              {isUpdatingOrg ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
