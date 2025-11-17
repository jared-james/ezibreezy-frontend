// app/(app)/settings/integrations/page.tsx
// Social platform integrations

import { CheckCircle2, Share2 } from "lucide-react";

const platforms = [
  {
    name: "Twitter / X",
    icon: Share2,
    description: "Connect your Twitter account to post and schedule tweets",
    connected: false,
  },
  {
    name: "LinkedIn",
    icon: Share2,
    description: "Share professional content on your LinkedIn profile",
    connected: false,
  },
  {
    name: "Facebook",
    icon: Share2,
    description: "Post to your Facebook page or profile",
    connected: false,
  },
  {
    name: "Instagram",
    icon: Share2,
    description: "Schedule posts and stories to Instagram",
    connected: false,
  },
];

export default function IntegrationsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Integrations</h2>
      <p className="text-gray-600 mb-8">
        Connect your social media accounts to publish content
      </p>

      <div className="space-y-4">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <div
              key={platform.name}
              className="flex items-center justify-between p-6 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Icon className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {platform.name}
                    </h3>
                    {platform.connected && (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {platform.description}
                  </p>
                </div>
              </div>

              {platform.connected ? (
                <button className="px-4 py-2 text-red-600 hover:text-red-700 font-medium text-sm border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                  Disconnect
                </button>
              ) : (
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors">
                  Connect
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> You can connect multiple accounts for each
          platform. Manage your connected accounts after connecting.
        </p>
      </div>
    </div>
  );
}
