// components/settings/profile/profile-form.tsx

// app/(app)/settings/profile/profile-form.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { updateDisplayName } from "@/app/actions/user";
import { toast } from "sonner";

interface ProfileFormProps {
  initialDisplayName: string;
  initialEmail: string;
}

export default function ProfileForm({
  initialDisplayName,
  initialEmail,
}: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

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

  return (
    <form className="space-y-6">
      {/* Personal Information */}
      <div className="pb-6">
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
            <p className="font-serif text-xs text-muted-foreground mt-1">
              This is how your name will appear to other team members.
            </p>
          </div>

          <div className="h-px bg-border/30" />

          <div>
            <label className="eyebrow mb-2">Email</label>
            <Input
              type="email"
              defaultValue={initialEmail}
              placeholder="john@example.com"
              disabled
              className="bg-muted text-muted-foreground"
            />
            <p className="font-serif text-xs text-muted-foreground mt-1">
              Contact support to change your email address.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
