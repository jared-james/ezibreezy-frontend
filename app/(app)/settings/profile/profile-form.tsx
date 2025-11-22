// app/(app)/settings/profile/profile-form.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { updateOrganizationName } from "@/app/actions/organization";
import { updateDisplayName } from "@/app/actions/user"; // Import new action
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
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [isUpdatingOrg, setIsUpdatingOrg] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

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

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || displayName === initialDisplayName) return;

    setIsUpdatingProfile(true);
    const result = await updateDisplayName(displayName);
    setIsUpdatingProfile(false);

    if (result.success) {
      toast.success("Display name updated successfully.");
    } else {
      toast.error(`Failed to update name: ${result.error}`);
      setDisplayName(initialDisplayName);
    }
  };

  const isProfileDirty =
    displayName.trim() !== initialDisplayName && displayName.trim().length > 0;
  const isOrgDirty =
    orgName.trim() !== initialOrgName && orgName.trim().length > 0;

  return (
    <form className="space-y-6">
      {/* Organization Information */}
      <div className="pb-6">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="font-serif text-lg font-bold text-foreground">
            Organization Details
          </h3>
          <div className="flex-1 h-px bg-border" />
        </div>
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
                disabled={isUpdatingOrg || !isOrgDirty}
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

      <div className="h-px bg-border/50" />

      {/* Personal Information */}
      <div className="pt-2 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="font-serif text-lg font-bold text-foreground">
            Personal Information
          </h3>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="space-y-4">
          <div>
            <label className="eyebrow mb-2">Full Name</label>
            <div className="flex gap-2 items-start pt-2">
              <Input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="John Doe"
                className="flex-1"
                disabled={isUpdatingProfile}
              />
              <Button
                type="button"
                variant="primary"
                onClick={handleProfileSubmit}
                disabled={isUpdatingProfile || !isProfileDirty}
              >
                {isUpdatingProfile ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>

          <div className="h-px bg-border/30" />

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
    </form>
  );
}
