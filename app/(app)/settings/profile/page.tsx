// app/(app)/settings/profile/page.tsx
// User profile settings - data collected during onboarding

export default function ProfileSettingsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile</h2>
      <p className="text-gray-600 mb-8">
        Manage your personal information and content preferences
      </p>

      <form className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Personal Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* About You */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            About You
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tell us about yourself
              </label>
              <textarea
                rows={4}
                placeholder="I'm a content creator who focuses on..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                This helps our AI generate more relevant content ideas for you
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry / Niche
              </label>
              <input
                type="text"
                placeholder="e.g., SaaS, Marketing, Fitness"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Content Goals */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Content Goals
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What are your main content goals?
              </label>
              <div className="space-y-2">
                {[
                  "Build audience",
                  "Drive traffic",
                  "Generate leads",
                  "Establish thought leadership",
                  "Share knowledge",
                ].map((goal) => (
                  <label
                    key={goal}
                    className="flex items-center gap-2 p-2 rounded hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target audience
              </label>
              <input
                type="text"
                placeholder="e.g., Startup founders, Marketing professionals"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
