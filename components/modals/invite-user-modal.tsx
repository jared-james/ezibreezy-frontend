// components/modals/invite-user-modal.tsx

"use client";

import { useState } from "react";
import { X, Mail, Shield, Loader2, Send, AlertTriangle } from "lucide-react";
import { inviteUserToWorkspace } from "@/app/actions/workspaces";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  workspaceName: string;
}

export function InviteUserModal({
  isOpen,
  onClose,
  workspaceId,
  workspaceName,
}: InviteUserModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "editor" | "viewer">("editor");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null); // Clear previous errors on new attempt

    try {
      const result = await inviteUserToWorkspace({
        workspaceId,
        email,
        role,
      });

      if (result.success) {
        toast.success(`Invite sent to ${email}`);
        onClose();
        setEmail(""); // Reset form
        setRole("editor");
      } else {
        // Set the error state instead of showing a toast
        setError(result.error || "Failed to send invite");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error when user changes input to let them know they are trying again
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setEmail(e.target.value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-surface border border-border shadow-2xl rounded-sm overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-sm hover:bg-surface-hover z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8">
          <div className="mb-6">
            <h2 className="headline text-2xl">Invite Team Member</h2>
            <p className="font-serif text-sm text-muted-foreground mt-2">
              Send an invitation to join{" "}
              <span className="font-bold text-foreground">{workspaceName}</span>
              .
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-muted-foreground">
                <Mail className="w-3.5 h-3.5" /> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                placeholder="colleague@example.com"
                className={`w-full px-4 py-3 bg-background border focus:ring-1 transition-all font-serif ${
                  error
                    ? "border-error focus:border-error focus:ring-error"
                    : "border-border focus:border-foreground focus:ring-foreground"
                }`}
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-muted-foreground">
                <Shield className="w-3.5 h-3.5" /> Role Permission
              </label>
              <Select value={role} onValueChange={(val: any) => setRole(val)}>
                <SelectTrigger className="w-full h-[50px] px-4 bg-background border-border font-serif text-base">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent className="font-serif">
                  <SelectItem value="viewer">
                    <span className="font-bold">Viewer</span> - Can only view
                    content
                  </SelectItem>
                  <SelectItem value="editor">
                    <span className="font-bold">Editor</span> - Can create &
                    edit posts
                  </SelectItem>
                  <SelectItem value="admin">
                    <span className="font-bold">Admin</span> - Full workspace
                    access
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* INLINE ERROR MESSAGE */}
            {error && (
              <div className="p-3 bg-error/5 border border-error/20 flex items-start gap-3 rounded-sm animate-in slide-in-from-top-1">
                <AlertTriangle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-error uppercase tracking-wider mb-1">
                    Unable to Invite
                  </h4>
                  <p className="text-sm text-error/90 font-medium leading-tight">
                    {error}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary flex-1 gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Invite
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
