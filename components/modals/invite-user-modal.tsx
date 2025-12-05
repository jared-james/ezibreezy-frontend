// components/modals/invite-user-modal.tsx

"use client";

import { useState } from "react";
import {
  X,
  Mail,
  Shield,
  Loader2,
  Send,
  Scissors,
  AlertCircle,
} from "lucide-react";
import { inviteUserToWorkspace } from "@/app/actions/workspaces";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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
    setError(null);

    try {
      const result = await inviteUserToWorkspace({
        workspaceId,
        email,
        role,
      });

      if (result.success) {
        toast.success(`Dispatched invite to ${email}`);
        onClose();
        setEmail("");
        setRole("editor");
      } else {
        setError(result.error || "Failed to dispatch invite");
      }
    } catch (error) {
      setError("Critical transmission error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setEmail(e.target.value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#e5e5e0]/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* 
        Container: 
        - Editorial paper color
        - Standard soft shadow instead of hard offset
        - Clean border
      */}
      <div
        className="
          relative w-full max-w-md 
          bg-[#fdfbf7] 
          border border-black/10
          shadow-2xl rounded-lg
          flex flex-col overflow-hidden
        "
        role="dialog"
        aria-modal="true"
      >
        {/* Header Section */}
        <div className="p-8 border-b border-black/5 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Internal Memo // New Personnel
              </p>
              <h2 className="headline text-3xl font-bold tracking-tight text-foreground">
                Team Admit
              </h2>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-4 font-serif text-sm text-foreground/80 leading-relaxed border-l-2 border-brand-primary pl-3">
            Granting access to{" "}
            <span className="font-bold border-b border-black/20 border-dotted">
              {workspaceName}
            </span>
            .
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email Input - "Fill in the blank" style */}
            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground pl-1">
                Recipient Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-0 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-brand-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  placeholder="editor@newsroom.com"
                  className={cn(
                    "w-full bg-transparent px-6 py-2 font-serif text-xl text-foreground placeholder:text-muted-foreground/40 outline-none transition-all",
                    "border-b-2 border-dotted border-black/20",
                    "focus:border-brand-primary focus:border-solid",
                    error && "border-red-500 border-solid text-red-600"
                  )}
                />
              </div>
            </div>

            {/* Role Selection - Minimal style */}
            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground pl-1">
                Security Clearance
              </label>
              <Select value={role} onValueChange={(val: any) => setRole(val)}>
                <SelectTrigger className="w-full h-12 bg-transparent border-0 border-b-2 border-dotted border-black/20 rounded-none px-0 font-serif text-xl focus:ring-0 focus:border-brand-primary focus:border-solid shadow-none">
                  <div className="flex items-center gap-3 px-1">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <SelectValue placeholder="Select Role" />
                  </div>
                </SelectTrigger>

                {/* Dropdown Content */}
                <SelectContent className="bg-[#fdfbf7] border border-black/10 shadow-xl font-serif">
                  <SelectItem
                    value="viewer"
                    className="cursor-pointer focus:bg-black/5 focus:text-black"
                  >
                    <div className="flex flex-col py-1">
                      <span className="font-bold uppercase text-xs tracking-wider">
                        Viewer
                      </span>
                      <span className="text-muted-foreground text-[10px]">
                        Read-only access
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="editor"
                    className="cursor-pointer focus:bg-black/5 focus:text-black"
                  >
                    <div className="flex flex-col py-1">
                      <span className="font-bold uppercase text-xs tracking-wider">
                        Editor
                      </span>
                      <span className="text-muted-foreground text-[10px]">
                        Create & publish
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="admin"
                    className="cursor-pointer focus:bg-black/5 focus:text-black"
                  >
                    <div className="flex flex-col py-1">
                      <span className="font-bold uppercase text-xs tracking-wider">
                        Admin
                      </span>
                      <span className="text-muted-foreground text-[10px]">
                        Full system control
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="border border-red-200 bg-red-50 p-3 flex items-start gap-3 rounded-sm">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                <p className="font-mono text-xs text-red-700 leading-relaxed">
                  <span className="font-bold">ERROR:</span> {error}
                </p>
              </div>
            )}

            {/* "Cut Line" Separator */}
            <div className="flex items-center gap-2 text-black/20 py-2">
              <Scissors className="h-4 w-4 -rotate-90" />
              <div className="flex-1 border-b-2 border-dashed border-black/10" />
            </div>

            {/* Actions - Standard Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="btn btn-outline flex-1"
              >
                Discard
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary flex-[2]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    Dispatch Invite <Send className="w-3 h-3 ml-2" />
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
