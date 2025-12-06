// components/settings/integrations/index.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import posthog from "posthog-js";
import { type Connection } from "@/lib/types/integrations";
import {
  getConnectionsAction,
  disconnectAccountAction,
} from "@/app/actions/integrations";
import { AvailableChannelsSection } from "./available-channels-section";
import { ConnectedChannelsSection } from "./connected-channels-section";
import { platformDefinitions } from "./constants";
import { PlatformDefinition } from "./types";
import { InstagramConnectOptionsModal } from "./modals/instagram-connect-modal";
import ConnectAccountModal from "./modals/connect-account-modal";

export function IntegrationsSettings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] =
    useState<PlatformDefinition | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams();
  const workspaceId = params.workspace as string;

  const {
    data: connections = [],
    error,
  } = useQuery<Connection[]>({
    queryKey: ["connections", workspaceId],
    queryFn: async () => {
      const result = await getConnectionsAction(workspaceId);
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
  });

  useEffect(() => {
    const connected = searchParams.get("connected");
    const errorParam = searchParams.get("error");
    const platform = searchParams.get("platform");

    if (connected) {
      toast.success("Account connected successfully!");
      // Track successful social account connection
      posthog.capture("social_account_connected", {
        platform: platform || connected,
        connection_status: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["connections", workspaceId] });
      router.replace("/settings/integrations", { scroll: false });
    }

    if (errorParam) {
      toast.error("Connection failed. Please try again.");
      // Track integration connection failure
      posthog.capture("integration_connection_failed", {
        platform: platform || "unknown",
        error_message: errorParam,
        connection_status: "failed",
      });
      queryClient.invalidateQueries({ queryKey: ["connections", workspaceId] });
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
      const result = await disconnectAccountAction(platformId, accountId, workspaceId);
      if (!result.success) {
        throw new Error(result.error);
      }
      toast.success("Account disconnected.");
      // Track social account disconnection
      posthog.capture("social_account_disconnected", {
        platform: platformId,
        account_id: accountId,
      });
      queryClient.invalidateQueries({ queryKey: ["connections", workspaceId] });
    } catch (err) {
      toast.error("Failed to disconnect account.");
      console.error("Disconnect error:", err);
      // Track disconnection error
      if (err instanceof Error) {
        posthog.captureException(err);
      }
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

        {error && (
          <div className="border border-error bg-error/5 p-4 text-center">
            <p className="font-serif text-sm text-error">{errorMessage}</p>
          </div>
        )}

        {!error && (
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
              onResync={openConnectModal}
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
