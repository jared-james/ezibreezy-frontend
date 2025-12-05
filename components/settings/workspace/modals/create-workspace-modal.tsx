// components/settings/workspace/modals/create-workspace-modal.tsx

// components/modals/create-workspace-modal.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { usePermissions } from "@/lib/hooks/use-permissions";
import {
  createWorkspace,
  getWorkspaceStructure,
} from "@/app/actions/workspaces";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Loader2,
  Building2,
  Globe,
  Briefcase,
  Scissors,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateWorkspaceModalProps {
  onClose: () => void;
  onSuccess?: (workspace: { id: string; name: string }) => void;
}

export function CreateWorkspaceModal({
  onClose,
  onSuccess,
}: CreateWorkspaceModalProps) {
  const router = useRouter();
  const { structure, setStructure, setCurrentWorkspace } = useWorkspaceStore();
  const { canCreateWorkspace } = usePermissions();

  const [formData, setFormData] = useState({
    organizationId: "",
    name: "",
    timezone: "UTC",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filter to orgs where user is owner/admin
  const eligibleOrgs = structure.filter((node) =>
    canCreateWorkspace(node.organization.id)
  );

  // Default to first eligible org
  if (!formData.organizationId && eligibleOrgs.length > 0) {
    setFormData((prev) => ({
      ...prev,
      organizationId: eligibleOrgs[0].organization.id,
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await createWorkspace(formData);

    if (result.success && result.data) {
      const structureResult = await getWorkspaceStructure();
      if (structureResult.success && structureResult.data) {
        setStructure(structureResult.data);
      }
      setCurrentWorkspace(result.data.id);
      onSuccess?.(result.data);
      router.refresh();
      onClose();
    } else {
      setError(result.error || "Failed to create workspace");
      setLoading(false);
    }
  };

  // Access Denied State
  if (eligibleOrgs.length === 0) {
    return (
      <div className="fixed inset-0 bg-[#e5e5e0]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#fdfbf7] border border-black/10 shadow-2xl rounded-lg p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 border border-red-100">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
          <h2 className="headline text-xl font-bold mb-2">Access Denied</h2>
          <p className="font-serif text-sm text-muted-foreground mb-6 leading-relaxed">
            You need to be an owner or admin of an organization to create
            workspaces.
          </p>
          <button onClick={onClose} className="btn btn-outline w-full">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#e5e5e0]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="
          relative w-full max-w-lg 
          bg-[#fdfbf7] 
          border border-black/10 
          shadow-2xl rounded-lg 
          flex flex-col overflow-hidden
        "
      >
        {/* Header */}
        <div className="p-8 border-b border-black/5 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                System // Expansion
              </p>
              <h2 className="headline text-3xl font-bold tracking-tight text-foreground">
                New Workspace
              </h2>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-8">
          {/* Organization Select */}
          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground pl-1 flex items-center gap-2">
              <Building2 className="w-3 h-3" /> Organization
            </label>
            <Select
              value={formData.organizationId}
              onValueChange={(value) =>
                setFormData({ ...formData, organizationId: value })
              }
            >
              <SelectTrigger className="w-full h-12 bg-transparent border-0 border-b-2 border-dotted border-black/20 rounded-none px-0 font-serif text-xl focus:ring-0 focus:border-brand-primary focus:border-solid shadow-none">
                <SelectValue placeholder="Select Organization" />
              </SelectTrigger>
              <SelectContent className="bg-[#fdfbf7] border border-black/10 shadow-xl font-serif">
                {eligibleOrgs.map((node) => (
                  <SelectItem
                    key={node.organization.id}
                    value={node.organization.id}
                    className="cursor-pointer focus:bg-black/5 focus:text-black"
                  >
                    <span className="font-bold">{node.organization.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Workspace Name Input */}
          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground pl-1 flex items-center gap-2">
              <Briefcase className="w-3 h-3" /> Workspace Name
            </label>
            <div className="relative group">
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Q4 Marketing Campaign"
                maxLength={50}
                required
                className="w-full bg-transparent px-0 py-2 font-serif text-xl text-foreground placeholder:text-muted-foreground/40 outline-none transition-all border-b-2 border-dotted border-black/20 focus:border-brand-primary focus:border-solid"
              />
            </div>
          </div>

          {/* Timezone Select */}
          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground pl-1 flex items-center gap-2">
              <Globe className="w-3 h-3" /> Timezone
            </label>
            <Select
              value={formData.timezone}
              onValueChange={(value) =>
                setFormData({ ...formData, timezone: value })
              }
            >
              <SelectTrigger className="w-full h-12 bg-transparent border-0 border-b-2 border-dotted border-black/20 rounded-none px-0 font-serif text-xl focus:ring-0 focus:border-brand-primary focus:border-solid shadow-none">
                <SelectValue placeholder="Select Timezone" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] bg-[#fdfbf7] border border-black/10 shadow-xl font-serif">
                <SelectItem
                  value="UTC"
                  className="cursor-pointer focus:bg-black/5 focus:text-black"
                >
                  UTC (Universal Time)
                </SelectItem>
                <SelectItem
                  value="America/New_York"
                  className="cursor-pointer focus:bg-black/5 focus:text-black"
                >
                  Eastern Time
                </SelectItem>
                <SelectItem
                  value="America/Chicago"
                  className="cursor-pointer focus:bg-black/5 focus:text-black"
                >
                  Central Time
                </SelectItem>
                <SelectItem
                  value="America/Denver"
                  className="cursor-pointer focus:bg-black/5 focus:text-black"
                >
                  Mountain Time
                </SelectItem>
                <SelectItem
                  value="America/Los_Angeles"
                  className="cursor-pointer focus:bg-black/5 focus:text-black"
                >
                  Pacific Time
                </SelectItem>
                <SelectItem
                  value="Europe/London"
                  className="cursor-pointer focus:bg-black/5 focus:text-black"
                >
                  London
                </SelectItem>
                <SelectItem
                  value="Europe/Paris"
                  className="cursor-pointer focus:bg-black/5 focus:text-black"
                >
                  Paris
                </SelectItem>
                <SelectItem
                  value="Asia/Tokyo"
                  className="cursor-pointer focus:bg-black/5 focus:text-black"
                >
                  Tokyo
                </SelectItem>
                <SelectItem
                  value="Australia/Sydney"
                  className="cursor-pointer focus:bg-black/5 focus:text-black"
                >
                  Sydney
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="border border-red-200 bg-red-50 p-3 flex items-start gap-3 rounded-sm">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
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

          {/* Footer Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn btn-outline flex-1"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-[2]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Confirm & Create"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
