// components/settings/workspace/create-workspace-card.tsx

import { Plus } from "lucide-react";

interface CreateWorkspaceCardProps {
  onCreateClick: () => void;
}

export function CreateWorkspaceCard({
  onCreateClick,
}: CreateWorkspaceCardProps) {
  return (
    <div className="group flex flex-col p-6 border-2 border-dashed border-brand-accent/30 bg-brand-accent/[0.02] hover:bg-brand-accent/[0.05] hover:border-brand-accent/60 transition-all duration-300">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-brand-accent transition-colors">
          New Workspace
        </h3>
        <Plus className="w-5 h-5 text-brand-accent opacity-50 group-hover:opacity-100 transition-opacity" />
      </div>

      <p className="font-serif text-sm text-muted-foreground mb-6">
        Create a separate environment for a new client or project to keep assets
        organized.
      </p>

      <button
        onClick={onCreateClick}
        className="mt-auto w-full py-3 border border-dashed border-primary text-primary hover:bg-primary/10 hover:border-primary transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
      >
        Create New Workspace
      </button>
    </div>
  );
}
