// components/modals/delete-workspace-modal.tsx

"use client";

import { useState } from "react";
import {
  X,
  Trash2,
  Loader2,
  Scissors,
  AlertTriangle,
  AlertOctagon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DeleteWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  workspaceName: string;
}

export function DeleteWorkspaceModal({
  isOpen,
  onClose,
  onConfirm,
  workspaceName,
}: DeleteWorkspaceModalProps) {
  const [confirmName, setConfirmName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmName !== workspaceName) return;

    setIsLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      setIsLoading(false);
    }
  };

  const isMatch = confirmName === workspaceName;

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
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-600/70 mb-2 flex items-center gap-2">
                <AlertOctagon className="w-3 h-3" /> System // Termination
              </p>
              <h2 className="headline text-3xl font-bold tracking-tight text-red-700">
                Delete Workspace
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

          <div className="mt-4 font-serif text-sm text-foreground/80 leading-relaxed border-l-2 border-red-500/30 pl-3">
            This action is{" "}
            <span className="font-bold text-red-700">irreversible</span>.
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 pt-6">
          <form onSubmit={handleConfirm} className="space-y-8">
            {/* Warning Box */}
            <div className="bg-red-50 border border-red-100 p-4 rounded-sm">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-3 w-full">
                  <p className="font-bold text-xs uppercase tracking-wider text-red-800">
                    Final Confirmation Required
                  </p>
                  <div className="font-serif text-sm text-red-700/80 leading-snug flex flex-col gap-1">
                    <span>Please type the workspace name:</span>
                    <span className="font-bold text-lg text-red-900 select-all py-1">
                      "{workspaceName}"
                    </span>
                    <span>below to confirm deletion.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Input */}
            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground pl-1">
                Verification Key
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={confirmName}
                  onChange={(e) => setConfirmName(e.target.value)}
                  placeholder={workspaceName}
                  disabled={isLoading}
                  className={cn(
                    "w-full bg-transparent px-0 py-2 font-serif text-xl text-foreground placeholder:text-muted-foreground/30 outline-none transition-all",
                    "border-b-2 border-dotted border-black/20",
                    "focus:border-red-500 focus:border-solid",
                    isMatch && "text-red-700 border-red-500 border-solid"
                  )}
                />
              </div>
            </div>

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
                disabled={isLoading}
                className="btn btn-outline flex-1"
              >
                Abort
              </button>

              <button
                type="submit"
                disabled={!isMatch || isLoading}
                className={cn(
                  "flex-[2] btn relative overflow-hidden transition-all flex items-center justify-center gap-2",
                  isMatch
                    ? "bg-red-600 hover:bg-red-700 text-white border-transparent shadow-sm"
                    : "bg-muted text-muted-foreground cursor-not-allowed border-transparent"
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" /> Delete
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
