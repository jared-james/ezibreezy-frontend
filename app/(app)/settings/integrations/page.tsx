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
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ConnectAccountModal from "@/components/connect-account-modal";
import { toast } from "sonner";
import {
  getConnections,
  type Connection,
  disconnectAccount,
} from "@/lib/api/integrations";

type PlatformDefinition = {
  id: "x" | "linkedin" | "youtube" | "instagram";
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
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    description:
      "Connect your Instagram accounts to publish posts, carousels, and Reels.",
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
    const connected = searchParams.get("connected");
    const errorParam = searchParams.get("error");

    if (connected) {
      toast.success("Account connected successfully!");
      queryClient.invalidateQueries({ queryKey: ["connections"] });
      router.replace("/settings/integrations", { scroll: false });
    }

    if (errorParam) {
      toast.error("Connection failed. Please try again.");
      queryClient.invalidateQueries({ queryKey: ["connections"] });
      router.replace("/settings/integrations", { scroll: false });
    }
  }, [searchParams, router, queryClient]);

  const errorMessage =
    error instanceof Error
      ? error.message
      : "Something went wrong loading your connections. Please try again.";

  const openConnectModal = (platform: PlatformDefinition) => {
    setSelectedPlatform(platform);
    setIsModalOpen(true);
  };

  const handleDisconnect = async (platformId: string, accountId: string) => {
    try {
      await disconnectAccount(platformId, accountId);
      toast.success("Account disconnected.");
      queryClient.invalidateQueries({ queryKey: ["connections"] });
    } catch (err) {
      toast.error("Failed to disconnect account.");
      console.error("Disconnect error:", err);
    }
  };

  return (
    <>
      <div>
        <div className="mb-6 border-b-2 border-foreground pb-3">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Integrations & Connections
          </h2>
          <p className="font-serif text-sm text-muted-foreground mt-1">
            Connect your social media accounts to publish content directly from
            EziBreezy.
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && !isLoading && (
          <div className="border border-error bg-error/5 p-4 text-center">
            <p className="font-serif text-sm text-error">{errorMessage}</p>
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
                  className="border border-border bg-surface p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center border border-border bg-background">
                        <Icon className="h-5 w-5 text-foreground" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-bold text-foreground">
                          {platform.name}
                        </h3>
                        <p className="font-serif text-sm text-muted-foreground">
                          {platform.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 shrink-0 md:mt-0 md:ml-4">
                      <Button onClick={() => openConnectModal(platform)}>
                        <LinkIcon className="h-4 w-4" />
                        Connect New Account
                      </Button>
                    </div>
                  </div>

                  {connectedAccounts.length > 0 && (
                    <div className="mt-4 border-t border-dashed border-border pt-4">
                      <p className="eyebrow mb-3">Connected Accounts</p>
                      <div className="space-y-3">
                        {connectedAccounts.map((account) => (
                          <div
                            key={account.id}
                            className="flex items-center justify-between border border-border bg-surface hover:border-border-hover p-3 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  account.avatarUrl || "/placeholder-pfp.png"
                                }
                                alt={account.platformUsername}
                                className="h-8 w-8 rounded-full border border-border bg-muted"
                              />
                              <span className="font-serif text-sm font-bold text-foreground">
                                @{account.platformUsername}
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-error/30 bg-error/5 text-error transition-all hover:border-error hover:bg-error hover:text-error-foreground"
                              onClick={() =>
                                handleDisconnect(platform.id, account.id)
                              }
                            >
                              <X className="mr-1 h-4 w-4" />
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
