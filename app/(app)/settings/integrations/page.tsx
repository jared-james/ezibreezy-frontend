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
  AlertTriangle,
  Facebook,
  AtSign, // Added AtSign
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
  id: "x" | "linkedin" | "youtube" | "instagram" | "facebook" | "threads";
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
    if (platform.id === "instagram") {
      setSelectedPlatform(platform);
      setIsModalOpen(true);
      return;
    }

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

  const getSourceBadge = (account: Connection) => {
    if (account.platform !== "instagram") return null;

    const loginType = account.settings?.loginType;

    if (loginType === "facebook_business") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 ml-2">
          <Facebook className="h-3 w-3" />
          via Facebook
        </span>
      );
    }
    if (loginType === "instagram_business") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-2 py-0.5 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10 ml-2">
          <Instagram className="h-3 w-3" />
          via Instagram
        </span>
      );
    }
    return null;
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
                  className="border border-border bg-surface"
                >
                  <div className="p-5 flex flex-col md:flex-row md:items-start md:justify-between">
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
                    <div className="border-t border-border">
                      <div className="divide-y divide-border">
                        {connectedAccounts.map((account) => {
                          const requiresReauth = account.requiresReauth;
                          const authErrorMessage = account.authErrorMessage;

                          return (
                            <div
                              key={account.id}
                              className={cn(
                                "flex flex-col sm:flex-row items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/20",
                                requiresReauth && "bg-error/5 hover:bg-error/10"
                              )}
                            >
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <img
                                  src={
                                    account.avatarUrl || "/placeholder-pfp.png"
                                  }
                                  alt={account.platformUsername}
                                  className="h-8 w-8 rounded-full border border-border bg-muted shrink-0 mt-0.5"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center flex-wrap gap-y-1">
                                    <span className="font-serif text-sm font-bold text-foreground truncate">
                                      {account.name ||
                                        `@${account.platformUsername}`}
                                    </span>

                                    {getSourceBadge(account)}
                                  </div>

                                  <span className="font-serif text-xs text-muted-foreground block truncate">
                                    @{account.platformUsername}
                                  </span>

                                  {requiresReauth && (
                                    <div className="flex items-center gap-2 mt-2 p-2 bg-error-hover/20 border border-error/50 rounded-sm">
                                      <AlertTriangle className="w-4 h-4 text-error shrink-0" />
                                      <p className="font-serif text-xs text-error">
                                        Re-authentication required.
                                        {authErrorMessage && (
                                          <span className="font-medium ml-1 italic">
                                            ({authErrorMessage})
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="shrink-0">
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
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
