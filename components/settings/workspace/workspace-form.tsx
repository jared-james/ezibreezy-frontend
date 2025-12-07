// components/settings/workspace/workspace-form.tsx

"use client";

import {
  Briefcase,
  Globe,
  AlertTriangle,
  Loader2,
  Check,
  Save,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkspaceForm } from "./hooks/use-workspace-form";

interface Workspace {
  id: string;
  name: string;
  slug: string;
  timezone: string;
}

interface WorkspaceFormProps {
  workspace: Workspace;
  workspaceIdFromUrl?: string; // Fallback identifier from URL
}

export function WorkspaceForm({ workspace, workspaceIdFromUrl }: WorkspaceFormProps) {
  const {
    formData,
    setFormData,
    loading,
    error,
    success,
    hasChanges,
    handleUpdate,
  } = useWorkspaceForm(workspace, workspaceIdFromUrl);

  return (
    <section>
      <div className="max-w-2xl mb-8">
        <h3 className="font-serif text-xl font-bold text-foreground tracking-tight">
          Workspace Details
        </h3>
        <p className="font-serif text-sm text-muted-foreground mt-2 leading-relaxed max-w-lg">
          Manage your workspace's basic information and settings.
        </p>
      </div>

      <div className="space-y-8 max-w-3xl">
        <div className="space-y-4">
          <label className="eyebrow block">Workspace Name</label>
          <div className="flex items-center gap-4 border-b border-border hover:border-foreground/30 transition-colors pb-2">
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              maxLength={50}
              required
              placeholder="e.g. Editorial Team"
              className="flex-1 h-auto py-2 bg-transparent border-none rounded-none text-xl font-serif text-foreground placeholder:text-muted-foreground/20 px-0 focus-visible:ring-0 shadow-none outline-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="eyebrow block">Timezone</label>
          <div className="border-b border-border hover:border-foreground/30 transition-colors pb-2">
            <Select
              value={formData.timezone}
              onValueChange={(value) =>
                setFormData({ ...formData, timezone: value })
              }
            >
              <SelectTrigger className="w-full h-auto py-2 bg-transparent border-none rounded-none px-0 font-serif text-xl focus:ring-0 shadow-none">
                <SelectValue placeholder="Select Timezone" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] bg-[#fdfbf7] border border-black/10 shadow-xl font-serif">
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
                  Eastern Time (US & Canada)
                </SelectItem>
                <SelectItem
                  value="America/Chicago"
                  className="cursor-pointer focus:bg-black/5 focus:text-black"
                >
                  Central Time (US & Canada)
                </SelectItem>
                <SelectItem
                  value="America/Denver"
                  className="cursor-pointer focus:bg-black/5 focus:text-black"
                >
                  Mountain Time (US & Canada)
                </SelectItem>
                <SelectItem
                  value="America/Los_Angeles"
                  className="cursor-pointer focus:bg-black/5 focus:text-black"
                >
                  Pacific Time (US & Canada)
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
        </div>

        {error && (
          <div className="border border-red-200 bg-red-50 p-3 flex items-start gap-3 rounded-sm animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
            <p className="font-mono text-xs text-red-700 leading-relaxed">
              <span className="font-bold">ERROR:</span> {error}
            </p>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleUpdate}
            disabled={loading || !hasChanges}
            className={`btn btn-primary h-8 px-4 transition-all duration-300 ${
              hasChanges
                ? "opacity-100 translate-x-0"
                : "opacity-0 pointer-events-none translate-x-4"
            }`}
          >
            {loading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              "Save"
            )}
          </button>
          {success && (
            <span className="flex items-center gap-2 text-brand-primary font-medium text-sm animate-in fade-in">
              <Check className="w-4 h-4" /> Saved Successfully
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
