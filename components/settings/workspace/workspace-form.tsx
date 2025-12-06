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
    <div className="relative">
      <div className="absolute -top-3 left-4 bg-surface px-2 z-10">
        <span className="eyebrow text-foreground bg-brand-accent/10 px-2 py-0.5 border border-brand-accent/20">
          Identity Card
        </span>
      </div>

      <form
        onSubmit={handleUpdate}
        className="border-1 border-border p-6 md:p-8 space-y-6 bg-surface"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-muted-foreground">
              <Briefcase className="w-3.5 h-3.5" /> Workspace Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              maxLength={50}
              required
              className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-all font-serif"
              placeholder="e.g. Editorial Team"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-muted-foreground">
              <Globe className="w-3.5 h-3.5" /> Timezone
            </label>
            <Select
              value={formData.timezone}
              onValueChange={(value) =>
                setFormData({ ...formData, timezone: value })
              }
            >
              <SelectTrigger className="w-full h-[50px] px-4 bg-background border-border font-serif text-base focus:ring-foreground/20">
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

        <div className="pt-4 border-t border-dashed border-border flex items-center justify-between">
          <div className="text-sm">
            {error && (
              <span className="flex items-center gap-2 text-error font-medium animate-in fade-in">
                <AlertTriangle className="w-4 h-4" /> {error}
              </span>
            )}
            {success && (
              <span className="flex items-center gap-2 text-brand-primary font-medium animate-in fade-in">
                <Check className="w-4 h-4" /> Saved Successfully
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !hasChanges}
            className={`btn btn-primary transition-all duration-200 ${
              !hasChanges || loading
                ? "opacity-50 cursor-not-allowed grayscale"
                : ""
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
