// app/(app)/settings/profile/profile-form.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { updateOrganizationName } from "@/app/actions/organization";
import { toast } from "sonner";

interface ProfileFormProps {
  initialDisplayName: string;
  initialEmail: string;
  initialOrgName: string;
  organizationId: string;
}

export default function ProfileForm({
  initialDisplayName,
  initialEmail,
  initialOrgName,
  organizationId,
}: ProfileFormProps) {
  const [orgName, setOrgName] = useState(initialOrgName);
  const [isUpdatingOrg, setIsUpdatingOrg] = useState(false);

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

  return (
    <form className="space-y-6">
      {/* Organization Information */}
      <div className="border-b border-border pb-6">
        <h3 className="font-serif text-lg font-bold text-foreground mb-4">
          Organization Details
        </h3>
        <div className="space-y-4">
          <div>
            <label className="eyebrow mb-2">Organization Name</label>
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
                disabled={
                  isUpdatingOrg ||
                  orgName.trim() === initialOrgName ||
                  !orgName.trim()
                }
              >
                {isUpdatingOrg ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
            <p className="font-serif text-xs text-muted-foreground mt-1">
              This name is shown in the sidebar and is visible to all members.
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information (Showcasing Name/Email for context, but keeping fields disabled/static) */}
      <div className="border-b border-border pb-6">
        <h3 className="font-serif text-lg font-bold text-foreground mb-4">
          Personal Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="eyebrow mb-2">Full Name</label>
            <Input
              type="text"
              defaultValue={initialDisplayName}
              placeholder="John Doe"
              disabled
            />
          </div>

          <div>
            <label className="eyebrow mb-2">Email</label>
            <Input
              type="email"
              defaultValue={initialEmail}
              placeholder="john@example.com"
              disabled
            />
          </div>
        </div>
      </div>

      {/* Save button - Optional here, but usually good practice to keep a main action if other fields were present */}
      <div className="pt-4 flex justify-end">
        <Button type="button" variant="default" disabled>
          Save Profile Changes (Disabled)
        </Button>
      </div>
    </form>
  );
}
