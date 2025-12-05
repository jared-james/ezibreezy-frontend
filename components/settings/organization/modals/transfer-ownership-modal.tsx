// components/settings/organization/modals/transfer-ownership-modal.tsx

"use client";

import { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  Loader2,
  Scissors,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  getOrganizationMembers,
  transferOrganizationOwnership,
} from "@/app/actions/organization";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TransferOwnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
}

interface MemberCandidate {
  userId: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  orgRole: string;
}

export function TransferOwnershipModal({
  isOpen,
  onClose,
  organizationId,
}: TransferOwnershipModalProps) {
  const { currentWorkspace } = useWorkspaceStore(); // We use this to identify "me" via currentWorkspace.userId usually, but safer to rely on returned list filtering

  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [members, setMembers] = useState<MemberCandidate[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch members when modal opens
  useEffect(() => {
    if (isOpen && organizationId) {
      setIsFetching(true);
      getOrganizationMembers(organizationId)
        .then((result) => {
          if (result.success && Array.isArray(result.data)) {
            // Filter out Owners (likely yourself) from the candidate list
            // You can only transfer to Admins or Members
            const candidates = (result.data as any[]).filter(
              (m) => m.orgRole !== "owner"
            );
            setMembers(candidates);
          } else {
            toast.error("Failed to load potential owners.");
          }
        })
        .finally(() => setIsFetching(false));
    }
  }, [isOpen, organizationId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) return;

    setIsSubmitting(true);

    const result = await transferOrganizationOwnership(
      organizationId,
      selectedMemberId
    );

    if (result.success) {
      toast.success("Ownership transferred successfully.");
      // The server action revalidates the path, but we should close the modal
      onClose();
      // Force a hard refresh to ensure permission guards kick in on the frontend immediately
      window.location.reload();
    } else {
      toast.error(result.error || "Transfer failed.");
      setIsSubmitting(false);
    }
  };

  const selectedMember = members.find((m) => m.userId === selectedMemberId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#e5e5e0]/80 backdrop-blur-sm animate-in fade-in duration-200">
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
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-600/70 mb-2 flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" /> Security // Transfer
              </p>
              <h2 className="headline text-3xl font-bold tracking-tight text-foreground">
                Transfer Ownership
              </h2>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-4 font-serif text-sm text-foreground/80 leading-relaxed border-l-2 border-amber-500/30 pl-3">
            Transferring ownership is a{" "}
            <span className="font-bold text-amber-700">permanent action</span>.
            You will be downgraded to an Administrator.
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 pt-6">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mb-2" />
              <p className="font-serif text-xs">Loading candidates...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Select Input */}
              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground pl-1 flex items-center gap-2">
                  <UserCheck className="w-3 h-3" /> New Owner
                </label>

                <Select
                  value={selectedMemberId}
                  onValueChange={setSelectedMemberId}
                >
                  <SelectTrigger className="w-full h-14 bg-transparent border-0 border-b-2 border-dotted border-black/20 rounded-none px-0 font-serif text-xl focus:ring-0 focus:border-brand-primary focus:border-solid shadow-none">
                    <SelectValue placeholder="Select a member..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] bg-[#fdfbf7] border border-black/10 shadow-xl font-serif">
                    {members.length === 0 ? (
                      <div className="p-3 text-sm text-muted-foreground text-center italic">
                        No eligible members found.
                      </div>
                    ) : (
                      members.map((member) => (
                        <SelectItem
                          key={member.userId}
                          value={member.userId}
                          className="cursor-pointer focus:bg-black/5 focus:text-black py-3"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-6 w-6 border border-black/10">
                              <AvatarImage src={member.avatarUrl} />
                              <AvatarFallback className="text-[9px]">
                                {member.displayName?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col text-left">
                              <span className="font-bold text-sm leading-none">
                                {member.displayName}
                              </span>
                              <span className="text-[10px] text-muted-foreground leading-none mt-0.5">
                                {member.email}
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Warning Box (Only shows if someone is selected) */}
              {selectedMember && (
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-sm animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-xs uppercase tracking-wider text-amber-800">
                        Please Confirm
                      </p>
                      <p className="font-serif text-sm text-amber-900/80 leading-relaxed">
                        By clicking transfer,{" "}
                        <strong>{selectedMember.displayName}</strong> will
                        become the new Owner. You will lose access to billing
                        and organization deletion.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* "Cut Line" Separator */}
              <div className="flex items-center gap-2 text-black/20 py-2">
                <Scissors className="h-4 w-4 -rotate-90" />
                <div className="flex-1 border-b-2 border-dashed border-black/10" />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!selectedMemberId || isSubmitting}
                  className={cn(
                    "flex-[2] btn relative overflow-hidden transition-all flex items-center justify-center gap-2",
                    selectedMemberId
                      ? "bg-foreground text-background hover:bg-black/80"
                      : "bg-muted text-muted-foreground cursor-not-allowed border-transparent"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Transferring...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" /> Confirm Transfer
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
