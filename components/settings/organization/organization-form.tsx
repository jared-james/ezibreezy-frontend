// app/(app)/settings/organization/organization-form.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertTriangle, Building2 } from "lucide-react";
import { updateOrganizationName } from "@/app/actions/organization";
import { usePermissions } from "@/lib/hooks/use-permissions";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { toast } from "sonner";

interface OrganizationFormProps {
  initialOrgName: string;
  organizationId: string;
}

export default function OrganizationForm({
  initialOrgName,
  organizationId,
}: OrganizationFormProps) {
  const [orgName, setOrgName] = useState(initialOrgName);
  const [isUpdatingOrg, setIsUpdatingOrg] = useState(false);
  const { currentOrganization } = useWorkspaceStore();

  // Security check: If they land here via URL but aren't admin
  const isAdmin =
    currentOrganization?.role === "owner" ||
    currentOrganization?.role === "admin";

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
    <form className="space-y-6">
      <div className="pb-6">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="font-serif text-lg font-bold text-foreground">
            Organization Details
          </h3>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="space-y-4">
          <div>
            <label className="eyebrow mb-2 flex items-center gap-2">
              <Building2 className="w-3 h-3" /> Organization Name
            </label>
            <div className="flex gap-2 items-start pt-2">
              <Input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Your Organization Name"
                className="flex-1"
                disabled={isUpdatingOrg}
              />
              <Button
                type="button"
                variant="primary"
                onClick={handleOrgNameSubmit}
                disabled={isUpdatingOrg || !isOrgDirty}
              >
                {isUpdatingOrg ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
            <p className="font-serif text-xs text-muted-foreground mt-2">
              This name is shown in the sidebar and is visible to all members of
              your organization.
            </p>
          </div>
        </div>

        {/* Future: Add Billing / Plan details here */}
      </div>
    </form>
  );
}
