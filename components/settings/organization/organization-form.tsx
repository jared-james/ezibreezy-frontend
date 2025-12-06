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
    <div className="relative">
      <div className="absolute -top-3 left-4 bg-surface px-2 z-10">
        <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-foreground bg-brand-primary/10 px-2 py-0.5 border border-brand-primary/20 rounded-sm">
          Organization Profile
        </span>
      </div>

      <form
        onSubmit={handleOrgNameSubmit}
        className="border border-border p-6 md:p-8 space-y-6 bg-surface rounded-sm"
      >
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2 pl-1">
              <Building2 className="w-3.5 h-3.5" /> Legal Name
            </label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Your Organization Name"
              className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all font-serif rounded-sm"
              disabled={isUpdatingOrg}
            />
            <p className="font-serif text-xs text-muted-foreground mt-2 pl-1">
              This name is shown in the sidebar and is visible to all members of
              your organization.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-dashed border-border flex items-center justify-between">
          <div className="text-sm min-h-[20px]"></div>

          <button
            type="submit"
            disabled={isUpdatingOrg || !isOrgDirty}
            className={`btn btn-primary transition-all duration-200 ${
              !isOrgDirty || isUpdatingOrg
                ? "opacity-50 cursor-not-allowed grayscale"
                : ""
            }`}
          >
            {isUpdatingOrg ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
