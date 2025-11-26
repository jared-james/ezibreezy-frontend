// app/(app)/settings/integrations/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  getConnections,
  type Connection,
  disconnectAccount,
} from "@/lib/api/integrations";
import {
  InstagramConnectOptionsModal,
  AvailableChannelsSection,
  ConnectedChannelsSection,
} from "./components";
import { platformDefinitions } from "./constants";
import { PlatformDefinition } from "./types";
import ConnectAccountModal from "./components/connect-account-modal";

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
            <AvailableChannelsSection
              connections={connections}
              onPlatformClick={openConnectModal}
            />

            <ConnectedChannelsSection
              connections={connections}
              getPlatformForConnection={getPlatformForConnection}
              getSourceLabel={getSourceLabel}
              onDisconnect={handleDisconnect}
            />
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
