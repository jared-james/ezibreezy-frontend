// components/settings/workspace/team-operations-card.tsx

import { Users } from "lucide-react";

interface TeamOperationsCardProps {
  onInviteClick: () => void;
}

export function TeamOperationsCard({ onInviteClick }: TeamOperationsCardProps) {
  return (
    <div className="group border border-border p-6 bg-surface hover:border-foreground/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-lg font-bold">Team Members</h3>
        <Users className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>
      <p className="font-serif text-sm text-muted-foreground mb-6 h-10">
        Manage members and collaborators within this workspace environment.
      </p>
      <button
        onClick={onInviteClick}
        className="w-full py-3 border border-dashed border-primary text-primary hover:bg-primary/10 hover:border-primary transition-all text-xs font-bold uppercase tracking-wider"
      >
        Invite User
      </button>
    </div>
  );
}
