// app/(app)/settings/integrations/page.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Twitter, Linkedin, Youtube, Link as LinkIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConnectAccountModal from "@/components/connect-account-modal";
import { toast } from "sonner";

// ... (Keep Platform and Account types)
type Platform = {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  accounts: Account[];
};
type Account = {
  id: string;
  username: string;
  avatar: string;
};

const initialPlatforms: Platform[] = [
  {
    id: "x",
    name: "Twitter / X",
    icon: Twitter,
    description: "Connect your X accounts to post and schedule threads.",
    accounts: [],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    description: "Share professional content on your LinkedIn profile.",
    accounts: [],
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    description: "Connect your YouTube channel to manage content.",
    accounts: [],
  },
];

export default function IntegrationsPage() {
  const [platforms, setPlatforms] = useState<Platform[]>(initialPlatforms);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    null
  );

  const searchParams = useSearchParams();
  const router = useRouter();

  const handleConnect = useCallback((platform: Platform) => {
    const newAccount: Account = {
      id: `${platform.id}-${Math.random()}`,
      username: `@mock_${platform.id}_${(Math.random() * 100).toFixed(0)}`,
      avatar: "/placeholder-pfp.png",
    };

    setPlatforms((prevPlatforms) =>
      prevPlatforms.map((p) =>
        p.id === platform.id
          ? { ...p, accounts: [...p.accounts, newAccount] }
          : p
      )
    );
  }, []);

  useEffect(() => {
    const connected = searchParams.get("connected");
    const error = searchParams.get("error");

    if (connected) {
      toast.success("Account connected successfully!");

      // --- THIS IS THE FIX ---
      // 1. Check sessionStorage to see which platform was connected.
      const platformId = window.sessionStorage.getItem("connecting_platform");
      if (platformId) {
        // 2. Find that platform in our state and update the UI.
        const platformToUpdate = platforms.find((p) => p.id === platformId);
        if (platformToUpdate) {
          handleConnect(platformToUpdate);
        }
        // 3. Clean up the sessionStorage.
        window.sessionStorage.removeItem("connecting_platform");
      }

      router.replace("/settings/integrations", { scroll: false });
    }

    if (error) {
      toast.error("Connection failed. Please try again.");
      window.sessionStorage.removeItem("connecting_platform"); // Also clean up on error
      router.replace("/settings/integrations", { scroll: false });
    }
  }, [searchParams, router, handleConnect, platforms]);

  const openConnectModal = (platform: Platform) => {
    setSelectedPlatform(platform);
    setIsModalOpen(true);
  };

  const handleDisconnect = (platformId: string, accountId: string) => {
    setPlatforms(
      platforms.map((p) =>
        p.id === platformId
          ? { ...p, accounts: p.accounts.filter((a) => a.id !== accountId) }
          : p
      )
    );
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

        <div className="space-y-6">
          {platforms.map((platform) => {
            const Icon = platform.icon;
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

                {platform.accounts.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-dashed border-border">
                    <p className="eyebrow mb-3">Connected Accounts</p>
                    <div className="space-y-3">
                      {platform.accounts.map((account: Account) => (
                        <div
                          key={account.id}
                          className="flex items-center justify-between p-3 bg-surface border border-border"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={account.avatar}
                              alt={account.username}
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="font-serif text-sm font-bold text-foreground">
                              {account.username}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted hover:text-error"
                            onClick={() =>
                              handleDisconnect(platform.id, account.id)
                            }
                          >
                            <X className="w-4 h-4" />
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
