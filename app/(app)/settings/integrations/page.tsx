// app/(app)/settings/integrations/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Twitter,
  Linkedin,
  Youtube,
  X,
  Loader2,
  Instagram,
  AlertTriangle,
  Facebook,
  AtSign,
  Music2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ConnectAccountModal from "@/components/connect-account-modal";
import { toast } from "sonner";
import {
  getConnections,
  type Connection,
  disconnectAccount,
} from "@/lib/api/integrations";
import { cn } from "@/lib/utils";

type PlatformDefinition = {
  id:
    | "x"
    | "linkedin"
    | "youtube"
    | "instagram"
    | "facebook"
    | "threads"
    | "tiktok";
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
    id: "threads",
    name: "Threads",
    icon: AtSign,
    description:
      "Connect your Threads profile to publish text, images, and videos.",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Music2,
    description: "Connect your TikTok account to publish videos.",
  },
  {
    id: "facebook",
    name: "Facebook Page",
    icon: Facebook,
    description:
      "Connect your Facebook Page to publish posts, photos, and videos.",
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

interface InstagramConnectOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: PlatformDefinition;
}

const InstagramConnectOptionsModal: React.FC<
  InstagramConnectOptionsModalProps
> = ({ isOpen, onClose, platform }) => {
  if (!isOpen) return null;

  const handleConnect = (
    authType: "facebook_business" | "instagram_business"
  ) => {
    try {
      window.sessionStorage.setItem("connecting_platform", platform.id);
    } catch (e) {
      console.error("Could not save to sessionStorage", e);
    }

    const routePlatformId =
      authType === "instagram_business"
        ? "instagram-direct"
        : "instagram-facebook";

    const connectUrl = `/api/integrations/${routePlatformId}/connect`;

    window.location.href = connectUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-surface border border-foreground shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center bg-background">
              <Instagram className="w-8 h-8 text-foreground" />
            </div>
          </div>
          <p className="eyebrow text-center mb-2">Integration</p>
          <h2 className="text-center font-serif text-3xl font-bold uppercase tracking-tight text-foreground mb-6">
            Connect Instagram
          </h2>

          <div className="space-y-5 text-foreground mb-8">
            <p className="text-center font-serif text-base leading-relaxed">
              Instagram requires a connection through a Facebook Page, unless
              you are using a Creator/Business account without a linked page.
              Choose the best option for you:
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="outline"
              onClick={() => handleConnect("instagram_business")}
              className="min-w-48 font-serif uppercase tracking-[0.12em]"
            >
              Connect with Instagram
            </Button>
            <Button
              variant="primary"
              onClick={() => handleConnect("facebook_business")}
              className="min-w-48 font-serif uppercase tracking-[0.12em]"
            >
              Connect with Facebook
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

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

  const getPlatformForConnection = (connection: Connection) => {
    return platformDefinitions.find((p) => p.id === connection.platform);
  };

  const getSourceLabel = (account: Connection) => {
    if (account.platform !== "instagram") return null;
    const loginType = account.settings?.loginType;
    if (loginType === "facebook_business") return "via Facebook";
    if (loginType === "instagram_business") return "via Instagram";
    return null;
  };

  return (
    <>
      <div>
        <div className="mb-8 border-b-2 border-foreground pb-3">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Manage Channels
          </h2>
          <p className="font-serif text-sm text-muted-foreground mt-1">
            Connect and manage your social media accounts.
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
          <div className="space-y-8">
            {/* Connected Channels Section */}
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
                    No channels connected yet. Add one below to get started.
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
                      <div
                        key={account.id}
                        className={cn(
                          "flex items-center gap-4 p-4 transition-colors hover:bg-muted/10",
                          requiresReauth && "bg-error/5"
                        )}
                      >
                        <img
                          src={account.avatarUrl || "/placeholder-pfp.png"}
                          alt={account.platformUsername}
                          className="h-10 w-10 rounded-full border border-border bg-muted shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-sm font-bold text-foreground truncate">
                              {account.name || `@${account.platformUsername}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Icon className="h-3 w-3" />
                            <span className="font-serif text-xs">
                              {platform.name}
                              {sourceLabel && (
                                <span className="text-muted-foreground/70">
                                  {" "}
                                  · {sourceLabel}
                                </span>
                              )}
                            </span>
                          </div>

                          {requiresReauth && (
                            <div className="flex items-center gap-1.5 mt-1.5">
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

                        <button
                          className="shrink-0 font-serif text-xs uppercase tracking-[0.12em] px-3 py-1.5 border border-border text-muted-foreground hover:border-error hover:text-error hover:bg-error/5 transition-colors"
                          onClick={() =>
                            handleDisconnect(platform.id, account.id)
                          }
                        >
                          Disconnect
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Add Channel Section */}
            <section>
              <div className="border-t-2 border-b border-foreground pt-2 pb-1.5 mb-6">
                <p className="font-serif text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Available Channels
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border">
                {platformDefinitions.map((platform) => {
                  const Icon = platform.icon;
                  const connectedCount = connections.filter(
                    (c) => c.platform === platform.id
                  ).length;

                  return (
                    <button
                      key={platform.id}
                      onClick={() => openConnectModal(platform)}
                      className="group flex items-center gap-4 p-5 bg-background hover:bg-surface-hover transition-colors text-left"
                    >
                      <Icon className="h-5 w-5 text-foreground shrink-0" />

                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-sm font-semibold text-foreground">
                          {platform.name}
                        </p>
                        {connectedCount > 0 && (
                          <p className="font-serif text-xs text-muted-foreground italic">
                            {connectedCount} account{connectedCount > 1 ? "s" : ""} connected
                          </p>
                        )}
                      </div>

                      <span className="shrink-0 font-serif text-xs uppercase tracking-[0.12em] px-3 py-1.5 border border-border text-muted-foreground group-hover:border-foreground group-hover:text-foreground transition-colors">
                        Connect
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </div>

      {selectedPlatform?.id === "instagram" && (
        <InstagramConnectOptionsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          platform={selectedPlatform}
        />
      )}

      {selectedPlatform && selectedPlatform.id !== "instagram" && (
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
