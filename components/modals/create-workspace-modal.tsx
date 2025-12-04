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
} from "lucide-react";

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
      // Refresh workspace structure
      const structureResult = await getWorkspaceStructure();
      if (structureResult.success && structureResult.data) {
        setStructure(structureResult.data);
      }

      // Switch to new workspace
      setCurrentWorkspace(result.data.id);

      // Call success callback
      onSuccess?.(result.data);

      // Refresh the page to update all components
      router.refresh();

      onClose();
    } else {
      setError(result.error || "Failed to create workspace");
      setLoading(false);
    }
  };

  if (eligibleOrgs.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-surface border border-border shadow-2xl rounded-lg p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-error/10 flex items-center justify-center text-error border border-error/20">
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-surface border border-border shadow-2xl rounded-lg w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-border bg-surface-hover/50">
          <p className="eyebrow text-brand-primary mb-2">Registration</p>
          <h2 className="headline text-2xl font-bold text-foreground">
            New Workspace
          </h2>
          <p className="font-serif text-sm text-muted-foreground mt-1">
            Initialize a new environment for your projects.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 md:p-8 space-y-5 bg-surface"
        >
          {/* Organization Select */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5" /> Organization
            </label>
            <Select
              value={formData.organizationId}
              onValueChange={(value) =>
                setFormData({ ...formData, organizationId: value })
              }
            >
              <SelectTrigger className="w-full bg-background font-serif">
                <SelectValue placeholder="Select Organization" />
              </SelectTrigger>
              <SelectContent>
                {eligibleOrgs.map((node) => (
                  <SelectItem
                    key={node.organization.id}
                    value={node.organization.id}
                  >
                    {node.organization.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Workspace Name Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5" /> Workspace Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Q4 Marketing Campaign"
              maxLength={50}
              required
              className="w-full h-10 px-3 rounded-md border border-input bg-background font-serif text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          {/* Timezone Select */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" /> Timezone
            </label>
            <Select
              value={formData.timezone}
              onValueChange={(value) =>
                setFormData({ ...formData, timezone: value })
              }
            >
              <SelectTrigger className="w-full bg-background font-serif">
                <SelectValue placeholder="Select Timezone" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                <SelectItem value="UTC">UTC (Universal Time)</SelectItem>
                <SelectItem value="America/New_York">Eastern Time</SelectItem>
                <SelectItem value="America/Chicago">Central Time</SelectItem>
                <SelectItem value="America/Denver">Mountain Time</SelectItem>
                <SelectItem value="America/Los_Angeles">
                  Pacific Time
                </SelectItem>
                <SelectItem value="Europe/London">London</SelectItem>
                <SelectItem value="Europe/Paris">Paris</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                <SelectItem value="Australia/Sydney">Sydney</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-md bg-error/5 border border-error/20 flex items-start gap-2 text-error animate-in slide-in-from-top-1">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span className="text-xs font-medium leading-tight">{error}</span>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-4 flex flex-col-reverse sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Create Workspace"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
