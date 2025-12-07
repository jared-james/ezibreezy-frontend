// components/settings/profile/profile-form.tsx

"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowRight, Check, AlertTriangle } from "lucide-react";
import {
  updateDisplayName,
  updateEmail,
  triggerPasswordReset,
  updatePassword,
} from "@/app/actions/user";
import { useWorkspaceSlug } from "@/lib/hooks/use-workspace-path";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProfileFormProps {
  initialDisplayName: string;
  initialEmail: string;
}

export default function ProfileForm({
  initialDisplayName,
  initialEmail,
}: ProfileFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const workspaceSlug = useWorkspaceSlug();

  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const [email, setEmail] = useState(initialEmail);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [emailVerificationPending, setEmailVerificationPending] =
    useState(false);

  const isRecoveryMode = searchParams.get("recovery") === "true";
  const [newPassword, setNewPassword] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleProfileSubmit = async () => {
    if (!displayName.trim() || displayName === initialDisplayName) return;
    setIsUpdatingProfile(true);
    const result = await updateDisplayName(displayName);
    setIsUpdatingProfile(false);
    if (result.success) toast.success("Display name updated.");
    else {
      toast.error(result.error);
      setDisplayName(initialDisplayName);
    }
  };

  const handleEmailSubmit = async () => {
    if (!email.trim() || email === initialEmail) return;
    setIsUpdatingEmail(true);
    const result = await updateEmail(email);
    setIsUpdatingEmail(false);
    if (result.success) {
      setEmailVerificationPending(true);
      toast.success("Verification email sent.");
    } else {
      toast.error(result.error);
      setEmail(initialEmail);
    }
  };

  const handleSendResetEmail = async () => {
    if (!workspaceSlug) return;
    setIsSendingReset(true);
    const result = await triggerPasswordReset(workspaceSlug);
    setIsSendingReset(false);
    if (result.success) toast.success("Reset link sent to your email.");
    else toast.error(result.error);
  };

  const handleSetNewPassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be 6+ chars.");
      return;
    }
    setIsUpdatingPassword(true);
    const result = await updatePassword(newPassword);
    setIsUpdatingPassword(false);
    if (result.success) {
      toast.success("Password updated.");
      setNewPassword("");
      router.replace(pathname);
    } else toast.error(result.error);
  };

  const isProfileDirty =
    displayName.trim() !== initialDisplayName && displayName.trim().length > 0;
  const isEmailDirty = email.trim() !== initialEmail && email.trim().length > 0;

  return (
    <div className="space-y-12">
      {/* =====================================================================
          SECTION: Personal Information
      ===================================================================== */}
      <section>
        <div className="max-w-2xl mb-8">
          <h3 className="font-serif text-xl font-bold text-foreground tracking-tight">
            Personal Information
          </h3>
          <p className="font-serif text-sm text-muted-foreground mt-2 leading-relaxed max-w-lg">
            This information will be displayed on your profile and visible to
            other members of your workspaces.
          </p>
        </div>

        {/* Using space-y-8 (2rem) for clearer separation between fields */}
        <div className="space-y-8 max-w-3xl">
          {/* Display Name */}
          <div className="space-y-4">
            <label className="eyebrow block">Display Name</label>
            <div className="flex items-center gap-4 border-b border-border hover:border-foreground/30 transition-colors pb-2">
              <Input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="John Doe"
                // Removing default input styles to match "flat" look
                className="flex-1 h-auto py-2 bg-transparent border-none rounded-none text-xl font-serif text-foreground placeholder:text-muted-foreground/20 px-0 focus-visible:ring-0 shadow-none"
                disabled={isUpdatingProfile}
              />
              <button
                type="button"
                onClick={handleProfileSubmit}
                disabled={isUpdatingProfile || !isProfileDirty}
                // Using global .btn and .btn-primary classes
                className={cn(
                  "btn btn-primary h-8 px-4 transition-all duration-300",
                  isProfileDirty
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 pointer-events-none translate-x-4"
                )}
              >
                {isUpdatingProfile ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-4">
            <label className="eyebrow block">Email Address</label>

            {emailVerificationPending ? (
              <div className="pl-4 border-l-2 border-brand-accent py-2">
                <h4 className="font-serif text-lg font-bold text-foreground mb-1">
                  Check your inbox
                </h4>
                <p className="font-serif text-sm text-muted-foreground">
                  Verification links sent to {initialEmail} and {email}.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-4 border-b border-border hover:border-foreground/30 transition-colors pb-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="flex-1 h-auto py-2 bg-transparent border-none rounded-none text-xl font-serif text-foreground placeholder:text-muted-foreground/20 px-0 focus-visible:ring-0 shadow-none"
                    disabled={isUpdatingEmail}
                  />
                  <button
                    type="button"
                    onClick={handleEmailSubmit}
                    disabled={isUpdatingEmail || !isEmailDirty}
                    className={cn(
                      "btn btn-primary h-8 px-4 transition-all duration-300",
                      isEmailDirty
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 pointer-events-none translate-x-4"
                    )}
                  >
                    {isUpdatingEmail ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      "Change"
                    )}
                  </button>
                </div>
                {isEmailDirty && (
                  <div className="flex items-center gap-2 pt-2 text-warning">
                    <AlertTriangle className="w-3 h-3" />
                    <p className="font-serif text-xs">
                      Requires verification on both addresses
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Separator - Using border-border */}
      <div className="w-full border-t border-dashed border-border" />

      {/* =====================================================================
          SECTION: Security
      ===================================================================== */}
      <section>
        <div className="max-w-2xl mb-8">
          <h3 className="font-serif text-xl font-bold text-foreground tracking-tight">
            Security
          </h3>
          <p className="font-serif text-sm text-muted-foreground mt-2 leading-relaxed max-w-lg">
            Manage your password and authentication methods.
          </p>
        </div>

        <div className="space-y-8 max-w-3xl">
          <div className="space-y-4">
            <label className="eyebrow block">Password</label>

            {isRecoveryMode ? (
              // -- Recovery Mode --
              <div className="flex items-center gap-4 border-b border-border hover:border-foreground/30 transition-colors pb-2">
                <Input
                  type="password"
                  placeholder="New secure password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="flex-1 h-auto py-2 bg-transparent border-none rounded-none text-xl font-serif text-foreground placeholder:text-muted-foreground/20 px-0 focus-visible:ring-0 shadow-none"
                />
                <button
                  onClick={handleSetNewPassword}
                  disabled={isUpdatingPassword || newPassword.length < 6}
                  className="btn btn-primary h-8 px-4"
                >
                  {isUpdatingPassword ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-3 h-3 mr-2" /> Update
                    </>
                  )}
                </button>
              </div>
            ) : (
              // -- Standard Mode --
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="font-serif text-xl text-foreground tracking-widest select-none">
                  ••••••••••••••••
                </div>
                <button
                  type="button"
                  onClick={handleSendResetEmail}
                  disabled={isSendingReset}
                  className="btn btn-primary h-8 text-[10px] px-4"
                >
                  {isSendingReset ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      Reset via Email <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
