// components/settings/profile/profile-form.tsx

"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, AlertTriangle, KeyRound, Check } from "lucide-react";
import {
  updateDisplayName,
  updateEmail,
  triggerPasswordReset,
  updatePassword,
} from "@/app/actions/user";
import { useWorkspaceSlug } from "@/lib/hooks/use-workspace-path";
import { toast } from "sonner";

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

  // -- Profile State --
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // -- Email State --
  const [email, setEmail] = useState(initialEmail);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [emailVerificationPending, setEmailVerificationPending] =
    useState(false);

  // -- Password State --
  // Check if we are in "Recovery Mode" (User clicked email link)
  const isRecoveryMode = searchParams.get("recovery") === "true";
  const [newPassword, setNewPassword] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // 1. Handle Name Update
  const handleProfileSubmit = async () => {
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

  // 2. Handle Email Update
  const handleEmailSubmit = async () => {
    if (!email.trim() || email === initialEmail) return;

    setIsUpdatingEmail(true);
    const result = await updateEmail(email);
    setIsUpdatingEmail(false);

    if (result.success) {
      setEmailVerificationPending(true);
      toast.success("Request sent successfully.");
    } else {
      toast.error(`Failed to update email: ${result.error}`);
      setEmail(initialEmail);
    }
  };

  // 3a. Handle "Forgot Password" Click
  const handleSendResetEmail = async () => {
    if (!workspaceSlug) {
      toast.error("System error: Workspace context missing.");
      return;
    }

    setIsSendingReset(true);
    const result = await triggerPasswordReset(workspaceSlug);
    setIsSendingReset(false);

    if (result.success) {
      toast.success("Reset link sent!", {
        description: "Check your email for the secure password reset link.",
      });
    } else {
      toast.error(`Failed to send reset email: ${result.error}`);
    }
  };

  // 3b. Handle "Set New Password" Submit (Recovery Mode)
  const handleSetNewPassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsUpdatingPassword(true);
    const result = await updatePassword(newPassword);
    setIsUpdatingPassword(false);

    if (result.success) {
      toast.success("Password updated successfully!");
      setNewPassword("");
      // Clear the ?recovery=true param to return to normal state
      router.replace(pathname);
    } else {
      toast.error(`Failed to update password: ${result.error}`);
    }
  };

  const isProfileDirty =
    displayName.trim() !== initialDisplayName && displayName.trim().length > 0;
  const isEmailDirty = email.trim() !== initialEmail && email.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* =====================================================================
          SECTION: Personal Information
      ===================================================================== */}
      <div className="pb-6">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="font-serif text-lg font-bold text-foreground">
            Personal Information
          </h3>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="eyebrow mb-2">Name</label>
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

          {/* Email Field */}
          <div>
            <label className="eyebrow mb-2">Email</label>

            {emailVerificationPending ? (
              <div className="mt-2 rounded-sm border border-amber-200 bg-amber-50 p-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-amber-100 p-2 text-amber-600 border border-amber-200/50">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-serif text-sm font-bold text-amber-900">
                      Check your inboxes
                    </h4>
                    <p className="font-serif text-sm text-amber-800/80 leading-relaxed max-w-xl">
                      We have sent a confirmation link to <strong>both</strong>{" "}
                      your old address ({initialEmail}) and your new address (
                      {email}).
                    </p>
                    <div className="flex flex-col gap-2 pt-2">
                      <div className="flex items-center gap-2 text-xs font-mono text-amber-700 uppercase tracking-wide">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full border border-amber-400 bg-amber-100 font-bold">
                          1
                        </span>
                        <span>Click link in {initialEmail}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono text-amber-700 uppercase tracking-wide">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full border border-amber-400 bg-amber-100 font-bold">
                          2
                        </span>
                        <span>Click link in {email}</span>
                      </div>
                    </div>
                    <p className="pt-2 text-xs text-amber-700/60 italic">
                      The change will not take effect until both links are
                      clicked.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex gap-2 items-start pt-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="flex-1"
                    disabled={isUpdatingEmail}
                  />
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleEmailSubmit}
                    disabled={isUpdatingEmail || !isEmailDirty}
                  >
                    {isUpdatingEmail ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Change"
                    )}
                  </Button>
                </div>
                <p className="font-serif text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 text-amber-500/70" />
                  Security Note: You will need to verify this change via email
                  on both accounts.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================================
          SECTION: Security (Password)
      ===================================================================== */}
      <div className="pb-6">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="font-serif text-lg font-bold text-foreground">
            Security
          </h3>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="space-y-4">
          <div>
            <label className="eyebrow mb-2">Password</label>

            {isRecoveryMode ? (
              // -- STATE: RECOVERY MODE (Setting New Password) --
              <div className="rounded-sm border border-brand-primary/20 bg-brand-primary/5 p-6 animate-in fade-in">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white rounded-full border border-brand-primary/20 text-brand-primary">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h4 className="font-serif text-sm font-bold text-foreground">
                        Set New Password
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Please enter your new password below.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        type="password"
                        placeholder="New secure password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="flex-1 bg-white"
                      />
                      <Button
                        onClick={handleSetNewPassword}
                        disabled={isUpdatingPassword || newPassword.length < 6}
                        className="btn-primary"
                      >
                        {isUpdatingPassword ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-2" /> Update
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // -- STATE: NORMAL (Send Reset Link) --
              <div className="flex items-center justify-between p-4 border border-border rounded-sm bg-surface">
                <div className="space-y-1">
                  <p className="font-serif text-sm font-bold text-foreground">
                    Reset Password
                  </p>
                  <p className="font-serif text-xs text-muted-foreground">
                    Receive a secure link via email to set a new password.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleSendResetEmail}
                  disabled={isSendingReset}
                >
                  {isSendingReset ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Mail className="w-4 h-4 mr-2" />
                  )}
                  Send Reset Link
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
