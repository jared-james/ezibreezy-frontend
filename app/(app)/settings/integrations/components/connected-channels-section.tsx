// app/(app)/settings/integrations/components/connected-channels-section.tsx

// components/connected-channels-section.tsx
"use client";

import { AlertTriangle } from "lucide-react";
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
    <section>
      <div className="flex items-center gap-2 mb-4">
        <p className="eyebrow text-muted-foreground">Your Channels</p>
        <span className="text-xs text-muted-foreground">
          ({connections.length})
        </span>
      </div>

      {connections.length === 0 ? (
        <div className="border border-dashed border-border bg-background/50 p-8 text-center">
          <p className="font-serif text-sm text-muted-foreground">
            No channels connected yet. Add one above to get started.
          </p>
        </div>
      ) : (
        <div className="border border-border divide-y divide-border">
          {connections.map((account) => {
            const platform = getPlatformForConnection(account);
            if (!platform) return null;
            const Icon = platform.icon;
            const sourceLabel = getSourceLabel(account);
            const requiresReauth = account.requiresReauth;

            return (
              <div key={account.id}>
                <div
                  className={cn(
                    "flex items-center gap-4 p-4 transition-colors hover:bg-muted/10",
                    requiresReauth && "bg-error/5"
                  )}
                >
                  {/* Display photo */}
                  <img
                    src={account.avatarUrl || "/placeholder-pfp.png"}
                    alt={account.platformUsername}
                    className="h-10 w-10 rounded-full border border-border bg-muted shrink-0"
                  />

                  {/* Logo of social company */}
                  <Icon className="h-5 w-5 text-foreground shrink-0" />

                  {/* Name of account */}
                  <span className="font-serif text-sm font-bold text-foreground truncate">
                    {account.name || `@${account.platformUsername}`}
                  </span>

                  {/* Network type (via facebook, etc.) */}
                  {sourceLabel && (
                    <span className="font-serif text-xs text-muted-foreground whitespace-nowrap">
                      {sourceLabel}
                    </span>
                  )}

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Disconnect button */}
                  <button
                    className="shrink-0 font-serif text-xs uppercase tracking-[0.12em] px-3 py-1.5 border border-border text-muted-foreground hover:border-error hover:text-error hover:bg-error/5 transition-colors"
                    onClick={() => onDisconnect(platform.id, account.id)}
                  >
                    Disconnect
                  </button>
                </div>

                {/* Re-auth warning on separate line if needed */}
                {requiresReauth && (
                  <div className="flex items-center gap-1.5 px-4 pb-3 bg-error/5">
                    <AlertTriangle className="w-3 h-3 text-error" />
                    <span className="font-serif text-xs text-error">
                      Re-authentication required
                      {account.authErrorMessage && (
                        <span className="italic">
                          {" "}
                          — {account.authErrorMessage}
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
