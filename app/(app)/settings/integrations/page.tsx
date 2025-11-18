// app/(app)/settings/integrations/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Twitter,
  Linkedin,
  Youtube,
  Link as LinkIcon,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ConnectAccountModal from "@/components/connect-account-modal";
import { toast } from "sonner";
import {
  getConnections,
  Connection,
  disconnectAccount,
} from "@/lib/api/integrations";

type PlatformDefinition = {
  id: "x" | "linkedin" | "youtube";
  name: string;
  icon: React.ElementType;
  description: string;
};

const platformDefinitions: PlatformDefinition[] = [
  {
    id: "x",
    name: "Twitter / X",
    icon: Twitter,
    description: "Connect your X accounts to post and schedule threads.",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    description: "Connect your LinkedIn profile to publish articles and posts.",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    description: "Connect your YouTube channel to manage video content.",
  },
];

export default function IntegrationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] =
    useState<PlatformDefinition | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: connections = [],
    isLoading,
    error,
  } = useQuery<Connection[]>({
    queryKey: ["connections"],
    queryFn: getConnections,
  });

  useEffect(() => {
    console.log("Query state:", { isLoading, error, connections });
  }, [isLoading, error, connections]);

  useEffect(() => {
    const connected = searchParams.get("connected");
    const errorParam = searchParams.get("error");

    if (connected) {
      toast.success("Account connected successfully!");
      queryClient.invalidateQueries({ queryKey: ["connections"] });
      router.replace("/settings/integrations", { scroll: false });
    }

    if (errorParam) {
      toast.error("Connection failed. Please try again.");
      router.replace("/settings/integrations", { scroll: false });
    }
  }, [searchParams, router, queryClient]);

  const openConnectModal = (platform: PlatformDefinition) => {
    setSelectedPlatform(platform);
    setIsModalOpen(true);
  };

  const handleDisconnect = async (platformId: string, accountId: string) => {
    try {
      await disconnectAccount(platformId, accountId);
      toast.success("Account disconnected.");
      queryClient.invalidateQueries({ queryKey: ["connections"] });
    } catch (error) {
      toast.error("Failed to disconnect account.");
      console.error("Disconnect error:", error);
    }
  };

  return (
    <>
      <div>
        <div className="border-b-2 border-foreground pb-3 mb-6">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Integrations & Connections
          </h2>
          <p className="font-serif text-muted mt-1">
            Connect your social media accounts to publish content directly from
            EziBreezy.
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted" />
          </div>
        )}

        {error && (
          <div className="border border-error bg-red-50 p-4 text-center">
            <p className="font-serif text-sm text-error">
              Failed to load connections: {error.message}
            </p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-6">
            {platformDefinitions.map((platform) => {
              const Icon = platform.icon;
              const connectedAccounts = connections.filter(
                (c) => c.platform === platform.id
              );

              return (
                <div
                  key={platform.id}
                  className="border border-border bg-background p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 flex items-center justify-center border border-border bg-surface">
                        <Icon className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-lg text-foreground">
                          {platform.name}
                        </h3>
                        <p className="font-serif text-sm text-muted">
                          {platform.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0">
                      <Button onClick={() => openConnectModal(platform)}>
                        <LinkIcon className="w-4 h-4" />
                        Connect New Account
                      </Button>
                    </div>
                  </div>

                  {connectedAccounts.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-dashed border-border">
                      <p className="eyebrow mb-3">Connected Accounts</p>
                      <div className="space-y-3">
                        {connectedAccounts.map((account) => (
                          <div
                            key={account.id}
                            className="flex items-center justify-between p-3 bg-surface border border-border hover:border-border-hover transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  account.avatarUrl || // Changed from profileImageUrl
                                  "/placeholder-pfp.png"
                                }
                                alt={account.platformUsername} // Changed from username
                                className="w-8 h-8 rounded-full bg-muted border border-border"
                              />
                              <span className="font-serif text-sm font-bold text-foreground">
                                @{account.platformUsername}{" "}
                                {/* Changed from username */}
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-error/30 bg-error/5 text-error hover:bg-error hover:text-error-foreground hover:border-error transition-all"
                              onClick={() =>
                                handleDisconnect(platform.id, account.id)
                              }
                            >
                              <X className="w-4 h-4 mr-1" />
                              Disconnect
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedPlatform && (
        <ConnectAccountModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          platformName={selectedPlatform.name}
          platformIcon={selectedPlatform.icon}
          platformId={selectedPlatform.id}
        />
      )}
    </>
  );
}
