// app/(app)/settings/integrations/components/connected-channels-section.tsx

"use client";

import { AlertTriangle, Trash2, ArrowRight } from "lucide-react";
import { Connection } from "@/lib/api/integrations";
import { cn } from "@/lib/utils";
import { PlatformDefinition } from "../types";

interface ConnectedChannelsSectionProps {
  connections: Connection[];
  getPlatformForConnection: (
    connection: Connection
  ) => PlatformDefinition | undefined;
  getSourceLabel: (account: Connection) => string | null;
  onDisconnect: (platformId: string, accountId: string) => void;
}

export const ConnectedChannelsSection: React.FC<
  ConnectedChannelsSectionProps
> = ({
  connections,
  getPlatformForConnection,
  getSourceLabel,
  onDisconnect,
}) => {
  return (
    <section className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <p className="eyebrow text-foreground">Your Channels</p>
        <span className="flex items-center justify-center h-5 px-2 rounded-full bg-surface-hover border border-border text-[10px] font-bold text-muted-foreground">
          {connections.length}
        </span>
      </div>

      {connections.length === 0 ? (
        <div className="border border-dashed border-border bg-background/50 p-8 text-center rounded-sm">
          <p className="font-serif text-sm text-muted-foreground">
            No channels connected yet. Select a channel above to get started.
          </p>
        </div>
      ) : (
        <div className="flex flex-col rounded-sm border-t border-b border-dashed border-border divide-y divide-dashed divide-border bg-surface">
          {connections.map((account) => {
            const platform = getPlatformForConnection(account);
            if (!platform) return null;
            const Icon = platform.icon;
            const sourceLabel = getSourceLabel(account);
            const requiresReauth = account.requiresReauth;

            return (
              <div
                key={account.id}
                className={cn(
                  "group relative flex items-center gap-4 p-4 md:px-6 transition-colors",
                  requiresReauth && "bg-error/5"
                )}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface border border-border text-foreground shadow-sm"
                  title={platform.name}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="hidden sm:block text-border">
                  <ArrowRight className="w-3 h-3" />
                </div>

                <img
                  src={account.avatarUrl || "/placeholder-pfp.png"}
                  alt={account.platformUsername}
                  className="h-10 w-10 shrink-0 rounded-full border border-border bg-muted object-cover"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className="font-serif text-sm font-bold text-foreground truncate">
                      {account.name || `@${account.platformUsername}`}
                    </span>

                    <div className="flex items-center gap-2">
                      {sourceLabel && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm border border-border bg-background text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                          {sourceLabel}
                        </span>
                      )}

                      {requiresReauth && (
                        <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider text-error">
                          <AlertTriangle className="w-3 h-3" /> Re-auth Required
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-error/20 bg-error/5 text-error transition-all hover:bg-error/10 hover:border-error/40"
                  onClick={() => onDisconnect(platform.id, account.id)}
                  aria-label={`Disconnect ${platform.name}`}
                >
                  <span className="font-serif text-xs uppercase tracking-[0.12em] hidden sm:inline-block">
                    Disconnect
                  </span>
                  <Trash2 className="w-4 h-4 sm:hidden" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
